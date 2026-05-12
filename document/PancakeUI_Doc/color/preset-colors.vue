<template>
  <pa-color v-model="value" :preset-colors="presetColors"></pa-color>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const value = ref("#ff0000");
const presetColors = ref(["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]);
</script>

<style lang="scss" scoped></style>
