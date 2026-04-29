<template>
  <div :style="style" :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="PaCol">
/**
 * @component PaCol
 * @description 栅格列组件，需配合 PaRow 使用
 * @author Butler AI
 */
import { computed, inject, ref, Ref } from "vue";
import type { BreakPoint, Responsive } from "./types";
import "./index.scss";

/**
 * PaCol 组件 Props
 */
interface Props {
  /** 栅格占据的列数（共24列） */
  span?: number;
  /** 栅格左侧的间隔格数 */
  offset?: number;
  /** <576px 响应式配置 */
  xs?: Responsive | number;
  /** ≥576px 响应式配置 */
  sm?: Responsive | number;
  /** ≥768px 响应式配置 */
  md?: Responsive | number;
  /** ≥992px 响应式配置 */
  lg?: Responsive | number;
  /** ≥1200px 响应式配置 */
  xl?: Responsive | number;
}

const props = withDefaults(defineProps<Props>(), {
  offset: 0,
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined
});

/** 注入断点信息，如果没有则默认使用xl */
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref<BreakPoint>("xl"));
const gutter = inject<Ref<string>>("gutter", ref<string>("0px"));

/** 获取当前断点对应的span值 */
const currentSpan = computed(() => {
  const responsive = props[breakPoint.value];
  if (props.span) return props.span;

  const span = typeof responsive === "number" ? responsive : responsive?.span;
  if (span !== undefined) {
    return span;
  }
  return props.span;
});

/** 计算样式 */
const style = computed(() => {
  const span = currentSpan.value || 0;

  const marginValue = gutter.value ? `${gutter.value}` : "0";
  const data = {
    flex: `0 0 ${(span / 24) * 100}%`,
    maxWidth: `calc(${span / 24} * 100% - ${marginValue})`,
    marginLeft: marginValue,
    paddingRight: marginValue,
    marginTop: marginValue,
    marginBottom: marginValue,
    boxSizing: "border-box" as const
  };
  return data;
});

/** 计算类名 */
const classes = computed(() => {
  const classList = ["pa-col"];

  if (props.span !== 24) {
    classList.push(`pa-col-${props.span}`);
  }
  if (props.offset > 0) {
    classList.push(`pa-col-offset-${props.offset}`);
  }

  const breakPoints: BreakPoint[] = ["xs", "sm", "md", "lg", "xl"];
  breakPoints.forEach(bp => {
    const responsive = props[bp];
    if (responsive) {
      const span = typeof responsive === "number" ? responsive : responsive.span;

      if (span !== undefined) {
        classList.push(`pa-col-${bp}-${span}`);
      }
      const offset = typeof responsive === "number" ? 0 : responsive.offset;
      if (offset !== undefined && offset > 0) {
        classList.push(`pa-col-${bp}-offset-${offset}`);
      }
    }
  });

  return classList;
});
</script>

<style lang="scss" scoped>
.pa-col {
  position: relative;
  min-height: 1px;
  box-sizing: border-box;
  float: left;
}

@for $i from 1 through 24 {
  .pa-col-#{$i} {
    flex: 0 0 percentage($i / 24);
    max-width: percentage($i / 24);
  }

  .pa-col-offset-#{$i} {
    margin-left: percentage($i / 24);
  }
}

$breakpoints: (
  "xs": 0,
  "sm": 384px,
  "md": 768px,
  "lg": 992px,
  "xl": 1200px
);

@each $bp, $width in $breakpoints {
  @media (min-width: $width) {
    @for $i from 1 through 24 {
      .pa-col-#{$bp}-#{$i} {
        flex: 0 0 percentage($i / 24);
        max-width: percentage($i / 24);
      }

      .pa-col-#{$bp}-offset-#{$i} {
        margin-left: percentage($i / 24);
      }
    }
  }
}
</style>
