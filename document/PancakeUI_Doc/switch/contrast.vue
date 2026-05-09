<template>
  <pa-switch
    v-model="value"
    :contrastData="contrastValue"
    :alwaysContrast="true"
    :title="{ 'en-US': 'Contrast', 'zh-CN': '对比数据' }"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value = ref(true);
const contrastValue = ref(false);
</script>

<style></style>
