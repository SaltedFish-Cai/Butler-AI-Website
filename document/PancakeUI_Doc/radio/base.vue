<template>
  <pa-radio v-model="value1" :exOptions="exOptions" :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"></pa-radio>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(1);

const exOptions = ref([
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 }
]);
</script>

<style></style>
