<template>
  <div class="mb-size-v2">
    <sa-color v-model="value" :preset-colors="presetColors"> </sa-color>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const value = ref("#5940A3");
const presetColors = ref([
  "#ff0000",
  "#ff8000",
  "#ffff00",
  "#00ffc4",
  "#00ff18",
  "#00e3ff",
  "#0084ff",
  "#0025ff",
  "#4700ff",
  "#f100ff",
  "#c9c9c9"
]);
</script>

<style lang="scss" scoped></style>
