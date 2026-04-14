<template>
  <m-development-v2 :id="id">
    <!-- <pre>{{ JSON.stringify(baseRulesMap, null, 2) }}</pre> -->
    <template v-if="initialization == 1">
      <div class="m-form-v2" :class="[props.class]" :style="{ ...props.style }">
        <m-form-v2-control
          :id="id || 'default'"
          ref="FormControlRef"
          :rules="useRequired ? baseRulesMap['default'] : undefined"
          :model="formData"
        >
          <template v-for="(itemConfigs, itemConfigsIndex) in inMultipleConfig" :key="itemConfigs.unitName">
            <!-- Group组标题 -->
            <template v-if="itemConfigs.unitName != 'default'">
              <m-title-v2 :padding="[itemConfigsIndex != 0 ? 'top' : 'null']">
                <div ref="RefUnitContainer">{{ itemConfigs.unitName }}</div>
                <m-popover-v2 v-if="itemConfigs.unitTip" trigger="hover" :teleport-to="RefUnitContainer" placement="top">
                  <template #reference>
                    <m-icon-v2 name="question_line" class="m-form-v2-title_label-icon"></m-icon-v2>
                  </template>
                  <div>{{ itemConfigs.unitTip }}</div>
                </m-popover-v2>
              </m-title-v2>
            </template>

            <!-- body -->
            <m-row-v2 :gutter="'calc(var(--m-component-padding-size, 10px) / 4)'">
              <template v-for="item in itemConfigs.configs" :key="String(item.prop)">
                <!-- tabs 表 -->
                <m-col-v2 v-if="item.type == 'tabs-form'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <tabsItem
                    :id="id"
                    @set-ref="refBody => setRuleTabsFormRef(refBody, item.prop as string)"
                    :item="item"
                    :rules="baseRulesMap"
                  >
                    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                      <slot :name="slot" v-bind="scope"></slot>
                    </template>
                  </tabsItem>
                </m-col-v2>

                <!-- 标准表格 -->
                <formItem v-else :id="id" :item="item">
                  <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                    <slot :name="slot" :config="item" :data="scope.data"></slot>
                  </template>
                </formItem>
              </template>
            </m-row-v2>
          </template>
        </m-form-v2-control>
      </div>
    </template>
    <div v-else-if="initialization == -1" class="m-loading-v2">
      <m-icon-v2 class="loading_font" name="loading_line"></m-icon-v2>
    </div>

    <div v-else class="config-error">{{ configContext.languagePackage["warning"] }}</div>
  </m-development-v2>
</template>

<script lang="tsx" setup>
// # Import
import {
  ref,
  Ref,
  reactive,
  defineEmits,
  watch,
  nextTick,
  computed,
  provide,
  onMounted,
  onUnmounted,
  ComputedRef,
  inject
} from "vue";
import lodashPkg, { debounce } from "lodash";
import mFormV2Control from "./m-form-v2-control.vue";

import inBrowser from "../tools/inBrowser";

import tabsItem from "./components/tabs-item.vue";
import formItem from "./form-basics-element.vue";

import { MFormV2ItemType, MFormV2ChildType, MFormV2Props, ConfigContextType, FormDataType } from "./type";
import { ExMultipleConfigType, MultipleConfigType } from "./type";
import { DatePickerShortcut } from "../m-time-v2/type";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

// # Var
const { cloneDeep, isEqual } = lodashPkg;

const props = withDefaults(defineProps<MFormV2Props>(), {
  contrastData: () => ({}),
  useRequired: true,
  noLabel: false,
  labelWidth: "auto",
  exOptions: () => ({}),
  exDependent: () => ({
    disabledRule: {},
    disabledDateFn: {}
  }),
  exCellDependent: () => ({
    select_RequestApi: {},
    file_attachedData: {},
    time_disabledDateFn: {},
    time_shortcuts: {} as { [x: string]: DatePickerShortcut[] }
  }),
  freeLabel: true,
  display: false,
  useTopTitle: true,
  titlePosition: ""
});

const emit = defineEmits(["formDataChange", "formCellChange", "onFormStateChange"]);

/**
 * 初始化状态
 * -1 加载中
 * -2 配置错误
 * 0 未初始化
 * 1 已初始化
 */
