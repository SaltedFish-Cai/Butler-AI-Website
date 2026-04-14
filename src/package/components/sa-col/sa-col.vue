<template>
  <div :style="style" :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="MCol">
import { computed, inject, ref, Ref } from "vue";
import type { BreakPoint, Responsive } from "./type";

interface Props {
  span?: number;
  offset?: number;
  xs?: Responsive | number;
  sm?: Responsive | number;
  md?: Responsive | number;
  lg?: Responsive | number;
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

// 注入断点信息，如果没有则默认使用xl
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref<BreakPoint>("xl"));
const gutter = inject<Ref<string>>("gutter", ref<string>("0px"));

// 获取当前断点对应的span和offset值
const currentSpan = computed(() => {
  const responsive = props[breakPoint.value];
  if (props.span) return props.span;

  const span = typeof responsive === "number" ? responsive : responsive?.span;
  if (span !== undefined) {
    return span;
  }
  return props.span;
});

// const currentOffset = computed(() => {
//   const responsive = props[breakPoint.value];
//   const offset = typeof responsive === "number" ? 0 : responsive?.offset;
//   if (offset !== undefined) {
//     return offset;
//   }
//   return props.offset;
// });

// 计算样式
const style = computed(() => {
  const span = currentSpan.value || 0;
  // const offset = currentOffset.value || 0;

  const marginValue = gutter.value ? `${gutter.value}` : "0";
  const data = {
    // 使用CSS变量或直接计算百分比宽度
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

// 计算类名
const classes = computed(() => {
  const classList = ["m-col"];

  // 添加固定的span和offset类
  if (props.span !== 24) {
    classList.push(`m-col-${props.span}`);
  }
  if (props.offset > 0) {
    classList.push(`m-col-offset-${props.offset}`);
  }

  // 添加响应式类
  const breakPoints: BreakPoint[] = ["xs", "sm", "md", "lg", "xl"];
  breakPoints.forEach(bp => {
    const responsive = props[bp];
    if (responsive) {
      const span = typeof responsive === "number" ? responsive : responsive.span;

      if (span !== undefined) {
        classList.push(`m-col-${bp}-${span}`);
      }
      const offset = typeof responsive === "number" ? 0 : responsive.offset;
      if (offset !== undefined && offset > 0) {
        classList.push(`m-col-${bp}-offset-${offset}`);
      }
    }
  });

  return classList;
});
</script>

<style lang="scss" scoped>
.m-col {
  position: relative;
  min-height: 1px;
  box-sizing: border-box;
  float: left;
}

// 基础列宽样式
@for $i from 1 through 24 {
  .m-col-#{$i} {
    flex: 0 0 percentage($i / 24);
    max-width: percentage($i / 24);
  }

  .m-col-offset-#{$i} {
    margin-left: percentage($i / 24);
  }
}

// 响应式断点样式
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
      .m-col-#{$bp}-#{$i} {
        flex: 0 0 percentage($i / 24);
        max-width: percentage($i / 24);
      }

      .m-col-#{$bp}-offset-#{$i} {
        margin-left: percentage($i / 24);
      }
    }
  }
}
</style>
