<template>
  <div class="sa-badge">
    <slot></slot>
    <div v-if="show || (value && value != 0)" class="sa-badge__content">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SaBadgeType } from "./type";

withDefaults(defineProps<SaBadgeType>(), {});
</script>

<style lang="scss">
@use "./index.scss";
</style>