const initialization: Ref<-1 | -2 | 0 | 1> = ref(0);
const useRequired = ref(true);
const FormControlRef = ref();
const inRules: Ref<Record<string, any>> = ref({});
const baseRulesMap: Ref<Record<string, any>> = ref({});

const RefUnitContainer = ref();

const baseSpanSize = ref(6);
const itemSpanSize = ref({} as Record<string, number>);
const baseItemSpanSize = {} as Record<string, number>;

const formData: Ref<FormDataType> = ref(cloneDeep(props.data) || {});
const inConfigObj: Record<string, any> = {};

const ruleTabsFormRef: Record<string, { submitTabsForm: () => Promise<boolean | undefined> }> = {};
// const setRuleTabsFormRefDebounce = debounce(setRuleTabsFormRef, 200, { trailing: true });
const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const injectSetScrollToIntersect = inject("setScrollToIntersect") as (
  el: Element,
  callback?: () => void,
  options?: { offsetY?: number }
) => void;

const configContext: Ref<ConfigContextType> = ref({
  labelWidth: computed(() => props.labelWidth),
  labelPosition: computed(() => props.labelPosition),
  baseSpanSize: computed(() => baseSpanSize.value),
  itemSpanSize: computed(() => itemSpanSize.value),
  data: computed(() => formData.value),
  contrastData: computed(() => props.contrastData),
  alwaysContrast: computed(() => props.alwaysContrast),
  display: computed(() => props.display),
  languagePackage: computed(() => ManagerGlobalConfig.value?.language?.package?.["form"] || {}),
  language: computed(() => ManagerGlobalConfig.value?.language?.value || "zh-CN"),
  exOptions: computed(() => props.exOptions),
  exDependent: computed(() => props.exDependent),
  exCellDependent: computed(() => props.exCellDependent),
  useRequired: computed(() => props.useRequired),
  noLabel: computed(() => props.noLabel)
});
// 提供给子组件的数据和方法
provide("configContext", configContext);

function setRuleTabsFormRef(el: { submitTabsForm: () => Promise<boolean | undefined> }, key: string) {
  if (el) {
    ruleTabsFormRef[key] = el;
  }
}

const inMultipleConfigKeys: string[] = [];
const inMultipleConfig = reactive([] as MultipleConfigType[]);

const exCellConfig = ref({});

const formState = ref("Pending");
provide("changeFormState", (data: string) => (formState.value = data));

provide("formCellChange", (data: FormDataType) => emit("formCellChange", data));

// const _debounce = debounce(structure => setConfigData(structure), 200, { trailing: true });

// const structure: MFormV2ItemType[] = [];
const baseFormData: Record<string, Array<string> | string> = {};
const inConfig: Ref<MFormV2ItemType[]> = ref(cloneDeep(props.structure || []));

// # Function 初始化单行列数
function createSpanStyle() {
  if (inBrowser) {
    if (props.exSpan) {
      if (props.exSpan == 1) {
        baseSpanSize.value = 24;
      } else if (props.exSpan == 2) {
        baseSpanSize.value = 12;
      } else if (props.exSpan == 3) {
        baseSpanSize.value = 8;
      } else if (props.exSpan == 4) {
        baseSpanSize.value = 6;
      }
    } else {
      const boxWidth = window.document?.getElementById(props.id || "default");
      if (!boxWidth) return;
      const maxSpanList = {
        4: [6, 8, 12, 24],
        3: [8, 8, 12, 24],
        2: [12, 12, 12, 24],
        1: [24, 24, 24, 24]
      };
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          const containerWidth = entry.contentRect.width;
          if (containerWidth > 1140) {
            baseSpanSize.value = maxSpanList[props.maxSpan || 4][0];
          } else if (containerWidth > 724) {
            baseSpanSize.value = maxSpanList[props.maxSpan || 4][1];
          } else if (containerWidth > 370) {
            baseSpanSize.value = maxSpanList[props.maxSpan || 4][2];
          } else {
            baseSpanSize.value = maxSpanList[props.maxSpan || 4][3];
          }
        }
        for (const key in itemSpanSize.value) {
          itemSpanSize.value[key] = baseItemSpanSize[key];
          if (itemSpanSize.value[key] < baseSpanSize.value) {
            itemSpanSize.value[key] = baseSpanSize.value;
          }
        }
      });

      observer.observe(boxWidth);
      onUnmounted(() => observer.disconnect());
    }
  }
}

