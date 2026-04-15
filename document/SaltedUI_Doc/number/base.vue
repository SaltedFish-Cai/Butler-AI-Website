<template>
  <sa-title :padding="['bottom']">基础使用</sa-title>
  <sa-number
    v-model="value1"
    controls
    :size="size"
    :contrastData="value2"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></sa-number>

  <sa-title :padding="['bottom']">Display</sa-title>
  <sa-number v-model="value3" controls :size="size" display :contrastData="value2"></sa-number>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
const value1 = ref(123);
const value2 = ref(333);
const value3 = ref();

const size: Ref<"default" | "large" | "small"> = ref("default");
</script>

<style></style>
