<template>
  <pa-development :id="id">
    <template v-if="initialization == 1">
      <div class="pa-form" :class="[props.class]" :style="{ ...props.style }">
        <form-control :id="id || 'default'" ref="FormControlRef" :rules="useRequired ? baseRulesMap['default'] : undefined" :model="formData">
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
                  <tabsItem :id="id" @set-ref="refBody => setRuleTabsFormRef(refBody, item.prop as string)" :item="item" :rules="baseRulesMap">
                    <template v-for="slot in slotKeys" #[slot]="scope" :key="slot">
                      <slot :name="slot" v-bind="scope"></slot>
                    </template>
                  </tabsItem>
                </pa-col>

                <!-- 标准表格 -->
                <formItem v-else :id="id" :item="item">
                  <template v-for="slot in slotKeys" #[slot]="scope" :key="slot">
                    <slot :name="slot" :config="item" :data="scope.data"></slot>
                  </template>
                </formItem>
              </template>
            </pa-row>
          </template>
        </form-control>
      </div>
    </template>
    <div v-else-if="initialization == -1" class="pa-loading">
      <pa-icon class="loading_font" name="loading_line"></pa-icon>
    </div>

    <div v-else class="config-error">{{ configContext.languagePackage["warning"] }}</div>
  </pa-development>
</template>

<script lang="tsx" setup>
/**
 * **Vue 核心响应式 API**
 * @description 导入 Vue 组合式 API 核心函数
 */
import { ref, Ref, reactive, watch, computed, provide, onMounted, onBeforeUnmount, ComputedRef, inject, useSlots } from "vue";
/**
 * **模块导入**
 * @description 导入表单控制器组件
 */
import formControl from "./form-control.vue";
/**
 * **模块导入**
 * @description 导入浏览器环境检测工具
 */
import inBrowser from "../tools/inBrowser";
/**
 * **模块导入**
 * @description 导入随机字符生成工具
 */
import randChar from "../tools/rand-char";
/**
 * **模块导入**
 * @description 导入 Tab 表单项组件
 */
import tabsItem from "./components/tabs-item.vue";
/**
 * **模块导入**
 * @description 导入基础表单项组件
 */
import formItem from "./form-basics-element.vue";
/**
 * **模块导入**
 * @description 导入表单类型定义
 */
import { PaFormItemType, PaFormChildType, ComponentProps, ComponentEmits, ConfigContextType, FormDataType } from "./types";
/**
 * **模块导入**
 * @description 导入多配置类型定义
 */
import { ExMultipleConfigType, MultipleConfigType } from "./types";
/**
 * **模块导入**
 * @description 导入日期选择器快捷选项类型
 */
import { DatePickerShortcut } from "../pa-time/types";
/**
 * **模块导入**
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * **模块导入**
 * @description 导入深拷贝工具函数
 */
import cloneDeep from "../tools/clone-deep";
/**
 * **模块导入**
 * @description 导入深度相等判断工具函数
 */
import isEqual from "../tools/is-equal";
/**
 * **模块导入**
 * @description 导入防抖工具函数
 */
import debounce from "../tools/debounce";

/**
 * **组件属性**
 * @description PaForm 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  id: randChar(),
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

/**
 * **组件事件**
 * @description 组件事件发射器
 */
const emit = defineEmits<ComponentEmits>();

/**
 * **初始化状态**
 * @type `Ref<-1 | -2 | 0 | 1>`
 * @description -1加载中 -2配置错误 0未初始化 1已初始化
 */
const initialization: Ref<-1 | -2 | 0 | 1> = ref(0);
/**
 * **是否启用校验**
 * @type `Ref<boolean>`
 * @description 是否启用表单校验功能
 */
const useRequired = ref(true);
/**
 * **表单控制器引用**
 * @description 表单控制器组件实例引用
 */
const FormControlRef = ref();
/**
 * **内部校验规则**
 * @type `Ref<Record<string, any>>`
 * @description 存储内部校验规则
 */
const inRules: Ref<Record<string, any>> = ref({});
/**
 * **基础校验规则映射**
 * @type `Ref<Record<string, any>>`
 * @description 基础校验规则映射表
 */
