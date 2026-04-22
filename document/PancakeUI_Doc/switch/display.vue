<template>
  <pa-switch v-model="value" display :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref(true);
</script>
