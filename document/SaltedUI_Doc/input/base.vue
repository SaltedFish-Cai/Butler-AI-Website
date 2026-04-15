<template>
  <sa-title :padding="['bottom']">基础使用</sa-title>
  <sa-input
    v-model="value1"
    maxLength="2000"
    alwaysContrast
    :contrastData="value2"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></sa-input>

  <sa-title :padding="['bottom']">Display</sa-title>
  <sa-input v-model="value1" maxLength="2000" :contrastData="value2" display></sa-input>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref("123");
const value2 = ref("321");
</script>

<style></style>
