<template>
  <el-row>
    <pa-button :debounced="false" @click="debouncedClick">非防抖按钮</pa-button>
    <pa-button @click="debouncedClick">防抖按钮</pa-button>
  </el-row>
</template>

<script lang="ts" setup>
import { M_Message } from "@/package/components/feedback";

function debouncedClick() {
  M_Message.success("点击触发");
}
</script>

<style></style>
