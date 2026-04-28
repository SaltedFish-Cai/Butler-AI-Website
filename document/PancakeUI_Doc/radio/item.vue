<template>
  <div class="flex-center-start">
    <pa-radio-item v-model="value2" label="选项1" value="1"></pa-radio-item>
    <pa-radio-item v-model="value2" label="选项2" value="2"></pa-radio-item>
    <pa-radio-item v-model="value2" label="选项1" value="1" :isChecked="false"></pa-radio-item>
    <pa-radio-item v-model="value2" label="选项2" value="2" disabled></pa-radio-item>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value2 = ref(3);
</script>

<style></style>
