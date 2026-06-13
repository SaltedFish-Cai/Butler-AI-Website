<template>
  <pa-slider v-model="value" range :min="0" :max="100" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref([30, 70]);
</script>
