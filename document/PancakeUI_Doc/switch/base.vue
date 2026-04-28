<template>
  <pa-switch
    v-model="value1"
    :activeText="'activeTextAAA'"
    :exOptions="exOptions"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></pa-switch>
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
