<template>
  <pa-transfer v-model="value" :exOptions="options" useSearch />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value = ref([1]);
const options = ref([
  { value: 1, label: "选项一" },
  { value: 2, label: "选项二" },
  { value: 3, label: "选项三" },
  { value: 4, label: "选项四" },
  { value: 5, label: "选项五" }
]);
</script>

<style></style>
