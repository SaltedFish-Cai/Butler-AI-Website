<template>
  <div :class="classes" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="PaRow">
/**
 * @component PaRow
 * @description 栅格行组件，需配合 PaCol 使用
 * @author Butler AI
 */
import { computed, provide, ref, onMounted, onUnmounted } from "vue";
import type { RowJustify, RowAlign } from "./types";
import "./index.scss";

/**
 * PaRow 组件 Props
 */
interface Props {
  /** 栅格间隔 */
  gutter?: string;
  /** 边缘栅格间隔 */
  edgeGutter?: string;
  /** 水平排列方式 */
  justify?: RowJustify;
  /** 垂直排列方式 */
  align?: RowAlign;
  /** 自定义元素标签 */
  tag?: string;
}

const props = withDefaults(defineProps<Props>(), {
  justify: "start",
  align: "top",
  tag: "div"
});

/** 计算类名 */
const classes = computed(() => {
  const classList = ["pa-row"];

  classList.push(`pa-row--${props.justify}`);

  classList.push(`pa-row--align-${props.align}`);

  return classList;
});

/** 计算样式 */
const style = computed(() => {
  const styles: Record<string, string> = {};

  const _gutter = props.gutter || props.edgeGutter;
  if (_gutter) {
    styles.marginLeft = `calc(0px - ${_gutter})`;
    styles.marginRight = `calc(0px - ${_gutter})`;
  }

  return styles;
});

/** 断点类型 */
type BreakPoint = "lg" | "md" | "sm" | "xl" | "xs";

/** 当前断点 */
const breakPoint = ref<BreakPoint>("xl");

/** 计算当前断点 */
const calculateBreakPoint = (): BreakPoint => {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  if (width < 384) return "xs";
  if (width < 768) return "sm";
  if (width < 992) return "md";
  if (width < 1200) return "lg";
  return "xl";
};

/** 监听窗口大小变化 */
const handleResize = (): void => {
  breakPoint.value = calculateBreakPoint();
};

/** 组件挂载时初始化断点并添加事件监听 */
onMounted(() => {
  breakPoint.value = calculateBreakPoint();
  if (typeof window !== "undefined") window.addEventListener("resize", handleResize);
});

/** 组件卸载时移除事件监听 */
onUnmounted(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", handleResize);
});

/** 提供断点信息给子组件 */
provide("breakPoint", breakPoint);
provide(
  "gutter",
  computed(() => {
    const gutter = props.gutter;
    if (!gutter) return "0px";
    return `${gutter}`;
  })
);
</script>

<style lang="scss" scoped>
.pa-row {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.pa-row--start {
  justify-content: flex-start;
}

.pa-row--end {
  justify-content: flex-end;
}

.pa-row--center {
  justify-content: center;
}

.pa-row--space-around {
  justify-content: space-around;
}

.pa-row--space-between {
  justify-content: space-between;
}

.pa-row--align-top {
  align-items: flex-start;
}

.pa-row--align-middle {
  align-items: center;
}

.pa-row--align-bottom {
  align-items: flex-end;
}
</style>