const baseRulesMap: Ref<Record<string, any>> = ref({});
/**
 * **分组标题容器引用**
 * @description 分组标题 DOM 元素引用
 */
const RefUnitContainer = ref();
/**
 * **基础分栏大小**
 * @type `Ref<number>`
 * @description 基础的栅格分栏大小
 */
const baseSpanSize = ref(6);
/**
 * **分项分栏大小映射**
 * @type `Ref<Record<string, number>>`
 * @description 各表单项的分栏大小映射
 */
const itemSpanSize = ref({} as Record<string, number>);
/**
 * **基础分项分栏大小**
 * @description 基础分项分栏大小记录
 */
const baseItemSpanSize = {} as Record<string, number>;
/**
 * **表单数据**
 * @type `Ref<FormDataType>`
 * @description 表单的当前数据
 */
const formData: Ref<FormDataType> = ref(cloneDeep(props.data) || {});
/**
 * **配置项映射**
 * @description 表单配置项的映射存储
 */
const inConfigObj: Record<string, any> = {};
/**
 * **Tab表单校验引用**
 * @description Tab 表单校验引用映射表
 */
const ruleTabsFormRef: Record<string, { submitTabsForm: () => Promise<boolean | undefined> }> = {};
/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入的全局 PancakeUI 配置
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * **滚动到可视区域方法注入**
 * @description 注入的滚动到可视区域方法
 */
const injectSetScrollToIntersect = inject("setScrollToIntersect") as (el: Element, callback?: () => void, options?: { offsetY?: number }) => void;
/**
 * **当前语言值**
 * @type `ComputedRef<string>`
 * @description 当前选中的语言标识
 */
const languageValue = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
/**
 * **语言包**
 * @type `ComputedRef<Record<string, string>>`
 * @description 当前语言的文本配置映射
 */
const languagePackage = computed(() => {
  return languageValue.value === "zh-CN"
    ? {
        warning: "请检查配置或权限",
        requiredMessage: "此项为必填项",
        add: "新增标签",
        information: "标签",
        select: "请选择",
        selectTime: "请选择时间",
        startTime: "开始时间",
        endTime: "结束时间",
        startYear: "开始年份",
        endYear: "结束年份",
        input: "请输入",
        to: "至",
        errorText: "暂不支持打开该文件，请下载查看。",
        zoom: "使用滚轮可缩放",
        download: "下载",
        downloadFiles: "下载文件",
        rotate: "旋转",
        inputPlaceholder: "请输入内容",
        selectPlaceholder: "请选择内容",
        clickChangeIcon: "点击更改图标",
        empty: "无数据",
        emptyFind: "无匹配数据",
        isDelete: "已删除"
      }
    : {
        warning: "Please Check The Configuration Or Permissions",
        requiredMessage: "This Item Is Mandatory",
        add: "New Tab",
        information: "Tag",
        select: "Please Select ",
        selectTime: "Please Select Time ",
        startTime: "Start Time",
        endTime: "End Time",
        startYear: "Start Year",
        endYear: "End Year",
        input: "Please Input ",
        to: "To",
        errorText: "Opening This File Is Not Supported At The Moment. Please Download It For Viewing.",
        zoom: "You Can Zoom In And Out By Using The Scroll Wheel.",
        download: "Down",
        downloadFiles: "Download Files",
        rotate: "Rotate",
        inputPlaceholder: "Please Enter Content",
        selectPlaceholder: "Please Select Content",
        clickChangeIcon: "Click To Change Icon",
        empty: "No Data",
        emptyFind: "No Matching Data",
        isDelete: "Deleted"
      };
});
/**
 * **配置上下文**
 * @type `Ref<ConfigContextType>`
 * @description 表单配置上下文，提供给子组件使用
 */
