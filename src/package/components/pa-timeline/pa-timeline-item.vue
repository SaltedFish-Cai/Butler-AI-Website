<template>
  <div
    :id="renderId"
    class="pa-timeline-item"
    :class="[props.class, { 'pa-timeline-item-center': props.center }]"
    :style="props.style"
  >
    <div class="pa-timeline-item__tail"></div>
    <div
      class="pa-timeline-item__node"
      :class="[`pa-timeline-item__node--${props.type}`, { 'is-hollow': props.hollow }]"
      :style="nodeStyle"
    >
      <slot name="node"></slot>
    </div>
    <div class="pa-timeline-item__wrapper">
      <div v-if="!props.hideTimestamp && props.placement === 'top'" class="pa-timeline-item__timestamp is-top">
        {{ props.timestamp }}
      </div>
      <slot></slot>
      <div v-if="!props.hideTimestamp && props.placement === 'bottom'" class="pa-timeline-item__timestamp is-bottom">
        {{ props.timestamp }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 计算与引用
 */
import { ref, computed } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentItemProps } from "./types";
/**
 * 模块导入
 * @description 导入 render-id 工具函数
 */
import useRenderId from "../tools/render-id";

/**
 * 组件属性
 * @type ComponentItemProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentItemProps>(), {
  timestamp: "",
  hideTimestamp: false,
  center: false,
  placement: "top",
  type: "primary",
  hollow: false
});
/**
 * 组件唯一标识
 * @type Ref<string>
 * @description 组件的唯一标识
 */
const renderId = ref(props.renderId || (props.id ? props.id : "pa-timeline-item_" + useRenderId()));
/**
 * 节点样式
 * @type ComputedRef<Record<string, string>>
 * @description 自定义 color 时覆盖节点背景色/边框色
 */
const nodeStyle = computed(() => (props.color ? { backgroundColor: props.color } : {}));
</script>

<style lang="scss">
@use "../styles/default/pa-timeline.scss";
</style>
