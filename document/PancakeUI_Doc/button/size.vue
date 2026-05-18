<template>
  <pa-row>
    <pa-col v-for="item in sizes" :key="item">
      <pa-button :size="item">{{ item }}</pa-button>
    </pa-col>
  </pa-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const sizes = ref(["small", "medium", "large"] as const);
</script>

<style></style>
