<template>
  <div class="pa-tag" ref="tagRef" :class="[props.useCollapse ? 'pa-tag-collapse' : '', props.class]" :style="mergedStyle">
    <div class="pa-tag-text" v-for="item in inValue" :key="String(item.value)">
      <div class="pa-tag-text_content">
        {{ getLabel(item.label) }}
      </div>
      <pa-icon v-if="!props.disabled" name="close_circle_line" class="pa-tag-text_close" @click.stop="removeTag(item)"> </pa-icon>
    </div>
    <pa-popover ref="popoverRef" v-if="hideValue.length" :popoverWidth="popoverWidth" stopPropagation>
      <template #reference>
        <div class="pa-tag-text pa-tag-collapse-count">+{{ hideValue.length }}</div>
      </template>
      <div class="pa-tag">
        <div class="pa-tag-text" v-for="item in hideValue" :key="String(item.value)">
          <div class="pa-tag-text_content">
            {{ getLabel(item.label) }}
          </div>
          <pa-icon v-if="!props.disabled" name="close_circle_line" class="pa-tag-text_close" @click.stop="removeTag(item)">
          </pa-icon>
        </div>
      </div>
    </pa-popover>
  </div>
</template>

<script lang="ts">
/**
 * 语言默认值
 * @description 默认语言标识
 */
const DEFAULT_LANGUAGE = "zh-CN";
</script>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { onMounted, ref, watch, nextTick, inject, computed, ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits, TagType } from "./types";
/**
 * 模块导入
 * @description 导入元素位置计算工具函数
 */
import { getElementPosition } from "../utils/getElementPosition";
/**
 * 模块导入
 * @description 导入全局配置类型定义
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 从父组件注入的全局配置对象，包含语言设置等
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 当前语言
 * @type ComputedRef<string>
 * @description 当前语言标识，在 getLabel 中使用
 */
const language = computed(() => PancakeGlobalConfig.value?.language?.value || DEFAULT_LANGUAGE);
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), { useCollapse: true });
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 合并样式
 * @type ComputedRef<Record<string, string | number>>
 * @description 合并后的组件样式（减少计算开销：直接引用 isOpacity 和 props.style）
 */
const mergedStyle = computed(() => {
  const base = props.style || {};
  return { ...base, opacity: isOpacity.value };
});
/**
 * 弹窗组件引用
 * @type ReturnType<typeof ref>
 * @description 弹窗组件的引用
 */
const popoverRef = ref();
/**
 * 显示的标签列表
 * @type ReturnType<typeof ref>
 * @description 当前显示的标签列表
 */
const inValue = ref<Array<TagType>>(props.tagList || []);
/**
 * 标签容器引用
 * @type ReturnType<typeof ref>
 * @description 标签容器的 DOM 引用
 */
const tagRef = ref<HTMLDivElement>();
/**
 * 隐藏的标签列表
 * @type ReturnType<typeof ref>
 * @description 被折叠隐藏的标签列表
 */
const hideValue = ref<Array<TagType>>([]);
/**
 * 透明度状态
 * @type ReturnType<typeof ref>
 * @description 用于动画效果的透明度值
 */
const isOpacity = ref(0);
/**
 * 获取标签显示文本
 * @param label - 标签文本或语言包
 * @returns 格式化后的标签文本
 * @description 根据语言环境获取标签显示文本
 */
function getLabel(label: TagType["label"]): string {
  // 直接读取 language.value 以保持响应性
  if (typeof label === "object") {
    return label[language.value] || label[DEFAULT_LANGUAGE];
  }
  return label;
}
/**
 * 移除标签
 * @param data - 标签数据
 * @description 触发 removeTag 事件（已通过 @click.stop 处理冒泡）
 */
function removeTag(data: TagType) {
  emits("removeTag", data);
}
/**
 * 初始化弹窗显示
 * @description 计算标签溢出，设置折叠显示
 */
function initPopover() {
  if (!props.useCollapse) {
    isOpacity.value = 1;
  } else {
    nextTick(() => {
      const children = tagRef.value?.children;
      let spliceIndex = 0;
      if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const position = getElementPosition(child, tagRef.value as HTMLElement, { top: 0, left: 0, right: 40, bottom: 0 });
          if (position?.isFullInParent) spliceIndex++;
        }
        if (spliceIndex && props.tagList) {
          hideValue.value = props.tagList.slice(spliceIndex);
          inValue.value = props.tagList.slice(0, spliceIndex);
        }
        isOpacity.value = 1;
      }
    });
  }
}
/**
 * 组件挂载生命周期
 * @description 初始化弹窗显示
 */
onMounted(() => {
  initPopover();
});
/**
 * 监听 tagList 变化
 * @description 标签列表变化时重新计算显示
 */
watch(
  () => props.tagList,
  data => {
    inValue.value = data || [];
    initPopover();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
