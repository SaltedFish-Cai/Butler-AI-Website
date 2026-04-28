<template>
  <pa-time v-model="value1" type="year-picker" :title="{ 'en-US': 'Year Picker', 'zh-CN': '年选择器' }"></pa-time>

  <pa-time
    class="mt-size"
    v-model="value2"
    type="year-picker-group"
    :title="{ 'en-US': 'Year Picker Group', 'zh-CN': '年选择器组' }"
  ></pa-time>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref("2024");
const value2 = ref(["2014", "2024"]);
</script>

<style></style>
