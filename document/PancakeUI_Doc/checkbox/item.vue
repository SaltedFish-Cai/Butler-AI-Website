<template>
  <div class="flex-center-start">
    <pa-checkbox-item v-model="value2" label="选项1" value="1"></pa-checkbox-item>
    <pa-checkbox-item v-model="value2" label="选项1" value="1" :isChecked="false"></pa-checkbox-item>
    <pa-checkbox-item v-model="value2" label="选项1" value="1" :isIndeterminate="true"></pa-checkbox-item>
    <pa-checkbox-item v-model="value2" label="选项2" value="2" disabled :isChecked="true"></pa-checkbox-item>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value2 = ref(1);
</script>

<style></style>
