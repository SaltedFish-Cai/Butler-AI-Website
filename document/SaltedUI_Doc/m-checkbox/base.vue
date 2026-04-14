<template>
  <m-title-v2 :padding="['bottom']">基础使用</m-title-v2>
  <m-checkbox-v2 v-model="value1" :exOptions="exOptions"></m-checkbox-v2>

  <m-title-v2 :padding="['bottom']">Display</m-title-v2>
  <m-checkbox-v2 v-model="value1" :exOptions="exOptions" display></m-checkbox-v2>

  <m-title-v2 :padding="['bottom']">单组件使用</m-title-v2>
  <m-checkbox-v2-item v-model="value2" label="选项1" value="1"></m-checkbox-v2-item>
  <m-checkbox-v2-item v-model="value2" label="选项2" value="2" disabled></m-checkbox-v2-item>
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
