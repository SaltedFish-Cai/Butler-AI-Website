<template>
  <pa-color v-model="value" :preset-colors="presetColors"> </pa-color>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const value = ref("#b05a26");
const presetColors = ref(["#ff0000", "#ff8000", "#ffff00", "#00ffc4", "#00ff18", "#00e3ff", "#0084ff"]);
</script>

<style lang="scss" scoped></style>
