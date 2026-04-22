<template>
  <section class="pa-icon" @click="props.onClick" :class="[props.class]" :style="{ ...props.style }">
    <span v-if="!tip" :class="['m-iconfont', 'm-iconfont_icon', `icon-${name}`]"></span>
    <template v-else>
      <pa-popover trigger="hover">
        <template #reference> <span class="m-iconfont m-iconfont_icon" :class="'icon-' + name"></span> </template>
        {{ tip }}
      </pa-popover>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { ComponentProps } from "./type";

// # Var
const props = withDefaults(defineProps<ComponentProps>(), {
  name: "magic_line"
});
</script>

<style lang="scss" scoped>
@use "./iconfont/iconfont.css";

.pa-icon {
  display: inline-block;
  font-family: "pa-iconfont" !important;
  font-size: calc(var(--pa-size-font) + 1px);
  .m-iconfont_icon {
    position: relative;
    z-index: 0;
    display: inline-block;
    width: 1em;
    height: 1em;
    font-size: inherit;
    line-height: 1em;
    font-family: "pa-iconfont" !important;
    // font-size: calc(var(--pa-size-font) + 1px);
  }
}
</style>