// # Function  解析·校验规则
function setRule(
  item: MFormV2ChildType | MFormV2ItemType,
  type = "default",
  options?: { titleKey?: string; removeList?: string[] }
) {
  if (options?.removeList && options?.removeList?.length > 0) {
    const list = options.removeList;
    for (const item of list) {
      delete inRules.value[type][item];
    }
  }

  if (!inRules.value[type]) {
    inRules.value[type] = {};
  }

  const baseRules =
    item.display || item.disabled
      ? []
      : [{ required: true, message: configContext.value.languagePackage["requiredMessage"], trigger: "blur" }];
  // if (item.type == "select" || item.type == "multiple-select" || item.type == "number") {
  //   baseRules = [{ required: true, message: "此项为必填项", trigger: "change" }];
  // }
  // const _rules = item?.isText == true ? [] : item.rules ? item.rules : [{ required: true, message: "此项为必填项", trigger: "blur" }];
  let _rules = baseRules;
  if (item.rules && Array.isArray(item.rules)) {
    let isRequired = true;
    _rules = item.rules.map(item => {
      if (item.required == false) {
        isRequired = false;
      }
      const data = {
        trigger: "blur",
        required: item.required || true,
        ...item,
        message:
          typeof item.message == "string"
            ? item.message
            : item.message?.[ManagerGlobalConfig.value?.language?.value || "zh-CN"] ||
              configContext.value.languagePackage["requiredMessage"]
      };
      return data;
    });

    if (!isRequired) {
      item.rules = false;
    }
  }

  if (item.required == false || item.prop == options?.titleKey) {
    item.rules = false;
  }

  // >-------------> 强制不使用校验 <------------<
  const _prop = item.prop as string;
  if (!props.useRequired || !useRequired.value) {
    inRules.value[type][_prop] = item.display || item.disabled ? [] : item.rules || [];
    return;
  }

  if (_prop && item.rules != false && _rules.length) {
    const _baseRules = props.exDependent?.exCellRules || {};
    if (_baseRules[_prop]) {
      inRules.value[type][_prop] = [..._rules, ..._baseRules[_prop]];
    } else {
      inRules.value[type][_prop] = _rules;
    }
  }

  baseRulesMap.value[type] = cloneDeep(inRules.value[type]);
}
provide("setRule", setRule);

