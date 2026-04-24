<template>
  <div
    class="pa-tag"
    ref="tagRef"
    :class="[useCollapse ? 'pa-tag-collapse' : '', props.class]"
    :style="{ ...props.style, opacity: isOpacity }"
  >
    <div class="pa-tag-text" v-for="item in inValue" :key="String(item.value)">
      <div class="pa-tag-text_content">
        {{ typeof item.label === "object" ? item.label[language] || item.label["zh-CN"] : item.label }}
      </div>
      <pa-icon
        v-if="!props.disabled"
        name="close_circle_line"
        class="pa-tag-text_close"
        @click="e => removeTag(e, item)"
      ></pa-icon>
    </div>
    <pa-popover ref="popoverRef" v-if="hideValue.length" :popoverWidth="popoverWidth" stopPropagation>
      <template #reference>
        <div class="pa-tag-text" style="width: initial">+{{ hideValue.length }}</div>
      </template>
      <div class="pa-tag">
        <div class="pa-tag-text" v-for="item in hideValue" :key="String(item.value)">
          <div class="pa-tag-text_content">
            {{ typeof item.label === "object" ? item.label[language] || item.label["zh-CN"] : item.label }}
          </div>
          <pa-icon v-if="!disabled" name="close_circle_line" class="pa-tag-text_close" @click="e => removeTag(e, item)"></pa-icon>
        </div>
      </div>
    </pa-popover>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { onMounted, ref, Ref, watch, nextTick, inject, ComputedRef } from "vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, TagListType } from "./types";

/**
 * **模块导入**
 * @description 导入元素位置计算工具函数
 * */
import { getElementPosition } from "../utils/getElementPosition";

/**
 * **模块导入**
 * @description 导入全局配置类型定义
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置对象，包含语言设置等
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

/**
 * **当前语言**
 * @type `string`
 * @description 当前语言标识
 * */
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), { useCollapse: true });

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits(["removeTag"]);

/**
 * **弹窗组件引用**
 * @type `Ref`
 * @description 弹窗组件的引用
 * */
const popoverRef = ref();

/**
 * **显示的标签列表**
 * @type `Ref<TagListType>`
 * @description 当前显示的标签列表
 * */
const inValue = ref<TagListType>(props.tagList || []);

/**
 * **标签容器引用**
 * @type `Ref<HTMLDivElement>`
 * @description 标签容器的 DOM 引用
 * */
const tagRef = ref<HTMLDivElement>();

/**
 * **隐藏的标签列表**
 * @type `Ref<TagListType>`
 * @description 被折叠隐藏的标签列表
 * */
const hideValue: Ref<TagListType> = ref([]);

/**
 * **透明度状态**
 * @type `Ref<number>`
 * @description 用于动画效果的透明度值
 * */
const isOpacity = ref(0);

/**
 * **移除标签**
 * @param `e` `Event` 点击事件
 * @param `data` `object` 标签数据
 * @description 触发 removeTag 事件
 * */
function removeTag(e: Event, data: object) {
  e.stopPropagation();
  emits("removeTag", data);
}

/**
 * **初始化弹窗显示**
 * @description 计算标签溢出，设置折叠显示
 * */
function initPopover() {
  if (!props.useCollapse) {
    isOpacity.value = 1;
  } else {
    nextTick(() => {
      const children = tagRef.value?.children;
      let spliceIndex = 0;
      if (children && Array.from(children).length) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const position = getElementPosition(child, tagRef.value as HTMLElement, { top: 0, left: 0, right: 40, bottom: 0 });
          if (position?.isFullInParent) spliceIndex++;
        }
        if (spliceIndex) {
          hideValue.value = props.tagList.slice(spliceIndex);
          inValue.value = props.tagList.slice(0, spliceIndex);
        }
        isOpacity.value = 1;
      }
    });
  }
}

/**
 * **组件挂载生命周期**
 * @description 初始化弹窗显示
 * */
onMounted(() => {
  initPopover();
});

/**
 * **监听 tagList 变化**
 * @description 标签列表变化时重新计算显示
 * */
watch(
  () => props.tagList,
  data => {
    inValue.value = data;
    initPopover();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
