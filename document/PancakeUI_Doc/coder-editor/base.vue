<template>
  <pa-coder-editor v-model="code" language="javascript" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const code = ref("console.log('Hello World');");
</script>
