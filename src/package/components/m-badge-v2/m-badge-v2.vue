<template>
  <div class="m-badge-v2">
    <slot></slot>
    <div v-if="show || (value && value != 0)" class="m-badge-v2__content">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MBadgeV2Type } from "./type";

withDefaults(defineProps<MBadgeV2Type>(), {});
</script>

<style lang="scss">
@use "./index.scss";
</style>
