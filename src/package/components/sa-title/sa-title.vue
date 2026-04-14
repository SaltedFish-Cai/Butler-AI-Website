<template>
  <div
    class="sa-title"
    :class="[
      !!props.line ? '' : 'sa-title_no-line',
      padding?.includes('top') ? 'padding-top' : '',
      padding?.includes('left') ? 'padding-left' : '',
      padding?.includes('bottom') ? 'padding-bottom' : '',
      padding?.includes('right') ? 'padding-right' : ''
    ]"
  >
    <div class="sa-title_box" :class="[!!props.line ? '' : 'sa-title_no-line']">
      <div class="sa-title_text"><slot /></div>
    </div>
    <div class="sa-title_tip">
      <slot name="tips">{{ tips }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
// # Import
import { SaTitleType } from "./type";

// # Var
const props = withDefaults(defineProps<SaTitleType>(), {
  line: true
});
</script>

<style lang="scss">
.sa-title {
  position: relative;
  font-weight: bold;
  font-size: var(--sa-size-font, 13px);
  margin-left: 0;
  color: var(--m-color-primary);
  width: calc(100% - var(--m-scroll-padding));

  .sa-title_box {
    position: relative;
    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: calc(var(--sa-size-padding, 10px) * 0.3);
      border-radius: 0 8px;
      left: 3px;
      z-index: 1;
      width: calc(100% - 3px);
      background-color: var(--m-color-primary-light-7);
    }
  }

  .sa-title_text {
    display: inline-flex;
    width: max-content;
    position: relative;
    padding-bottom: calc(var(--sa-size-padding, 10px) * 0.8);
    &::after {
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      height: calc(var(--sa-size-padding, 10px) * 0.8);
      border-radius: 0 8px;
      z-index: 2;
      left: 0px;
      width: 100%;
      background-color: var(--m-color-primary);
    }
  }

  .sa-title_tip {
    font-size: 14px;
  }
}

.sa-title_no-line {
  padding-bottom: 0px !important;
  width: max-content;
  &::after {
    display: none;
  }
  .sa-title_text {
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
.sa-title.padding-top {
  padding-top: var(--sa-size-padding, 10px);
}
.sa-title.padding-left {
  padding-left: var(--sa-size-padding, 10px);
  width: calc(100% - calc(var(--sa-size-padding, 10px)));
}
.sa-title.padding-bottom {
  padding-bottom: var(--sa-size-padding, 10px);
}
.sa-title.padding-right {
  padding-right: var(--sa-size-padding, 10px);
  width: calc(100% - calc(var(--sa-size-padding, 10px)));
}

.sa-title.padding-left.padding-right {
  width: calc(100% - calc(var(--sa-size-padding, 10px)) * 2);
}

// .m-scrollbar:has(> .is-vertical .el-scrollbar__thumb[style*="height"]) {
//   .el-scrollbar__view {
//     .sa-title {
//       --m-scroll-padding: var(--sa-size-padding, 10px);
//     }
//   }
// }
</style>
