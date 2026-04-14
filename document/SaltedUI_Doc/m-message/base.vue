<template>
  <m-button-v2 font="star_arc_line" @click="debouncedClick">快捷弹窗</m-button-v2>
</template>

<script lang="ts" setup>
import { M_Message } from "@/package/components/feedback";

function debouncedClick() {
  M_Message.success("是否继续");
}
</script>

<style></style>
