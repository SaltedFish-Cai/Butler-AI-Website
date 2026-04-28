<template>
  <pa-input
    v-model="value1"
    maxLength="2000"
    alwaysContrast
    :contrastData="value2"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></pa-input>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref("123");
const value2 = ref("321");
</script>

<style></style>
