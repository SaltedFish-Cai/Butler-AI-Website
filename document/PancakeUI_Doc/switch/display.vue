<template>
  <pa-switch
    v-model="value"
    display
    title="开关"
    title-width="80px"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref(true);
</script>
