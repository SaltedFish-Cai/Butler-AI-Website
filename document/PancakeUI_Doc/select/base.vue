<template>
  <pa-select v-model="value1" :exOptions="exOptions" :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"></pa-select>
  <pa-select
    class="mt-size"
    type="multiple-select"
    v-model="value2"
    :exOptions="exOptions"
    :title="{ 'en-US': 'Multiple Select', 'zh-CN': '多选择' }"
  ></pa-select>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(1);
const value2 = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const exOptions = ref([
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 },
  { label: "选项3", value: 3 },
  { label: "选项4", value: 4 },
  { label: "选项5", value: 5 },
  { label: "选项6", value: 6 },
  { label: "选项7", value: 7 },
  { label: "选项8", value: 8 },
  { label: "选项9", value: 9 },
  { label: "选项10", value: 10 }
]);
</script>

<style></style>
