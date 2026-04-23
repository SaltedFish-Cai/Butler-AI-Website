<template>
  <pa-time v-model="value1" type="time-picker" :title="{ 'en-US': 'Time Picker', 'zh-CN': '时间选择器' }"></pa-time>

  <pa-time
    class="mt-size"
    v-model="value2"
    type="time-picker-group"
    :title="{ 'en-US': 'Time Picker Group', 'zh-CN': '时间选择器组' }"
  ></pa-time>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref("2024-04-23 20:32:00");
const value2 = ref(["2024-04-23 20:00:00", "2024-04-28 00:00:01"]);
</script>

<style></style>
