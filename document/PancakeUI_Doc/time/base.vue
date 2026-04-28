<template>
  <pa-time v-model="value2" type="date-picker" :title="{ 'en-US': 'Date Picker', 'zh-CN': '日期选择器' }"></pa-time>

  <pa-time
    class="mt-size"
    v-model="value1"
    type="date-picker-group"
    :title="{ 'en-US': 'Date Picker Group', 'zh-CN': '日期选择器组' }"
  ></pa-time>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(["2024-04-23 00:00:00", "2024-04-28 00:00:01"]);
const value2 = ref("2024-04-23 00:00:00");
</script>

<style></style>
