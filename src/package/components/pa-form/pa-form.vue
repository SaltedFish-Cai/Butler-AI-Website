<template>
  <pa-development :id="id">
    <!-- <pre>{{ JSON.stringify(baseRulesMap, null, 2) }}</pre> -->
    <template v-if="initialization == 1">
      <div class="pa-form" :class="[props.class]" :style="{ ...props.style }">
        <pa-form-control
          :id="id || 'default'"
          ref="FormControlRef"
          :rules="useRequired ? baseRulesMap['default'] : undefined"
          :model="formData"
        >
          <template v-for="(itemConfigs, itemConfigsIndex) in inMultipleConfig" :key="itemConfigs.unitName">
            <!-- Group组标题 -->
            <template v-if="itemConfigs.unitName != 'default'">
              <pa-title :padding="[itemConfigsIndex != 0 ? 'top' : 'null']">
                <div ref="RefUnitContainer">{{ itemConfigs.unitName }}</div>
                <pa-popover v-if="itemConfigs.unitTip" trigger="hover" :teleport-to="RefUnitContainer" placement="top">
                  <template #reference>
                    <pa-icon name="question_line" class="pa-form-title_label-icon"></pa-icon>
                  </template>
                  <div>{{ itemConfigs.unitTip }}</div>
                </pa-popover>
              </pa-title>
            </template>

            <!-- body -->
            <pa-row>
              <template v-for="item in itemConfigs.configs" :key="String(item.prop)">
                <!-- tabs 表 -->
                <pa-col v-if="item.type == 'tabs-form'" :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
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
                </pa-col>

                <!-- 标准表格 -->
                <formItem v-else :id="id" :item="item">
                  <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                    <slot :name="slot" :config="item" :data="scope.data"></slot>
                  </template>
                </formItem>
              </template>
            </pa-row>
          </template>
        </pa-form-control>
      </div>
    </template>
    <div v-else-if="initialization == -1" class="pa-loading">
      <pa-icon class="loading_font" name="loading_line"></pa-icon>
    </div>

    <div v-else class="config-error">{{ configContext.languagePackage["warning"] }}</div>
  </pa-development>
</template>

<script lang="tsx" setup>
/** @description Vue 核心响应式 API */
import { ref, Ref, reactive, watch, nextTick, computed, provide, onMounted, onUnmounted, ComputedRef, inject } from "vue";
/** @description 表单控制器组件 */
import mFormV2Control from "./pa-form-control.vue";
/** @description 浏览器环境检测工具 */
import inBrowser from "../tools/inBrowser";
/** @description Tab表单项组件 */
import tabsItem from "./components/tabs-item.vue";
/** @description 基础表单项组件 */
import formItem from "./form-basics-element.vue";
/** @description 表单类型定义 */
import { PaFormItemType, PaFormChildType, ComponentProps, ComponentEmits, ConfigContextType, FormDataType } from "./types";
/** @description 多配置类型定义 */
import { ExMultipleConfigType, MultipleConfigType } from "./types";
/** @description 日期选择器快捷选项类型 */
import { DatePickerShortcut } from "../pa-time/type";
/** @description 全局配置类型 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/** @description 工具函数库 */
import _ from "lodash";
const { cloneDeep, isEqual, debounce } = _;

