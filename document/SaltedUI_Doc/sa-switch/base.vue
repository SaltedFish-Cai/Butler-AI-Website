<template>
  <sa-title :padding="['bottom']">基础使用</sa-title>
  <sa-switch v-model="value1" :activeText="'activeText'" :exOptions="exOptions"></sa-switch>

  <sa-title :padding="['bottom']">Display</sa-title>
  <sa-switch v-model="value1" :activeText="'activeText'" :exOptions="exOptions" display></sa-switch>
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
