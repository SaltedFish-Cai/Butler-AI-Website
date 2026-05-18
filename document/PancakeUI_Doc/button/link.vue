<template>
  <pa-row>
    <pa-col v-for="item in type" :key="item">
      <pa-button useLine :plain="false" :type="item">{{ item }}</pa-button>
    </pa-col>
    <br />
    <pa-col v-for="item in type" :key="item">
      <pa-button useLine disabled :type="item">{{ item }}</pa-button>
    </pa-col>
  </pa-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const type = ref(["primary", "success", "info", "warning", "danger"] as const);
</script>

<style></style>
