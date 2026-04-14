<template>
  <m-button-v2 iconName="star_arc_line" :confirmConfig="confirmConfig">快捷使用Confirm</m-button-v2>
  <m-button-v2 is="submit" @submit-click="confirmClick">快捷使用Submit</m-button-v2>
  <m-button-v2 is="trash" @delete-click="confirmClick">快捷使用Delete</m-button-v2>
  <m-button-v2 is="ok" @confirm-click="confirmClick">快捷使用Confirm</m-button-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { M_Message } from "@/package/components/feedback";

const confirmConfig = ref({
  title: "自定义弹窗",
  message: "自定义弹窗是否继续",
  onConfirm: () => {
    M_Message.success("确认");
  },
  onClose: () => {
    M_Message.warning("取消");
  }
});

function confirmClick() {
  M_Message.success("确认");
}
</script>

<style></style>
