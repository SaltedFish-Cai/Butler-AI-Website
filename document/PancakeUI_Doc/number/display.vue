<template>
  <pa-number
    v-model="value3"
    controls
    :size="size"
    display
    :contrastData="value2"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></pa-number>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
const value2 = ref(333);
const value3 = ref(2);

const size: Ref<"default" | "large" | "small"> = ref("default");
</script>

<style></style>
