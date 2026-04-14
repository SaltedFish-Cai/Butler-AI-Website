<template>
  <m-title-v2 :padding="['bottom']">基础使用</m-title-v2>
  <m-switch-v2 v-model="value1" :activeText="'activeText'" :exOptions="exOptions"></m-switch-v2>

  <m-title-v2 :padding="['bottom']">Display</m-title-v2>
  <m-switch-v2 v-model="value1" :activeText="'activeText'" :exOptions="exOptions" display></m-switch-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(1);

const exOptions = ref({
  activeValue: "1",
  inActiveValue: "2",
  inActiveText: "选择2"
});
</script>

<style></style>
