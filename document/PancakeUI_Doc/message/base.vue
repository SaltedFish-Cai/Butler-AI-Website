<template>
  <pa-button @click="clickSuccess" type="success">快捷 Success</pa-button>
  <pa-button @click="clickDanger" type="danger">快捷 Danger</pa-button>
  <pa-button @click="clickInfo" type="info">快捷 Info</pa-button>
  <pa-button @click="clickWarning" type="warning">快捷 Warning</pa-button>
</template>

<script lang="ts" setup>
import { M_Message } from "PancakeUI";

function clickSuccess() {
  M_Message.success("是否继续");
}
function clickDanger() {
  M_Message.danger("是否继续");
}
function clickInfo() {
  M_Message.info("是否继续");
}
function clickWarning() {
  M_Message.warning("是否继续");
}
</script>

<style></style>
