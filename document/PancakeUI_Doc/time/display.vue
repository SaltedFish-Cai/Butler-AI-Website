<template>
  <pa-time v-model="dateValue" display :title="{ 'en-US': 'Display Mode', 'zh-CN': '展示模式' }" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const dateValue = ref("2026-04-23");
</script>
