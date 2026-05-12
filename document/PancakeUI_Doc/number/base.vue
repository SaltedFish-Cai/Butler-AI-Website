<template>
  <pa-number
    v-model="value1"
    controls
    :contrastData="value2"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></pa-number>
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
  <pa-number v-model="value3" disabled :title="{ 'en-US': 'Disabled', 'zh-CN': '禁用状态' }"></pa-number>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(123);
const value2 = ref(99.99);
const value3 = ref(50);
</script>

<style></style>
