<template>
  <pa-number
    v-model="value1"
    controls
    :contrastData="value2"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></pa-number>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(123);
const value2 = ref(333);
</script>

<style></style>
