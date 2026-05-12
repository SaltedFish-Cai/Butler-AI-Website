<template>
  <pa-color v-model="value" :useInput="false"></pa-color>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const value = ref("#ff0000");
</script>

<style lang="scss" scoped></style>
