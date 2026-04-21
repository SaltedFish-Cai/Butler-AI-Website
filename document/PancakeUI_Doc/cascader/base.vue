<template>
  <pa-title :padding="['bottom']">基础使用</pa-title>
  <pa-cascader v-model="value1" :exOptions="exOptions" :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"></pa-cascader>

  <pa-title :padding="['bottom']">Display</pa-title>
  <pa-cascader v-model="value3" :exOptions="exOptions" display></pa-cascader>

  <pa-title :padding="['bottom']">单层选择</pa-title>
  <pa-cascader v-model="value2" :exOptions="exOptions" :type="'cascader-check'"></pa-cascader>

  <pa-title :padding="['bottom']">单层多选择</pa-title>
  <pa-cascader v-model="value3" :exOptions="exOptions" :type="'multiple-cascader-check'"></pa-cascader>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(31);
const value2 = ref(1);
const value3 = ref([1, 31]);

const exOptions = ref([
  { label: "选项1", value: 1, children: [{ label: "选项1-1", value: 11 }] },
  { label: "选项2", value: 2 },
  {
    label: "选项3",
    value: 3,
    children: [
      { label: "选项3-1", value: 31 },
      { label: "选项3-2", value: 32 }
    ]
  }
]);
</script>

<style></style>
