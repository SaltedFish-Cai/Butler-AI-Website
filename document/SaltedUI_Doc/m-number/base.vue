<template>
  <m-title-v2 :padding="['bottom']">基础使用</m-title-v2>
  <m-number-v2 v-model="value1" controls :size="size" :contrastData="value2"></m-number-v2>

  <m-title-v2 :padding="['bottom']">Display</m-title-v2>
  <m-number-v2 v-model="value3" controls :size="size" display :contrastData="value2"></m-number-v2>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
const value1 = ref(123);
const value2 = ref(333);
const value3 = ref();

const size: Ref<"default" | "large" | "small"> = ref("default");
</script>

<style></style>
