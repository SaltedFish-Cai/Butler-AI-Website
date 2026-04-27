<template>
  <div
    v-if="!display"
    :id="id"
    class="pa-switch"
    :class="[inValue == options.activeValue ? 'pa-switch-active' : '', props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
    @click="changeEvent"
  >
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-switch__inner">
      <div class="pa-switch-text pa-switch-text-inactive">
        {{ options.inActiveText }}
      </div>
      <div class="pa-switch-inner">
        <div class="pa-switch-thumb" :style="{ ...props.iconStyle }">
          <pa-icon
            style="display: flex"
            v-if="options.activeIcon || options.inActiveIcon"
            :name="inValue == options.activeValue ? options.activeIcon : options.inActiveIcon"
          ></pa-icon>
        </div>
      </div>
      <div class="pa-switch-text pa-switch-text-active">
        {{ options.activeText }}
      </div>
    </div>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue, options) || "--" }} )
      </template>
      <template v-else>{{ findData(inValue, options) || "--" }}</template>
    </div>
  </div>
  
  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData, options) || "--" }} )
    </template>
    <template v-else>{{ findData(contrastData, options) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { computed, ComputedRef, inject, ref, Ref, watch } from "vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";

/**
 * **模块导入**
 * @description 导入数据查找工具函数
 * */
import { findData as findDataSwitch } from "./find-data";

/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";

/**
 * **模块导入**
 * @description 导入 lodash 工具函数
 * */
import _ from "lodash";
const { isEqual, isNil } = _;

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **当前语言值**
 * @type `ComputedRef<string>`
 * @description 当前选中的语言
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  contrastData: undefined
});

/**
 * **当前值**
 * @type `Ref<boolean | number | string | undefined>`
 * @description 当前开关的绑定值
 * */
const inValue: Ref<boolean | number | string | undefined> = ref(props.modelValue);

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits<ComponentEmits>();

/**
 * **旧值存储**
 * @type `boolean | number | string | undefined`
 * @description 存储上一次的值，用于对比
 * */
let oldValue = props.modelValue;

/**
 * **处理点击事件**
 * @returns `void`
 * @description 处理开关点击切换状态
 * */
function changeEvent(): void {
  if (props.disabled || props.display) return;
  const value = inValue.value == options.value.activeValue ? options.value.inActiveValue : options.value.activeValue;
  emits("update:modelValue", value);
  emits("change", { value, oldValue });
  oldValue = value;
}

/**
 * **查找显示数据**
 * @param `data` 要查找的数据
 * @param `opts` 配置选项
 * @returns `string` 显示的文本
 * @description 根据值查找对应的显示文本
 * */
function findData(data: boolean | number | string | undefined, opts: any): string {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSwitch(data, opts, languageValue.value);
}

/**
 * **转换选项类型**
 * @param `type` 值的类型
 * @param `opts` 配置选项
 * @returns `object` 转换后的选项
 * @description 根据值的类型转换 activeValue 和 inActiveValue
 * */
function changeType(type: string, opts: any): object {
  if (type == "string") {
    return {
      activeValue: String(opts.activeValue),
      inActiveValue: String(opts.inActiveValue),
      activeText: opts.activeText,
      inActiveText: opts.inActiveText,
      activeIcon: opts.activeIcon,
      inActiveIcon: opts.inActiveIcon
    };
  } else if (type == "number") {
    return {
      activeValue: Number(opts.activeValue),
      inActiveValue: Number(opts.inActiveValue),
      activeText: opts.activeText,
      inActiveText: opts.inActiveText,
      activeIcon: opts.activeIcon,
      inActiveIcon: opts.inActiveIcon
    };
  } else {
    return {
      activeValue: opts.activeValue,
      inActiveValue: opts.inActiveValue,
      activeText: opts.activeText,
      inActiveText: opts.inActiveText,
      activeIcon: opts.activeIcon,
      inActiveIcon: opts.inActiveIcon
    };
  }
}

/**
 * **计算选项**
 * @type `ComputedRef<object>`
 * @description 计算开关的配置选项
 * */
const options = computed(() => {
  const typeIs = typeof inValue.value;
  const {
    activeValue = true,
    inActiveValue = false,
    activeText = languageValue.value == "zh-CN" ? "是" : "Yes",
    inActiveText = languageValue.value == "zh-CN" ? "否" : "No"
  } = props.exOptions || props;

  const _opt = changeType(typeIs, {
    activeValue: activeValue,
    inActiveValue: inActiveValue,
    activeText: typeof activeText == "string" ? activeText : activeText[languageValue.value] || activeText["zh-CN"],
    inActiveText: typeof inActiveText == "string" ? inActiveText : inActiveText[languageValue.value] || inActiveText["zh-CN"],
    activeIcon: props.activeIcon,
    inActiveIcon: props.inActiveIcon
  });
  return _opt;
});

/**
 * **监听 modelValue 变化**
 * @description 同步外部传入的值到内部状态
 * */
watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data : options.value.inActiveValue;
    oldValue = !isNil(data) ? data : options.value.inActiveValue;
    emits("update:modelValue", !isNil(data) ? data : options.value.inActiveValue);
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