const configContext: Ref<ConfigContextType> = ref({
  labelWidth: computed(() => props.labelWidth),
  labelPosition: computed(() => props.labelPosition),
  baseSpanSize: computed(() => baseSpanSize.value),
  itemSpanSize: computed(() => itemSpanSize.value),
  data: computed(() => formData.value),
  contrastData: computed(() => props.contrastData),
  alwaysContrast: computed(() => props.alwaysContrast),
  display: computed(() => props.display),
  languagePackage: computed(() => languagePackage.value),
  language: computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN"),
  exOptions: computed(() => props.exOptions),
  exDependent: computed(() => props.exDependent),
  exCellDependent: computed(() => props.exCellDependent),
  useRequired: computed(() => props.useRequired),
  noLabel: computed(() => props.noLabel)
});
provide("configContext", configContext);

/**
 * **插槽键列表**
 * @description 预计算插槽键列表，避免每次渲染时重复调用 Object.keys($slots)
 */
const slots = useSlots();
const slotKeys = computed(() => Object.keys(slots));

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

/**
 * **基础多配置分组键列表**
 * @description 基础多配置分组键列表
 */
const baseInMultipleConfigKeys: string[] = [];
/**
 * **内部多配置数据**
 * @description 内部多配置数据
 */
const inMultipleConfig = reactive([] as MultipleConfigType[]);
/**
 * **单元格外置配置**
 * @description 单元格外置配置
 */
const exCellConfig = ref({});
/**
 * **表单状态**
 * @type `Ref<string>`
 * @description 表单当前状态
 */
const formState = ref("Pending");
provide("changeFormState", (data: string) => (formState.value = data));
provide("formCellChange", (data: { prop: string; value: any; oldValue: any; option: any }) => emit("formCellChange", data));
/**
 * **基础表单数据**
 * @description 用于数据对比的基础表单数据
 */