// # Function  解析·多form情况
function setMultipleConfig(configItem: ExMultipleConfigType, baseIndex: number) {
  const _groupName =
    typeof configItem.unitName == "object"
      ? configItem.unitName?.[ManagerGlobalConfig.value?.language?.value || "zh-CN"]
      : configItem.unitName || "default";
  const _index = inMultipleConfigKeys.indexOf(_groupName);

  // >-------------> 处理 表格 的 group 组 <------------<
  if (configItem.tabsFormConfig?.length) {
    // const inMultipleTabsConfigKeys: string[] = [];
    // configItem.inMultipleConfig = [];
    // const { exClassName } = getFormBoxInfo();

    let _prop = "";
    if (configItem.prop) {
      _prop = Array.isArray(configItem.prop) ? configItem.prop.join("-") : configItem.prop;
    }

    const propsArr = configItem.tabsFormConfig.map(item => item.prop);
    configItem.tabsFormConfig.map((value: MFormV2ChildType, configIndex: number) => {
      const item: MFormV2ItemType = { ...value };

      // // placeholder
      // item.placeholder = item.languagePlaceholder
      //   ? item.languagePlaceholder[ManagerGlobalConfig.value?.language?.value || "zh-CN"]
      //   : typeof item.placeholder == "string"
      //   ? item.placeholder
      //   : item?.placeholder?.[ManagerGlobalConfig.value?.language?.value || "zh-CN"] || item?.placeholder;

      item.display = item.display != undefined ? item.display : props.display;
      item.disabled = item.disabled == undefined ? configItem.disabled : item.disabled;
      // item.placeholder = item.disabled ? "" : item.placeholder;

      setRule(item, _prop, { titleKey: configItem.titleKey });

      const _tabsGroupName =
        typeof item?.unitName == "object"
          ? item?.unitName?.[ManagerGlobalConfig.value?.language?.value || "zh-CN"]
          : item.unitName || "default";

      // if (Array.isArray(configItem.inMultipleConfig)) {
      // for (let index = 0; index < inMultipleConfig.length; index++) {
      //   const element = inMultipleConfig[index];
      //   element.configs = configItem.inMultipleConfig[_tabsIndex]?.configs?.filter?.(item => {
      //     return propsArr.includes(item.prop);
      //   });
      // }
      // configItem.inMultipleConfig[_tabsIndex].configs = configItem.inMultipleConfig[_tabsIndex]?.configs?.filter?.(item => {
      //   return propsArr.includes(item.prop);
      // });

      for (let index = 0; index < inMultipleConfig.length; index++) {
        const element = inMultipleConfig[index];
        for (let i = 0; i < element.configs.length; i++) {
          const elementConfig = element.configs[i];
          if (elementConfig.prop == configItem.prop) {
            elementConfig.tabsFormConfig = elementConfig.tabsFormConfig?.filter(item => propsArr.includes(item.prop)) || [];
          }
        }
      }
      const _tabsIndex =
        configItem?.inMultipleConfig?.findIndex?.((value: MultipleConfigType) => value.unitName == _tabsGroupName) || 0;
      if (_tabsIndex >= 0 && configItem?.inMultipleConfig) {
        let findItem = configItem?.inMultipleConfig[_tabsIndex].configs.find((value: MFormV2ItemType) => value.prop == item.prop);
        if (findItem) {
          findItem = item;
        } else {
          configItem?.inMultipleConfig[_tabsIndex].configs.splice(configIndex, 0, item);
        }
      } else {
        configItem.inMultipleConfig = configItem.inMultipleConfig || [];
        configItem.inMultipleConfig.push({
          unitName: _tabsGroupName,
          unitTip: String(
            typeof configItem.unitTip == "object"
              ? configItem.unitTip?.[ManagerGlobalConfig.value?.language?.value || "zh-CN"] || configItem.unitTip
              : configItem.unitTip || ""
          ),
          configs: [item]
        });
      }
      // }
    });
  }

  if (_index >= 0) {
    const findIndex = inMultipleConfig[_index].configs.findIndex((value: MFormV2ItemType) => value.prop == configItem.prop);
    if (findIndex > -1) {
      inMultipleConfig[_index].configs[findIndex] = configItem;
    } else {
      inMultipleConfig[_index].configs.splice(baseIndex, 0, configItem);
    }
  } else {
    inMultipleConfigKeys.push(_groupName);
    inMultipleConfig.push({
      unitName: _groupName,
      unitTip: String(
        typeof configItem.unitTip == "object"
          ? configItem.unitTip?.[ManagerGlobalConfig.value?.language?.value || "zh-CN"] || configItem.unitTip
          : configItem.unitTip || ""
      ),
      configs: [configItem]
    });
  }
}

// #Function 开始结构处理
function initConfig() {
  nextTick(() => {
    inRules.value = {};
    createSpanStyle();
    // const { exClassName } = getFormBoxInfo();
    const propsArr = inConfig.value.map(item => item.prop);
    for (let index = 0; index < inMultipleConfig.length; index++) {
      const element = inMultipleConfig[index];
      element.configs = element.configs.filter(item => {
        return propsArr.includes(item.prop);
      });
    }

    nextTick(() => {
      inConfig.value.map((value: MFormV2ItemType, index: number) => {
        const item: MFormV2ItemType = {
          ...value,
          ...exCellConfig.value[String(value.prop)],
          exSpan: value.type == "transfer" || value.type == "group" ? value.exSpan || 4 : value.exSpan
        };
        const _prop = Array.isArray(item.prop) ? item.prop.join("-") : item.prop;
        if (_prop) inConfigObj[_prop] = item;

        if (props.disabled) {
          item.disabled = true;
        }
        // if (item.disabled) {
        //   item.placeholder = " ";
        // }
        item.display = item.display != undefined ? item.display : props.display;

        if (props.display) {
          useRequired.value = false;
        } else {
          useRequired.value = true;
        }

        // setExRoles(item);
        if (item.type == "group" && item?.groupFormConfig?.length) {
          for (let index = 0; index < item.groupFormConfig.length; index++) {
            // const el = item.groupFormConfig[index];

            item.groupFormConfig[index] = {
              ...item.groupFormConfig[index],
              disabled: item.disabled,
              display: item.display
            };
          }
        }

        setRule(item);
        setMultipleConfig(item as ExMultipleConfigType, index);
      });
    });
  });
}
const debounceInitConfig = debounce(initConfig, 50);

