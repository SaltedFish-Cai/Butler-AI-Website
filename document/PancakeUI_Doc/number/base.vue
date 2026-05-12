<template>
  <pa-number
    v-model="value2"
    controls
    :precision="2"
    :step="0.1"
    :min="0"
    :max="100"
    unit="元"
    :title="{ 'en-US': 'Precision', 'zh-CN': '精度控制' }"
  ></pa-number>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value2 = ref(99.99);
</script>

<style></style>
