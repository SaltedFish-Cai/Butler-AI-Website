<template>
  <pa-slider v-model="value" :min="0" :max="100" :marks="marks" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref(50);
const marks = {
  0: "0°C",
  25: "25°C",
  50: "50°C",
  75: "75°C",
  100: "100°C"
};
</script>