let initLoadingTime: any;
onMounted(() => {
  if (inConfig.value?.length > 0) {
    debounceInitConfig();
    clearTimeout(initLoadingTime);
    initialization.value = 1;
  }
  if (!inConfig.value.length) {
    initialization.value = -1;
    initLoadingTime = setTimeout(() => {
      initialization.value = -2;
    }, 5000);
  }
});

// #Function 外置数据
// function setConfigData(config: MStructureType.FormV2[]) {
//   const _config = config.map(item => ({
//     ...item
//   }));

//   if (!Array.isArray(_config)) {
//     return (initialization.value = -2);
//   }
//   if (_config?.length > 0) {
//     inConfig.value = cloneDeep(_config);
//     debounceInitConfig();
//     initialization.value = 1;
//     // const baseStore = useBaseStore();
//     // if (baseStore.getToken) {
//     //   initialization.value = 1;
//     //   nextTick(() => {
//     //     debounceInitConfig();
//     //   });
//     // } else {
//     //   initialization.value = -1;
//     // }
//   }
//   if (!inConfig.value.length) {
//     initialization.value = -1;
//   }
//   // structure.length = 0;
// }

// # Expose 提交表单
/**
 * **校验并获取表格数据**
 * @type `() => object | false | null`
 * @description
 * 校验并获取表格数据，校验失败返回 false，校验成功返回表格数据，若没有变更则返回 null
 */
async function getSubmitForm() {
  if (initialization.value == -1) {
    // window.ElMessage.error({ "en-US": "Please configure the structure first", "zh-CN": "请先配置结构" });
    return;
  }

  const _ruleFormRef = FormControlRef.value;
  let formResult = true;
  const { valid } = await _ruleFormRef.validate();
  if (!valid) {
    formResult = false;
  }

  for (const index in ruleTabsFormRef) {
    const element = ruleTabsFormRef[index];
    const _await = await element?.submitTabsForm();
    if (_await != undefined && formResult) {
      formResult = _await;
    }
  }
  if (formResult) {
    const deepData = cloneDeep(formData.value) || {};
    const FormData: FormDataType = deepData;
    const _configs = props.structure || [];
    for (let index = 0; index < _configs.length; index++) {
      const element = _configs[index];
      if (element.type == "tabs-form" && element.prop && FormData[element.prop]) {
        FormData[element.prop] = FormData[element.prop].map((item: FormDataType) => {
          delete item.name;
          delete item.isError;
          return item;
        });
      }
    }

    if (isEqual(baseFormData, FormData)) return "no-change";
    return FormData;
  } else {
    // window.MScrollbarToError();
    const errorItem = document.querySelector(`#${props.id} .m-form-v2-item.is-error`);
    if (errorItem && injectSetScrollToIntersect) {
      injectSetScrollToIntersect(errorItem, undefined, { offsetY: 30 });
    }
    return false;
  }
}

// # Expose 清空表单内容
async function clean_All() {
  formData.value = {};
  FormControlRef.value?.resetFields();
  FormControlRef.value.clearValidate();
}

// # Expose 重置结构配置
function setStructure_All(newConfig: Array<MFormV2ItemType>) {
  window.developLog.json(newConfig, "setStructure_All", "success");
  inConfig.value = cloneDeep(newConfig);
  clearTimeout(initLoadingTime);
  if (inConfig.value?.length > 0) {
    inMultipleConfigKeys.length = 0;
    inMultipleConfig.length = 0;
    debounceInitConfig();
    clearTimeout(initLoadingTime);
    initialization.value = 1;
  }
  if (!inConfig.value.length) {
    initialization.value = -2;
  }
}

