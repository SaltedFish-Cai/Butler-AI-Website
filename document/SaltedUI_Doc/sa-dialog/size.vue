<template>
  <sa-button is="go" @click="visible1 = true">显示弹窗 max</sa-button>
  <sa-button is="go" @click="visible2 = true">显示弹窗 s</sa-button>
  <sa-button is="go" @click="visible3 = true">显示弹窗 m</sa-button>
  <sa-button is="go" @click="visible4 = true">显示弹窗 l</sa-button>
  <sa-button is="go" @click="visible5 = true">自定义宽度</sa-button>

  <sa-dialog v-model="visible1" height="default" title="Size：max" size="max"> 页面宽度95% /高度95% </sa-dialog>
  <sa-dialog v-model="visible2" height="default" title="Size：s" size="s"> 页面宽度30%/高度70% </sa-dialog>
  <sa-dialog v-model="visible3" height="default" title="Size：m" size="m"> 页面宽度50%/高度70% </sa-dialog>
  <sa-dialog v-model="visible4" height="default" title="Size：l" size="l"> 页面宽度70%/高度70% </sa-dialog>
  <sa-dialog v-model="visible5" height="200" title="自定义宽度" width="200"> 自定义宽高 </sa-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);
const visible5 = ref(false);
</script>

<style></style>