/** @description 组件属性 */
const props = withDefaults(defineProps<ComponentProps>(), {
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

/** @description 组件事件 */
const emit = defineEmits<ComponentEmits>();

/**
 * 初始化状态
 * -1 加载中
 * -2 配置错误
 * 0 未初始化
 * 1 已初始化
 */
/** @description 初始化状态：-1加载中 -2配置错误 0未初始化 1已初始化 */
const initialization: Ref<-1 | -2 | 0 | 1> = ref(0);
/** @description 是否启用校验 */
const useRequired = ref(true);
/** @description 表单控制器引用 */
const FormControlRef = ref();
/** @description 内部校验规则 */
const inRules: Ref<Record<string, any>> = ref({});
/** @description 基础校验规则映射 */
const baseRulesMap: Ref<Record<string, any>> = ref({});

/** @description 分组标题容器引用 */
const RefUnitContainer = ref();

/** @description 基础分栏大小 */
const baseSpanSize = ref(6);
/** @description 分项分栏大小映射 */
const itemSpanSize = ref({} as Record<string, number>);
/** @description 基础分项分栏大小 */
const baseItemSpanSize = {} as Record<string, number>;

/** @description 表单数据 */
const formData: Ref<FormDataType> = ref(cloneDeep(props.data) || {});
/** @description 配置项映射 */
/** @description 内部表单结构配置 */
const inConfigObj: Record<string, any> = {};

/** @description Tab表单校验引用 */
const ruleTabsFormRef: Record<string, { submitTabsForm: () => Promise<boolean | undefined> }> = {};
/** @description 全局配置注入 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/** @description 滚动到可视区域方法注入 */
const injectSetScrollToIntersect = inject("setScrollToIntersect") as (
  el: Element,
  callback?: () => void,
  options?: { offsetY?: number }
) => void;

/** @description 配置上下文 */
const configContext: Ref<ConfigContextType> = ref({
  labelWidth: computed(() => props.labelWidth),
  labelPosition: computed(() => props.labelPosition),
  baseSpanSize: computed(() => baseSpanSize.value),
  itemSpanSize: computed(() => itemSpanSize.value),
  data: computed(() => formData.value),
  contrastData: computed(() => props.contrastData),
  alwaysContrast: computed(() => props.alwaysContrast),
  display: computed(() => props.display),
  languagePackage: computed(() => PancakeGlobalConfig.value?.language?.package?.["form"] || {}),
  language: computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN"),
  exOptions: computed(() => props.exOptions),
  exDependent: computed(() => props.exDependent),
  exCellDependent: computed(() => props.exCellDependent),
  useRequired: computed(() => props.useRequired),
  noLabel: computed(() => props.noLabel)
});
provide("configContext", configContext);

/**
 * 设置Tab表单校验引用
 * @param el - Tab表单组件实例
 * @param key - Tab表单标识
 * @returns void
 * @description 将Tab表单组件实例存储到校验引用映射中
 */
function setRuleTabsFormRef(el: { submitTabsForm: () => Promise<boolean | undefined> }, key: string) {
  if (el) {
    ruleTabsFormRef[key] = el;
  }
}

/** @description 基础多配置分组键列表 */
const baseInMultipleConfigKeys: string[] = [];
/** @description 内部多配置分组键列表 */
const inMultipleConfigKeys: string[] = [];
/** @description 内部多配置数据 */
let inMultipleConfig = reactive([] as MultipleConfigType[]);

/** @description 单元格外置配置 */
const exCellConfig = ref({});

/** @description 表单状态 */
const formState = ref("Pending");
provide("changeFormState", (data: string) => (formState.value = data));

provide("formCellChange", (data: FormDataType) => emit("formCellChange", data));

/** @description 基础表单数据（用于对比） */
const baseFormData: Record<string, Array<string> | string> = {};
const inConfig: Ref<PaFormItemType[]> = ref(cloneDeep(props.structure || []));

/**
 * 初始化单行列数
 * @returns void
 * @description 根据外部配置或容器宽度设置单行分栏数
 */
function createSpanStyle() {
  if (inBrowser) {
    if (props.exSpan) {
      if (props.exSpan == 1) {
        baseSpanSize.value = 1;
      } else if (props.exSpan == 2) {
        baseSpanSize.value = 2;
      } else if (props.exSpan == 3) {
        baseSpanSize.value = 3;
      } else if (props.exSpan == 4) {
        baseSpanSize.value = 4;
      }
    } else {
      const boxWidth = typeof window !== "undefined" && window.document?.getElementById(props.id || "default");
      if (!boxWidth) return;
      const maxSpanList = {
        4: [4, 2, 2, 1],
        3: [3, 3, 2, 1],
        2: [2, 2, 2, 1],
        1: [1, 1, 1, 1]
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

/**
 * 设置校验规则
 * @param item - 表单项配置
 * @param prop - 属性名
 * @param options - 额外选项
 * @returns void
 * @description 根据表单项配置生成校验规则并存储到规则映射中
 */
function setRule(
  item: PaFormChildType | PaFormItemType,
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
            : item.message?.[PancakeGlobalConfig.value?.language?.value || "zh-CN"] ||
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

/**
 * 设置多配置分组
 * @param configItem - 多配置项
 * @param baseIndex - 基础索引
 * @returns void
 * @description 将配置项分配到对应的多配置分组中
 */
function setMultipleConfig(configItem: ExMultipleConfigType, baseIndex: number) {
  const _groupName = configItem.unitName as string;
  const _index = inMultipleConfigKeys.indexOf(_groupName);

  if (configItem.tabsFormConfig?.length) {
    let _prop = "";
    if (configItem.prop) {
      _prop = Array.isArray(configItem.prop) ? configItem.prop.join("-") : configItem.prop;
    }

    const propsArr = configItem.tabsFormConfig.map(item => item.prop);
    configItem.tabsFormConfig.map((value: PaFormChildType, configIndex: number) => {
      const item: PaFormItemType = { ...value };

      item.display = item.display != undefined ? item.display : props.display;
      item.disabled = item.disabled == undefined ? configItem.disabled : item.disabled;

      setRule(item, _prop, { titleKey: configItem.titleKey });

      const _tabsGroupName =
        typeof item?.unitName == "object"
          ? item?.unitName?.[PancakeGlobalConfig.value?.language?.value || "zh-CN"]
          : item.unitName || "default";

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
        let findItem = configItem?.inMultipleConfig[_tabsIndex].configs.find((value: PaFormItemType) => value.prop == item.prop);
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
              ? configItem.unitTip?.[PancakeGlobalConfig.value?.language?.value || "zh-CN"] || configItem.unitTip
              : configItem.unitTip || ""
          ),
          configs: [item]
        });
      }
    });
  }

  if (_index >= 0) {
    const findIndex = inMultipleConfig[_index].configs.findIndex((value: PaFormItemType) => value.prop == configItem.prop);
    if (findIndex > -1) {
      inMultipleConfig[_index].configs[findIndex] = configItem;
    } else {
      inMultipleConfig[_index].configs.splice(baseIndex, 0, configItem);
    }
  } else {
    const _index = baseInMultipleConfigKeys.indexOf(_groupName);
    inMultipleConfigKeys.splice(_index, 1, _groupName);
    inMultipleConfig.splice(_index, 1, {
      unitName: _groupName,
      unitTip: String(
        typeof configItem.unitTip == "object"
          ? configItem.unitTip?.[PancakeGlobalConfig.value?.language?.value || "zh-CN"] || configItem.unitTip
          : configItem.unitTip || ""
      ),
      configs: [configItem]
    });
  }
}

/**
 * 初始化表单配置
 * @returns void
 * @description 处理表单结构配置，生成校验规则和分组配置
 */
function initConfig() {
  nextTick(() => {
    inRules.value = {};
    baseInMultipleConfigKeys.length = 0;
    createSpanStyle();
    const propsArr = inConfig.value.map(item => {
      const _groupName =
        typeof item.unitName == "object"
          ? item.unitName?.[PancakeGlobalConfig.value?.language?.value || "zh-CN"]
          : item.unitName || "default";
      if (!baseInMultipleConfigKeys.includes(_groupName)) {
        baseInMultipleConfigKeys.push(_groupName);
      }
      item.unitName = _groupName;
      return item.prop;
    });

    inMultipleConfig = inMultipleConfig.filter(item => baseInMultipleConfigKeys.includes(item.unitName as string));

    for (let index = 0; index < baseInMultipleConfigKeys.length; index++) {
      const elIndex = inMultipleConfig.findIndex(item => item.unitName == baseInMultipleConfigKeys[index]);
      if (elIndex >= 0) {
        inMultipleConfig[elIndex].configs = inMultipleConfig[elIndex].configs.filter(item => {
          return propsArr.includes(item.prop);
        });
        inMultipleConfig.splice(index, 0, inMultipleConfig[elIndex]);
      } else {
        inMultipleConfig.splice(index, 0, { unitName: baseInMultipleConfigKeys[index], configs: [] });
      }
    }
    inMultipleConfig = inMultipleConfig.splice(0, baseInMultipleConfigKeys.length);

    nextTick(() => {
      inConfig.value.map((value: PaFormItemType, index: number) => {
        const item: PaFormItemType = {
          ...value,
          ...exCellConfig.value[String(value.prop)],
          exSpan: value.type == "transfer" || value.type == "group" ? value.exSpan || 1 : value.exSpan
        };
        const _prop = Array.isArray(item.prop) ? item.prop.join("-") : item.prop;
        if (_prop) inConfigObj[_prop] = item;

        if (props.disabled) {
          item.disabled = true;
        }
        item.display = item.display != undefined ? item.display : props.display;

        if (props.display) {
          useRequired.value = false;
        } else {
          useRequired.value = true;
        }

        if (item.type == "group" && item?.groupFormConfig?.length) {
          for (let index = 0; index < item.groupFormConfig.length; index++) {
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
/** @description 防抖初始化配置函数 */
const debounceInitConfig = debounce(initConfig, 50);

/** @description 初始化加载计时器 */
let initLoadingTime: any;
/** @description 组件挂载时初始化表单配置 */
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

/**
 * **校验并获取表格数据**
 * @type `() => object | false | null`
 * @description
 * 校验并获取表格数据，校验失败返回 false，校验成功返回表格数据，若没有变更则返回 null
 */
/**
 * 校验并获取表格数据
 * @returns 表格数据、false或"no-change"
 * @description 校验表单并获取数据，校验失败返回false，无变更返回"no-change"
 */
async function getSubmitForm() {
  if (initialization.value == -1) {
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
    const errorItem = document.querySelector(`#${props.id} .pa-form-item.is-error`);
    if (errorItem && injectSetScrollToIntersect) {
      injectSetScrollToIntersect(errorItem, undefined, { offsetY: 30 });
    }
    return false;
  }
}

/**
 * 清空表单内容
 * @returns void
 * @description 清除所有表单数据和校验状态
 */
async function clean_All() {
  formData.value = {};
  FormControlRef.value?.resetFields();
  FormControlRef.value.clearValidate();
}

/**
 * 重置全部结构配置
 * @param newConfig - 新的表单结构配置
 * @returns void
 * @description 替换整个表单的结构配置并重新初始化
 */
function setStructure_All(newConfig: Array<PaFormItemType>) {
  typeof window !== "undefined" && window.developLog.json(newConfig, "setStructure_All", "success");
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
 * @type `(prop: string, item: PaFormItemType) => void`
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
function setStructure_Item(prop: string, item: PaFormItemType) {
  if (!prop) return;
  exCellConfig.value[prop] = item;
  debounceInitConfig();
}

/**
 * 重置全部表单数据
 * @param data - 新的表单数据
 * @returns void
 * @description 替换整个表单的数据
 */
function changeData_All(data: FormDataType) {
  formData.value = cloneDeep(data);
}

/**
 * 重置单个表单数据
 * @param prop - 属性名
 * @param data - 新的属性值
 * @returns void
 * @description 替换指定属性的数据
 */
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

/** @description 监听结构配置变化并重新初始化 */
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

/** @description 监听外置数据变化 */
watch(
  () => props.data,
  () => {
    typeof window !== "undefined" &&
      window.developLog.log(
        "注意",
        "组件内使用数据隔离方案，请使用 changeData_All 或 changeData_Item 方法变更内部数据",
        "danger"
      );
  },
  { deep: true }
);

/** @description 监听表单数据变化并触发事件 */
watch(
  () => formData.value,
  value => emit("formDataChange", value),
  { deep: true }
);

/** @description 监听展示模式变化 */
watch(() => props.display, debounceInitConfig);

/** @description 监听禁用状态变化 */
watch(() => props.disabled, debounceInitConfig);

/** @description 监听表单状态变化并触发事件 */
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
