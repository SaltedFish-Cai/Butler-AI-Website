<template>
  <div
    class="pa-title"
    :class="[
      props.class,
      props.styleMode,
      padding?.includes('top') ? 'padding-top' : '',
      padding?.includes('left') ? 'padding-left' : '',
      padding?.includes('bottom') ? 'padding-bottom' : '',
      padding?.includes('right') ? 'padding-right' : ''
    ]"
    :style="{ ...props.style }"
  >
    <div class="pa-title_box">
      <div class="pa-title_text">
        <slot />
        <div class="pa-title_tip" v-if="tipsPosition == 'right'">
          <div class="ml-size">
            (<slot name="tips"> {{ tips }} </slot>)
          </div>
        </div>
      </div>
    </div>
    <pa-line
      v-if="lineConfig"
      v-bind="
        lineConfig == true ? { padding: [0, 0, 0, 5], height: '3px' } : { padding: [0, 0, 0, 5], height: '3px', ...lineConfig }
      "
    />

    <div class="pa-title_tip" v-if="tipsPosition == 'bottom'">
      <slot name="tips">{{ tips }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps } from "./types";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  styleMode: "default",
  tipsPosition: "bottom",
  lineConfig: () => ({ padding: [0, 0, 0, 5], height: "3px" })
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
