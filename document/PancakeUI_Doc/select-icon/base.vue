<template>
  <pa-select-icon v-model="iconName" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const iconName = ref("finger_press_line");
</script>
