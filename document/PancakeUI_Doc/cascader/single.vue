<template>
  <pa-cascader
    v-model="value1"
    :exOptions="exOptions"
    :type="'cascader-check'"
    :title="{ 'en-US': 'Single Usage', 'zh-CN': '单选使用' }"
  />

  <pa-cascader
    class="mt-size"
    v-model="value2"
    :exOptions="exOptions"
    :type="'multiple-cascader-check'"
    :title="{ 'en-US': 'Multiple Usage', 'zh-CN': '多选使用' }"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(1);
const value2 = ref([1, 31]);

const exOptions = ref([
  { label: "选项1", value: 1, children: [{ label: "选项1-1", value: 11 }] },
  { label: "选项2", value: 2 },
  {
    label: "选项3",
    value: 3,
    children: [
      { label: "选项3-1", value: 31 },
      { label: "选项3-2", value: 32 }
    ]
  }
]);
</script>

<style></style>
