<template>
  <m-title-v2 :padding="['bottom']">基础使用</m-title-v2>
  <m-cascader-v2 v-model="value1" :exOptions="exOptions" clearable></m-cascader-v2>

  <m-title-v2 :padding="['bottom']">Display</m-title-v2>
  <m-cascader-v2 v-model="value3" :exOptions="exOptions" display></m-cascader-v2>

  <m-title-v2 :padding="['bottom']">单层选择</m-title-v2>
  <m-cascader-v2 v-model="value2" :exOptions="exOptions" :type="'cascader-check'"></m-cascader-v2>

  <m-title-v2 :padding="['bottom']">单层多选择</m-title-v2>
  <m-cascader-v2 v-model="value3" :exOptions="exOptions" :type="'multiple-cascader-check'"></m-cascader-v2>
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
