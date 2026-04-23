<template>
  <pa-select-icon
    v-model="iconName"
    display
    title="图标"
    title-width="80px"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const iconName = ref("finger_press_line");
</script>
