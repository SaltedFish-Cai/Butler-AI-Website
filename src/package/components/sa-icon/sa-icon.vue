<template>
  <section class="sa-icon" @click="props.onClick" :class="[props.class]" :style="{ ...props.style }">
    <span v-if="!tip" :class="['m-iconfont', 'm-iconfont_icon', `icon-${name}`]"></span>
    <template v-else>
      <sa-popover trigger="hover">
        <template #reference> <span class="m-iconfont m-iconfont_icon" :class="'icon-' + name"></span> </template>
        {{ tip }}
      </sa-popover>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { SaIconType } from "./type";

// # Var
const props = withDefaults(defineProps<SaIconType>(), {
  name: "magic_line"
});
</script>

<style lang="scss" scoped>
@use "./iconfont/iconfont.css";

.sa-icon {
  display: inline-block;
  font-family: "m-iconfont-v2" !important;
  font-size: calc(var(--m-size-v2-font) + 1px);
  .m-iconfont_icon {
    position: relative;
    z-index: 0;
    display: inline-block;
    width: 1em;
    height: 1em;
    font-size: inherit;
    line-height: 1em;
    font-family: "m-iconfont-v2" !important;
    // font-size: calc(var(--m-size-v2-font) + 1px);
  }
}
</style>
