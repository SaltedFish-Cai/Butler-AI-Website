<template>
  <sa-title :padding="['bottom']">基础使用</sa-title>
  <sa-checkbox v-model="value1" :exOptions="exOptions"></sa-checkbox>

  <sa-title :padding="['bottom']">Display</sa-title>
  <sa-checkbox v-model="value1" :exOptions="exOptions" display></sa-checkbox>

  <sa-title :padding="['bottom']">单组件使用</sa-title>
  <sa-checkbox-item v-model="value2" label="选项1" value="1"></sa-checkbox-item>
  <sa-checkbox-item v-model="value2" label="选项2" value="2" disabled></sa-checkbox-item>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref([1]);
const value2 = ref(1);

const exOptions = ref([
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 }
]);
</script>

<style></style>
