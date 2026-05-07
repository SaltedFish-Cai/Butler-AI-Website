<template>
  <pa-button font="star_arc_line" @click="debouncedClick">快捷弹窗</pa-button>
</template>

<script lang="ts" setup>
import { M_Message } from "PancakeUI";

function debouncedClick() {
  M_Message.success("是否继续");
}
</script>

<style></style>
