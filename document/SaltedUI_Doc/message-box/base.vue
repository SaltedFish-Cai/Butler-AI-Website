<template>
  <sa-button font="star_arc_line" @click="debouncedClick1">快捷弹窗1</sa-button>

  <sa-button font="star_arc_line" @click="debouncedClick2">快捷弹窗2</sa-button>

  <sa-button font="star_arc_line" @click="debouncedClick3">自定义弹窗</sa-button>
</template>

<script lang="ts" setup>
import { M_MessageBox, M_Message } from "@/package/components/feedback";

function debouncedClick1() {
  M_MessageBox.confirm("是否继续", () => {
    M_Message.success("确认");
  });
}

function debouncedClick2() {
  M_MessageBox.delete({
    onConfirm: () => {
      M_Message.success("确认");
    },
    onClose: () => {
      M_Message.warning("取消");
    }
  });
}

function debouncedClick3() {
  M_MessageBox.confirm({
    title: "自定义弹窗",
    type: "success",
    message: "自定义弹窗是否继续",
    onConfirm: () => {
      M_Message.success("确认");
    },
    onClose: () => {
      M_Message.warning("取消");
    }
  });
}
</script>

<style></style>
