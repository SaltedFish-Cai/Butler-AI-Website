<template>
  <div class="pa-badge">
    <slot></slot>
    <template v-if="useShow || showVal || useDot">
      <div v-if="useDot" class="pa-badge__dot"></div>
      <div v-else class="pa-badge__content">{{ showVal }}</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { ComponentProps } from "./type";

const props = withDefaults(defineProps<ComponentProps>(), {});

const showVal = computed(() => {
  if (props.maxValue && typeof Number(props.value) === "number") {
    const _maxValue = Number(props.maxValue);
    const _value = Number(props.value);
    return _value > _maxValue ? _maxValue + "+" : _value;
  }
  return props.value;
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