/**
 * **重置单个结构配置**
 * @type `(prop: string, item: MFormV2ItemType) => void`
 * @description 该方法用于重置单个结构配置，支持重置整个结构配置。
 * @param prop 结构配置的属性名
 * @param item 结构配置的属性值
 * @returns 无返回值
 * @example
 * ```tsx
 * <MoForm ref={formRef} />
 * ```
 * ```tsx
 * formRef.value.setStructure_Item("Text", { label: "新标签", prop: "Text", type: "input" })
 * ```
 * */
function setStructure_Item(prop: string, item: MFormV2ItemType) {
  if (!prop) return;
  exCellConfig.value[prop] = item;
  debounceInitConfig();
}

// @ 重置表单数据
function changeData_All(data: FormDataType) {
  formData.value = cloneDeep(data);
}

// @ 重置单个表单数据
function changeData_Item(prop: string, data: any) {
  formData.value[prop] = typeof data == "object" ? Object.assign(formData.value[prop], data) : data;
}

defineExpose({
  /**
   * **校验并获取表格数据**
   * @type `(step?: "check") => void`
   * @description
   * - 该方法为 `submitForm` 的优化版本，用于兼容
   * - 当设置执行参数值为 `check` 时，会执行数据对比，如果对数据无变化，则会返回 `null`
   * - 当设置执行参数值为 `undefined` 时，会执行数据校验，如果校验通过，则会返回表格数据
   * - 当设置执行参数值为 `undefined` 时，会执行数据校验，如果校验失败，则会返回 `false`
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * formRef.value.getSubmitForm()
   * ```
   * */
  getSubmitForm,

  /**
   * **清除表单所有数据**
   * @type `() => void`
   * @description 该方法用于清除表单所有数据，包括表单校验状态。
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.clean_All()
   * ```
   * */
  clean_All,

  /**
   * **替换表单结构**
   * @type `(newConfig: MStructureType.FormV2[]) => void`
   * @description 该方法用于替换表单结构，支持替换整个表单结构。
   * @param newConfig 替换后的表单结构
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.setStructure_All([])
   * ```
   * */
  setStructure_All,

  /**
   * **替换单个表单结构**
   * @type `(prop: string, item: MStructureType.FormV2) => void`
   * @description 该方法用于替换表单结构，支持替换整个表单结构。
   * @param prop 替换后的表单结构
   * @param item 替换后的表单结构
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.resetStructureItem("prop", {})
   * ```
   * */
  setStructure_Item,

  /**
   * **重置表单数据**
   * @type `(data: object) => void`
   * @description 该方法用于重置表单数据，支持重置整个表单数据。
   * @param data 重置后的表单数据
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.changeData_All({ Text: "新值" })
   * ```
   * */
  changeData_All,

  /**
   * **重置表单数据**
   * @type `(prop: string, data: object) => void`
   * @description 该方法用于重置表单数据，支持重置整个表单数据。
   * @param prop 重置后的表单数据属性名
   * @param data 重置后的表单数据属性值
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.changeData_Item("Text", "新值")
   * ```
   * */
  changeData_Item
});

// @ watch 结构配置
watch(
  () => props.structure,
  newConfig => {
    if (newConfig?.length > 0) {
      inConfig.value = cloneDeep(newConfig);
      if (inConfig.value?.length > 0) {
        debounceInitConfig();
        clearTimeout(initLoadingTime);
        initialization.value = 1;
      }
      if (!inConfig.value.length) {
        initialization.value = -2;
      }
    }
  }
);

// @ watch 外置数据
watch(
  () => props.data,
  () => {
    window.developLog.log("注意", "组件内使用数据隔离方案，请使用 changeData_All 或 changeData_Item 方法变更内部数据", "danger");
    // if (value && Object.keys(value).length > 0) {
    //   const cloneData = props.deepData ? cloneDeep(value) : value;
    //   formData.value = cloneData;

    //   const _cloneData = cloneDeep(formData.value);
    //   baseFormData = _cloneData;
    // }
  },
  { deep: true }
);

// @ watch formData回调数据
watch(
  () => formData.value,
  value => emit("formDataChange", value),
  { deep: true }
);

// @ watch display模式
watch(() => props.display, debounceInitConfig);

// @ watch disabled
watch(() => props.disabled, debounceInitConfig);

// @ watch formState
watch(
  () => formState.value,
  data => {
    emit("onFormStateChange", data);
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
