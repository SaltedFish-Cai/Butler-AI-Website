<template>
  <div
    :data-name="name"
    :data-label="label"
    class="pa-tabs-item flex-col"
    :class="[tabsContext.activeName === name ? 'active' : '', useBorder ? 'use-border' : '']"
    ref="ScrollbarRef"
  >
    <slot name="before"></slot>
    <div class="pa-tabs-item_body" v-if="init">
      <pa-scrollbar v-if="scroll && tabsContext.mode !== 'slider'" ref="scrollbarRef" :useScrollX="useScrollX" :padding="padding">
        <slot></slot>
      </pa-scrollbar>

      <div
        v-else
        class="pa-tabs-item-body_fix"
        :class="{
          'padding-top': padding?.includes('top') || padding?.includes('all'),
          'padding-left': padding?.includes('left') || padding?.includes('all'),
          'padding-bottom': padding?.includes('bottom') || padding?.includes('all'),
          'padding-right': padding?.includes('right') || padding?.includes('all')
        }"
      >
        <div
          v-if="tabsContext.mode === 'slider'"
          ref="tabItemLine"
          class="pa-tabs-item_title"
          :class="['tab-item_line_' + tabsContext.tabsId]"
          :data-label="label"
          :data-name="name"
          :id="tabsContext.tabsId + '-' + name"
        >
          <pa-title :tips="tips">
            {{ typeof label === "string" ? label : label?.[languageValue] }}
            <template #tips v-if="$slots['tips']">
              <slot name="tips"></slot>
            </template>
          </pa-title>
        </div>
        <slot></slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, onMounted, inject, provide, watch, computed, ComputedRef } from "vue";
/**
 * **模块导入**
 * @description 导入组件属性类型定义
 * */
import { ComponentItemProps } from "./types";
/**
 * **模块导入**
 * @description 导入全局配置类型定义
 * */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * **全局配置**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入 Pancake 全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * **语言值**
 * @type `ComputedRef<string>`
 * @description 当前语言设置
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * **滚动条引用**
 * @type `Ref<any>`
 * @description 滚动条组件的引用
 * */
const scrollbarRef = ref<any>();
provide("parentScrollbarRef", scrollbarRef);
/**
 * **标签页上下文**
 * @description 注入标签页父组件提供的上下文
 * */
const tabsContext = inject("TabsContext") as {
  mode: "default" | "portrait" | "slider" | "sticky";
  tabsId: string;
  activeName: string;
};
/**
 * **初始化标题函数**
 * @type `any`
 * @description 注入的标题初始化函数
 * */
const initTitle: any = inject("initTitle");
/**
 * **组件属性**
 * @type `ComponentItemProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentItemProps>(), {});
/**
 * **标签项线条引用**
 * @type `Ref<any>`
 * @description 标签项底部线条的 DOM 引用
 * */
const tabItemLine = ref<any>();
/**
 * **滚动条容器引用**
 * @type `Ref<any>`
 * @description 滚动条容器的 DOM 引用
 * */
const ScrollbarRef = ref<any>();
/**
 * **初始化状态**
 * @type `Ref<boolean>`
 * @description 组件是否已初始化
 * */
const init = ref(false);
/**
 * **组件挂载生命周期**
 * @description 初始化组件懒加载状态
 * */
onMounted(() => {
  if (props.lazy == true) {
    init.value = false;
  } else if (props.lazy == false) {
    init.value = true;
  } else {
    setTimeout(
      () => {
        init.value = true;
      },
      typeof props.lazy === "number" ? props.lazy : 3000
    );
  }
});
/**
 * **暴露组件引用**
 * @description 暴露滚动条容器引用供父组件使用
 */
defineExpose({
  ScrollbarRef: ScrollbarRef
});
/**
 * **监听 name 变化**
 * @description 标签名变化时重新初始化标题数据
 * */
watch(
  () => props.name,
  () => {
    initTitle();
  },
  { immediate: true }
);
/**
 * **监听 label 变化**
 * @description 标签内容变化时重新初始化标题数据
 * */
watch(
  () => props.label,
  () => {
    initTitle();
  },
  { immediate: true }
);
</script>

<style lang="scss">
.pa-tabs-item_title {
  position: relative;

  .tab-item_line_load {
    position: absolute;
    display: none;
  }
}

.pa-tabs-item_body {
  height: 1px;
  flex: 1;
}

.pa-tabs-item {
  display: flex;
  flex: 0 0 100%;
  width: 100%;
  visibility: hidden;

  .pa-tabs-item-body_fix {
    height: calc(100% - 0px);
    box-sizing: border-box;
  }
}

.pa-tabs-item-body_fix.padding-top {
  padding-top: calc(var(--pa-size-padding, 10px)) !important;
}

.pa-tabs-item-body_fix.padding-left {
  padding-left: calc(var(--pa-size-padding, 10px)) !important;
}

.pa-tabs-item-body_fix.padding-bottom {
  padding-bottom: calc(var(--pa-size-padding, 10px)) !important;
}

.pa-tabs-item-body_fix.padding-right {
  padding-right: calc(var(--pa-size-padding, 10px)) !important;
}

.pa-tabs-item.active {
  visibility: visible;
}
</style>