const baseFormData: Record<string, Array<string> | string> = {};
/**
 * **内部表单配置**
 * @type `Ref<PaFormItemType[]>`
 * @description 表单结构的内部配置
 */
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
      onBeforeUnmount(() => observer.disconnect());
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
function setRule(item: PaFormChildType | PaFormItemType, type = "default", options?: { titleKey?: string; removeList?: string[] }) {
  if (options?.removeList && options?.removeList?.length > 0) {
    const list = options.removeList;
    for (const item of list) {
      delete inRules.value[type][item];
    }
  }

  if (!inRules.value[type]) {
    inRules.value[type] = {};
  }

  const baseRules = item.display || item.disabled ? [] : [{ required: true, message: configContext.value.languagePackage["requiredMessage"], trigger: "blur" }];
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
        message: typeof item.message == "string" ? item.message : item.message?.[PancakeGlobalConfig.value?.language?.value || "zh-CN"] || configContext.value.languagePackage["requiredMessage"]
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
 * 初始化表单配置
 * @returns void
 * @description 处理表单结构配置，生成校验规则和分组配置
 * @performance 优化：消除嵌套nextTick，使用普通对象批量构建后再一次性赋值给reactive数组，大幅减少响应式更新次数
 */
function initConfig() {
  // 重置状态
  inRules.value = {};
  baseRulesMap.value = {};
  baseInMultipleConfigKeys.length = 0;
  createSpanStyle();

  // createSpanStyle 需要 DOM 已渲染，放在 initConfig 外层 nextTick 中处理
  // 这里只准备数据

  // --- 第一步：收集分组键 ---
  const propsArr: (string[] | string | undefined)[] = [];
  for (const item of inConfig.value) {
    const _groupName = typeof item.unitName == "object" ? item.unitName?.[PancakeGlobalConfig.value?.language?.value || "zh-CN"] : item.unitName || "default";
    if (!baseInMultipleConfigKeys.includes(_groupName)) {
      baseInMultipleConfigKeys.push(_groupName);
    }
    item.unitName = _groupName;
    propsArr.push(item.prop);
  }

  // --- 第二步：用普通 Map 缓存已存在的配置数据 ---
  const existingConfigMap = new Map<string, PaFormItemType[]>();
  for (const mc of inMultipleConfig) {
    const key = mc.unitName as string;
    if (baseInMultipleConfigKeys.includes(key)) {
      const filtered = mc.configs.filter(c => propsArr.includes(c.prop));
      existingConfigMap.set(key, filtered);
    }
  }

  // --- 第三步：构建完整的多配置列表（普通非响应式对象） ---
  const newMultipleConfig: MultipleConfigType[] = baseInMultipleConfigKeys.map(key => ({
    unitName: key,
    unitTip: "",
    configs: existingConfigMap.get(key) || []
  }));

  // --- 第四步：处理每个表单项，内联规则生成和分组分配 ---
  const allRules: Record<string, Record<string, any>> = { default: {} };

  // 预读取频繁访问的值
  const _exCellConfig = exCellConfig.value;
  const _exDependent = props.exDependent;
  const _exCellRules = _exDependent?.exCellRules || {};
  const _useRequired = props.useRequired;
  const _disabled = props.disabled;
  const _display = props.display;
  const _language = PancakeGlobalConfig.value?.language?.value || "zh-CN";
  const _requiredMessage = configContext.value.languagePackage["requiredMessage"];

  for (let idx = 0; idx < inConfig.value.length; idx++) {
    const value = inConfig.value[idx];
    const exConfig = _exCellConfig[String(value.prop)];
    const item: PaFormItemType = {
      ...value,
      ...exConfig,
      exSpan: value.type == "transfer" || value.type == "group" ? value.exSpan || 1 : value.exSpan
    };
    const _prop = Array.isArray(item.prop) ? item.prop.join("-") : item.prop;
    if (_prop) inConfigObj[_prop] = item;

    // 合并 disabled / display
    if (_disabled) item.disabled = true;
    item.display = item.display != undefined ? item.display : _display;

    useRequired.value = !_display;

    // group 子项继承 disabled / display
    if (item.type == "group" && item?.groupFormConfig?.length) {
      for (let gi = 0; gi < item.groupFormConfig.length; gi++) {
        item.groupFormConfig[gi] = {
          ...item.groupFormConfig[gi],
          disabled: item.disabled,
          display: item.display
        };
      }
    }

    // --- 内联 setRule 逻辑 ---
    const _prop2 = item.prop as string;
    const baseRulesForItem = item.display || item.disabled ? [] : [{ required: true, message: _requiredMessage, trigger: "blur" }];
    let _rules = baseRulesForItem;

    if (item.rules && Array.isArray(item.rules)) {
      let isRequired = true;
      _rules = item.rules.map(r => {
        if (r.required == false) isRequired = false;
        return {
          trigger: "blur",
          required: r.required || true,
          ...r,
          message: typeof r.message == "string" ? r.message : r.message?.[_language] || _requiredMessage
        };
      });
      if (!isRequired) item.rules = false;
    }
    if (item.required == false) item.rules = false;

    if (_useRequired && useRequired.value && _prop2 && item.rules != false && _rules.length) {
      allRules["default"][_prop2] = _exCellRules[_prop2] ? [..._rules, ..._exCellRules[_prop2]] : _rules;
    } else if (!_useRequired || !useRequired.value) {
      allRules["default"][_prop2] = item.display || item.disabled ? [] : item.rules || [];
    }

    // --- 处理 tabs-form 的多配置和子项规则（原 setMultipleConfig 逻辑） ---
    if ((item as ExMultipleConfigType).tabsFormConfig?.length) {
      const configItem = item as ExMultipleConfigType;
      const tabsProp = Array.isArray(item.prop) ? item.prop.join("-") : item.prop;
      const propsArr = configItem.tabsFormConfig.map(c => c.prop);

      configItem.inMultipleConfig = configItem.inMultipleConfig || [];

      configItem.tabsFormConfig.forEach((childValue: PaFormChildType, configIndex: number) => {
        const childItem: PaFormItemType = { ...childValue };

        childItem.display = childItem.display != undefined ? childItem.display : _display;
        childItem.disabled = childItem.disabled == undefined ? item.disabled : childItem.disabled;

        // setRule for child (inline)
        const childProp = childItem.prop as string;
        if (childProp) {
          if (!inRules.value[tabsProp]) inRules.value[tabsProp] = {};
          if (!allRules[tabsProp]) allRules[tabsProp] = {};

          const childBaseRules = childItem.display || childItem.disabled ? [] : [{ required: true, message: _requiredMessage, trigger: "blur" }];
          let childRules = childBaseRules;

          if (childItem.rules && Array.isArray(childItem.rules)) {
            let isRequired = true;
            childRules = childItem.rules.map(r => {
              if (r.required == false) isRequired = false;
              return {
                trigger: "blur",
                required: r.required || true,
                ...r,
                message: typeof r.message == "string" ? r.message : r.message?.[_language] || _requiredMessage
              };
            });
            if (!isRequired) childItem.rules = false;
          }
          if (childItem.required == false || childItem.prop == configItem.titleKey) childItem.rules = false;

          if (_useRequired && useRequired.value && childProp && childItem.rules != false && childRules.length) {
            const _cellRules2 = _exCellRules[childProp] || [];
            allRules[tabsProp][childProp] = _cellRules2.length ? [...childRules, ..._cellRules2] : childRules;
          } else if (!_useRequired || !useRequired.value) {
            allRules[tabsProp][childProp] = childItem.display || childItem.disabled ? [] : childItem.rules || [];
          }
        }

        // 添加到 inMultipleConfig 分组
        const tabsGroupName = typeof childItem?.unitName == "object" ? childItem?.unitName?.[_language] : childItem.unitName || "default";

        // 在当前项的 inMultipleConfig 中找到或创建分组
        const tabsGroup = configItem.inMultipleConfig.find(g => g.unitName === tabsGroupName);
        if (tabsGroup) {
          const existIdx = tabsGroup.configs.findIndex(c => String(c.prop) === String(childItem.prop));
          if (existIdx >= 0) {
            tabsGroup.configs[existIdx] = childItem;
          } else {
            tabsGroup.configs.splice(configIndex, 0, childItem);
          }
        } else {
          configItem.inMultipleConfig.push({
            unitName: tabsGroupName,
            unitTip: "",
            configs: [childItem]
          });
        }
      });

      // 过滤掉已不存在的 configs
      for (const g of configItem.inMultipleConfig) {
        g.configs = g.configs.filter(c => propsArr.includes(c.prop));
      }
    }

    // --- 将 item 分配到对应的主分组中 ---
    const unitName = (item.unitName as string) || "default";
    const groupIndex = baseInMultipleConfigKeys.indexOf(unitName);
    if (groupIndex >= 0) {
      const configs = newMultipleConfig[groupIndex].configs;
      const existingIdx = configs.findIndex(c => String(c.prop) === String(item.prop));
      if (existingIdx >= 0) {
        configs[existingIdx] = item;
      } else {
        configs.push(item);
      }
    }
  }

  // --- 第五步：一次性赋值给响应式数据 ---
  // 合并所有规则的 baseRulesMap
  inRules.value = allRules;
  baseRulesMap.value = {};
  for (const key of Object.keys(allRules)) {
    baseRulesMap.value[key] = cloneDeep(allRules[key]);
  }

  // 一次性替换 inMultipleConfig 全部内容
  inMultipleConfig.length = 0;
  for (const mc of newMultipleConfig) {
    inMultipleConfig.push(mc);
  }
}
/**
 * 防抖初始化配置函数
 * @description 防抖初始化配置函数
 */
const debounceInitConfig = debounce(initConfig, 50);

/**
 * 初始化加载计时器
 * @description 初始化加载计时器
 */
let initLoadingTime: any;
/**
 * 组件挂载时初始化表单配置
 * @description 组件挂载时初始化表单配置
 */
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
 * @returns `Record<string, string>` | `"no-change"` | `false` | `void` 校验通过返回数据，无变更返回"no-change"，失败返回false
 * @description 校验表单并获取数据，校验失败返回 false，校验成功返回表格数据，若没有变更则返回 "no-change"
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
 * **清空表单内容**
 * @returns `Promise<void>`
 * @description 清除所有表单数据和校验状态
 */
async function cleanAll() {
  formData.value = {};
  FormControlRef.value?.resetFields();
  FormControlRef.value.clearValidate();
}

/**
 * **重置全部结构配置**
 * @param `newConfig` `Array<`[`PaFormItemType`](#paformitemtype)`>` 新的表单结构配置
 * @returns `void`
 * @description 替换整个表单的结构配置并重新初始化
 */
function setStructureAll(newConfig: Array<PaFormItemType>) {
  typeof window !== "undefined" && window.developLog.json(newConfig, "setStructure_All", "success");
  inConfig.value = cloneDeep(newConfig);
  clearTimeout(initLoadingTime);
  if (inConfig.value?.length > 0) {
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
 * @param `prop` `string` 结构配置的属性名
 * @param `item` `PaFormItemType` 结构配置的属性值
 * @returns `void`
 * @description 重置单个结构配置
 */
function setStructureItem(prop: string, item: PaFormItemType) {
  if (!prop) return;
  exCellConfig.value[prop] = item;
  debounceInitConfig();
}

/**
 * **重置全部表单数据**
 * @param `data` `FormDataType` 新的表单数据
 * @returns `void`
 * @description 替换整个表单的数据
 */
function changeDataAll(data: FormDataType) {
  formData.value = cloneDeep(data);
}

/**
 * **重置单个表单数据**
 * @param `prop` `string` 属性名
 * @param `data` `any` 新的属性值
 * @returns `void`
 * @description 替换指定属性的数据
 */
function changeDataItem(prop: string, data: any) {
  formData.value[prop] = typeof data == "object" ? Object.assign(formData.value[prop], data) : data;
}

defineExpose({
  /**
   * **校验并获取表格数据**
   * @description 校验表单并获取数据，校验失败返回 false，无变更返回 "no-change"
   */
  getSubmitForm,

  /**
   * **清除表单所有数据**
   * @description 清除表单所有数据，包括表单校验状态
   */
  cleanAll,

  /**
   * **替换表单结构**
   * @param `newConfig` `Array<ComponentItemProps>` 替换后的表单结构
   * @description 替换整个表单的结构配置
   */
  setStructureAll,

  /**
   * **替换单个表单结构**
   * @param `prop` `string` 替换后的表单结构属性名
   * @param `item` `ComponentItemProps` 替换后的表单结构属性值
   * @description 替换单个表单结构
   */
  setStructureItem,

  /**
   * **重置表单数据**
   * @param `data` `object` 重置后的表单数据
   * @description 重置整个表单的数据
   */
  changeDataAll,

  /**
   * **重置单个表单数据**
   * @param `prop` `string` 重置后的表单数据属性名
   * @param `data` `any` 重置后的表单数据属性值
   * @description 重置单个表单数据
   */
  changeDataItem
});

/**
 * **监听结构配置变化**
 * @description 监听结构配置变化并重新初始化表单
 */
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

/**
 * **监听外置数据变化（仅引用比较，不 deep 监听）**
 * @description 移除 deep:true，避免每次字段变更都触发深度比较。
 * 组件内使用数据隔离方案，外部数据变更提示用户使用 changeDataAll/changeDataItem 方法
 */
watch(
  () => props.data,
  () => {
    typeof window !== "undefined" && window.developLog.log("注意", "组件内使用数据隔离方案，请使用 changeDataAll 或 changeDataItem 方法变更内部数据", "danger");
  }
);

/**
 * **监听表单数据变化**
 * @description 监听表单数据变化并触发 formDataChange 事件
 * 使用 deep: true 确保深层对象变更也能触发；使用 flush: 'post' 确保 DOM 更新后触发
 */
watch(
  () => formData.value,
  value => {
    emit("formDataChange", value);
  },
  { deep: true }
);

/**
 * **监听展示/禁用模式变化**
 * @description 合并到单个 watch 中，避免两次独立的 debounceInitConfig
 */
watch(
  () => [props.display, props.disabled],
  () => {
    debounceInitConfig();
  }
);

/**
 * **监听表单状态变化**
 * @description 监听表单状态变化并触发 onFormStateChange 事件
 */
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
