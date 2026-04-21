<template>
  <div class="mb-size">
    <pa-color v-model="value" :preset-colors="presetColors"> </pa-color>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const value = ref("#64605b");
const presetColors = ref(["#ff0000", "#ff8000", "#ffff00", "#00ffc4", "#00ff18", "#00e3ff", "#0084ff"]);
</script>

<style lang="scss" scoped></style>
