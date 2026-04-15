<template>
  <sa-button font="star_arc_line" @click="debouncedClick1">快捷弹窗1</sa-button>

  <sa-button font="star_arc_line" @click="debouncedClick2">自定义弹窗2</sa-button>
</template>

<script lang="ts" setup>
import { M_Notification, M_Message } from "@/package/components/feedback";

function debouncedClick1() {
  M_Notification.success("操作成功");
}

function debouncedClick2() {
  M_Notification({
    title: "提示",
    message: "这是一条带有标题的通知",
    duration: 5000,
    onClick: () => {
      M_Message.success("通知点击");
    },
    onClose: () => {
      M_Message.danger("通知关闭");
    }
  });
}
</script>

<style></style>
