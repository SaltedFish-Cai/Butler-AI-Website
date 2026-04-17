<template>
  <sa-button is="go" @click="visible1 = true">offsetX:300</sa-button>
  <sa-button is="go" @click="visible2 = true">offsetY:300</sa-button>
  <sa-button is="go" @click="visible3 = true">offsetX:20%</sa-button>
  <sa-button is="go" @click="visible4 = true">offsetY:20%</sa-button>

  <sa-dialog v-model="visible1" title="offsetX设置" offsetX="300"> offsetX:300 </sa-dialog>
  <sa-dialog v-model="visible2" title="offsetY设置" offsetY="300"> offsetY:300 </sa-dialog>
  <sa-dialog v-model="visible3" title="offsetX设置" offsetX="20%"> offsetX:20% </sa-dialog>
  <sa-dialog v-model="visible4" title="offsetY设置" offsetY="20%"> offsetY:20% </sa-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);
</script>

<style></style>
