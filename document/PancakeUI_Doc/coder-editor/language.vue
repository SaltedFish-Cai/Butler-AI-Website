<template>
  <pa-coder-editor v-model="code" language="html" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const code = ref('<div class="example">Hello World</div>');
</script>
