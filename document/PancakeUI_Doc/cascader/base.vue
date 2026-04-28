<template>
  <pa-cascader v-model="value1" :exOptions="exOptions" :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }" />

  <pa-cascader
    class="mt-size"
    v-model="value2"
    :exOptions="exOptions"
    type="multiple-cascader"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(31);
const value2 = ref([2, 31]);

const exOptions = ref([
  {
    label: { "zh-CN": "选项1", "en-US": "Option1" },
    value: 1,
    children: [{ label: { "zh-CN": "选项1-1", "en-US": "Option1-1" }, value: 11 }]
  },
  { label: { "zh-CN": "选项2", "en-US": "Option2" }, value: 2 },
  {
    label: { "zh-CN": "选项3", "en-US": "Option3" },
    value: 3,
    children: [
      { label: { "zh-CN": "选项3-1", "en-US": "Option3-1" }, value: 31 },
      { label: { "zh-CN": "选项3-2", "en-US": "Option3-2" }, value: 32 }
    ]
  }
]);
</script>

<style></style>
