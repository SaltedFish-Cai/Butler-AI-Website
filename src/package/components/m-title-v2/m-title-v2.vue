<template>
  <div
    class="m-title-v2"
    :class="[
      !!props.line ? '' : 'm-title-v2_no-line',
      padding?.includes('top') ? 'padding-top' : '',
      padding?.includes('left') ? 'padding-left' : '',
      padding?.includes('bottom') ? 'padding-bottom' : '',
      padding?.includes('right') ? 'padding-right' : ''
    ]"
  >
    <div class="m-title-v2_box" :class="[!!props.line ? '' : 'm-title-v2_no-line']">
      <div class="m-title-v2_text"><slot /></div>
    </div>
    <div class="m-title-v2_tip">
      <slot name="tips">{{ tips }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
// # Import
import { MTitleV2Type } from "./type";

// # Var
const props = withDefaults(defineProps<MTitleV2Type>(), {
  line: true
});
</script>

<style lang="scss">
.m-title-v2 {
  position: relative;
  font-weight: bold;
  font-size: var(--m-component-font-size, 13px);
  margin-left: 0;
  color: var(--m-color-primary);
  width: calc(100% - var(--m-scroll-padding));

  .m-title-v2_box {
    position: relative;
    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: calc(var(--m-component-padding-size, 10px) * 0.3);
      border-radius: 0 8px;
      left: 3px;
      z-index: 1;
      width: calc(100% - 3px);
      background-color: var(--m-color-primary-light-7);
    }
  }

  .m-title-v2_text {
    display: inline-flex;
    width: max-content;
    position: relative;
    padding-bottom: calc(var(--m-component-padding-size, 10px) * 0.8);
    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: calc(var(--m-component-padding-size, 10px) * 0.8);
      border-radius: 0 8px;
      z-index: 2;
      left: 0px;
      width: 100%;
      background-color: var(--m-color-primary);
    }
  }

  .m-title-v2_tip {
    font-size: 14px;
  }
}

.m-title-v2_no-line {
  padding-bottom: 0px !important;
  width: max-content;
  &::after {
    display: none;
  }
  .m-title-v2_text {
    padding-bottom: 5px;

    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: 5px;
      border-radius: 0 5px;
      z-index: 2;
      left: 0px;
      width: 100%;
      background-color: var(--m-color-primary);
    }
  }
}
.m-title-v2.padding-top {
  padding-top: var(--m-component-padding-base, 10px);
}
.m-title-v2.padding-left {
  padding-left: var(--m-component-padding-base, 10px);
  width: calc(100% - calc(var(--m-component-padding-base, 10px)));
}
.m-title-v2.padding-bottom {
  padding-bottom: var(--m-component-padding-base, 10px);
}
.m-title-v2.padding-right {
  padding-right: var(--m-component-padding-base, 10px);
  width: calc(100% - calc(var(--m-component-padding-base, 10px)));
}

.m-title-v2.padding-left.padding-right {
  width: calc(100% - calc(var(--m-component-padding-base, 10px)) * 2);
}

// .m-scrollbar:has(> .is-vertical .el-scrollbar__thumb[style*="height"]) {
//   .el-scrollbar__view {
//     .m-title-v2 {
//       --m-scroll-padding: var(--m-component-padding-size, 10px);
//     }
//   }
// }
</style>
