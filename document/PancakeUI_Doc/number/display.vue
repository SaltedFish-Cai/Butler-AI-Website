<template>
  <pa-number
    v-model="value3"
    controls
    display
    :contrastData="value2"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></pa-number>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value2 = ref(333);
const value3 = ref(2);
</script>

<style></style>
