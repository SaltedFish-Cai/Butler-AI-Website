<template>
  <pa-coder-editor v-model="code" language="json" readonly />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const code = ref('{\n  "name": "PancakeUI",\n  "version": "1.0.0"\n}');
</script>
