<template>
  <el-row>
    <sa-button iconName="star_arc_line" @click="debouncedClick">左侧</sa-button>
    <sa-button iconName="star_arc_line" iconPosition="right" @click="debouncedClick">右侧</sa-button>
  </el-row>
</template>

<script lang="ts" setup>
import { M_Message } from "@/package/components/feedback";

function debouncedClick() {
  M_Message.success("点击触发");
}
</script>

<style></style>
