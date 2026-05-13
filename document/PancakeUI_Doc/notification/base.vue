<template>
  <pa-button @click="clickSuccess" type="success">快捷 Success</pa-button>
  <pa-button @click="clickDanger" type="danger">快捷 Danger</pa-button>
  <pa-button @click="clickInfo" type="info">快捷 Info</pa-button>
  <pa-button @click="clickWarning" type="warning">快捷 Warning</pa-button>
  <pa-button @click="clickCustomNotification" type="primary"> Custom Notification</pa-button>
</template>

<script lang="ts" setup>
import { M_Notification, M_Message } from "PancakeUI";

function clickSuccess() {
  M_Notification.success("操作成功");
}

function clickDanger() {
  M_Notification.danger("操作失败");
}
function clickInfo() {
  M_Notification.info("操作提示");
}
function clickWarning() {
  M_Notification.warning("操作警告");
}

function clickCustomNotification() {
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
