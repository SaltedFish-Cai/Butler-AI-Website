<template>
  <el-row>
    <sa-button iconName="star_arc_line" :debounced="false" @click="debouncedClick">非防抖按钮</sa-button>
    <sa-button iconName="star_arc_line" @click="debouncedClick">防抖按钮</sa-button>
  </el-row>
</template>

<script lang="ts" setup>
import { M_Message } from "@/package/components/feedback";

function debouncedClick() {
  M_Message.success("点击触发");
}
</script>

<style></style>
