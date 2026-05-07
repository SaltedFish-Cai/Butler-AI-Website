<template>
  <div style="display: flex; gap: 10px">
    <pa-switch v-model="value1" disabled>禁用状态</pa-switch>
    <pa-switch v-model="value2" disabled>禁用状态（开启）</pa-switch>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(false);
const value2 = ref(true);
</script>

<style></style>
