<template>
  <m-title-v2 :padding="['bottom']">基础使用</m-title-v2>
  <m-input-v2 v-model="value1" maxLength="2000" alwaysContrast :contrastData="value2"></m-input-v2>

  <m-title-v2 :padding="['bottom']">Display</m-title-v2>
  <m-input-v2 v-model="value1" maxLength="2000" :contrastData="value2" display></m-input-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref("123");
const value2 = ref("321");
</script>

<style></style>
