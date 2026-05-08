<template>
  <pa-pagination v-model:current-page="pageNum" :page-size="10" :total="100" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const pageNum = ref(1);
</script>

<style></style>
