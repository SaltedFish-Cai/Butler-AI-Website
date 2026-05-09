<template>
  <pa-row>
    <pa-col v-for="item in isMap" :key="item">
      <pa-button :is="item">{{ item }}</pa-button>
    </pa-col>
  </pa-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const isMap = ref([
  "search",
  "view",
  "add",
  "edit",
  "check",
  "save",
  "submit",
  "upload",
  "download",
  "remove",
  "trash",
  "refresh",
  "go",
  "file",
  "time",
  "switch",
  "sync",
  "import",
  "export",
  "ok",
  "cancel",
  "more",
  "delete",
  "default"
]);
</script>

<style></style>
