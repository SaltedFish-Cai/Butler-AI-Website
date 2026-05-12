<template>
  <pa-number
    v-model="value3"
    controls
    display
    :contrastData="value2"
    :title="{ 'en-US': 'Display Mode', 'zh-CN': '纯展示模式' }"
  ></pa-number>
  <pa-number
    v-model="value3"
    display
    :alwaysContrast="true"
    :contrastData="value2"
    :title="{ 'en-US': 'Always Contrast', 'zh-CN': '始终显示对比' }"
  ></pa-number>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value2 = ref(333);
const value3 = ref(2);
</script>

<style></style>
