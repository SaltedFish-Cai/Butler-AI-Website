<template>
  <pa-select-icon v-model="iconName" :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const iconName = ref("finger_press_line");
</script>
