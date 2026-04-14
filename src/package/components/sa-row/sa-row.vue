<template>
  <div :class="classes" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="MRow">
import { computed, provide, ref, onMounted, onUnmounted } from "vue";
import type { BreakPoint } from "@/package/components/sa-col/type";

interface Props {
  gutter?: string;
  edgeGutter?: string;
  justify?: "center" | "end" | "space-around" | "space-between" | "start";
  align?: "bottom" | "middle" | "top";
  tag?: string;
}

const props = withDefaults(defineProps<Props>(), {
  justify: "start",
  align: "top",
  tag: "div"
});

// 计算类名
const classes = computed(() => {
  const classList = ["m-row"];

  // 添加justify类
  classList.push(`m-row--${props.justify}`);

  // 添加align类
  classList.push(`m-row--align-${props.align}`);

  return classList;
});

// 计算样式
const style = computed(() => {
  const styles: Record<string, string> = {};

  // 设置gutter
  const _gutter = props.gutter || props.edgeGutter;
  if (_gutter) {
    styles.marginLeft = `calc(0px - ${_gutter})`;
    styles.marginRight = `calc(0px - ${_gutter})`;
  }

  return styles;
});

// 使用ref存储当前断点
const breakPoint = ref<BreakPoint>("xl");

// 计算当前断点
const calculateBreakPoint = () => {
  const width = window.innerWidth;
  if (width < 384) return "xs";
  if (width < 768) return "sm";
  if (width < 992) return "md";
  if (width < 1200) return "lg";
  return "xl";
};

// 监听窗口大小变化
const handleResize = () => {
  breakPoint.value = calculateBreakPoint();
};

// 组件挂载时初始化断点并添加事件监听
onMounted(() => {
  breakPoint.value = calculateBreakPoint();
  window.addEventListener("resize", handleResize);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// 提供断点信息给子组件
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
.m-row {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

// 水平对齐方式
.m-row--start {
  justify-content: flex-start;
}

.m-row--end {
  justify-content: flex-end;
}

.m-row--center {
  justify-content: center;
}

.m-row--space-around {
  justify-content: space-around;
}

.m-row--space-between {
  justify-content: space-between;
}

// 垂直对齐方式
.m-row--align-top {
  align-items: flex-start;
}

.m-row--align-middle {
  align-items: center;
}

.m-row--align-bottom {
  align-items: flex-end;
}
</style>
