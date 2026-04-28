<template>
  <pa-button :confirmConfig="confirmConfig">快捷使用Confirm</pa-button>
  <pa-button is="submit" @submit-click="confirmClick">快捷使用Submit</pa-button>
  <pa-button is="trash" @delete-click="confirmClick">快捷使用Delete</pa-button>
  <pa-button is="ok" @confirm-click="confirmClick">快捷使用Confirm</pa-button>
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
