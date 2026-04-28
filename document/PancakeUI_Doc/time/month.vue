<template>
  <pa-time v-model="value1" type="month-picker" :title="{ 'en-US': 'Month Picker', 'zh-CN': '月份选择器' }"></pa-time>

  <pa-time
    class="mt-size"
    v-model="value2"
    type="month-picker-group"
    :title="{ 'en-US': 'Month Picker Group', 'zh-CN': '月份选择器组' }"
  ></pa-time>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref("2024-04");
const value2 = ref(["2025-08", "2025-08"]);
</script>

<style></style>
