<template>
  <pa-time
    v-model="dateValue"
    display
    title="日期"
    title-width="80px"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const dateValue = ref("2026-04-23");
</script>
