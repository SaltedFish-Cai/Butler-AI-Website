<template>
  <pa-transfer v-model="value" :exOptions="options" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value = ref([1, 3, 6, 13]);
const options = ref([
  { value: 1, label: "选项一" },
  { value: 2, label: "选项二" },
  { value: 3, label: "选项三" },
  { value: 4, label: "选项四" },
  { value: 5, label: "选项五" },
  { value: 6, label: "选项六" },
  { value: 7, label: "选项七" },
  { value: 8, label: "选项八" },
  { value: 9, label: "选项九" },
  { value: 10, label: "选项十" },
  { value: 11, label: "选项十一" },
  { value: 12, label: "选项十二" },
  { value: 13, label: "选项十三" },
  { value: 14, label: "选项十四" },
  { value: 15, label: "选项十五" },
  { value: 16, label: "选项十六" },
  { value: 17, label: "选项十七" },
  { value: 18, label: "选项十八" }
]);
</script>

<style></style>
