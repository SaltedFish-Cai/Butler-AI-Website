<template>
  <pa-button font="star_arc_line" @click="debouncedClick1">快捷弹窗1</pa-button>

  <pa-button font="star_arc_line" @click="debouncedClick2">快捷弹窗2</pa-button>

  <pa-button font="star_arc_line" @click="debouncedClick3">自定义弹窗</pa-button>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入消息框和消息提示组件
 */
import { M_MessageBox, M_Message } from "PancakeUI";
/**
 * 快捷确认弹窗
 * @description 显示快捷确认消息框
 */
function debouncedClick1() {
  M_MessageBox.confirm("是否继续", () => {
    M_Message.success("确认");
  });
}
/**
 * 删除确认弹窗
 * @description 显示删除确认消息框
 */
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
/**
 * 自定义弹窗
 * @description 显示自定义配置的消息框
 */
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
