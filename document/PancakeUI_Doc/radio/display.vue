<template>
  <pa-radio v-model="value" :exOptions="options" display :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"></pa-radio>
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref("1");

const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" }
];
</script>
