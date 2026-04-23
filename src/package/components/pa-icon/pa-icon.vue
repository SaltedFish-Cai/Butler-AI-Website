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
import { ComponentProps } from "./types";

// # Var
const props = withDefaults(defineProps<ComponentProps>(), {
  name: "magic_line"
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
