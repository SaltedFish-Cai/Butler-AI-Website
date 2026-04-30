<template>
  <teleport to="body" v-if="menu.visible">
    <div class="pa-development">
      <div class="menu_hide" @click="menu.visible = false" @contextmenu.prevent="menu.visible = false"></div>
      <div class="card content-menu" :style="{ top: menu.top, left: menu.left }">
        <div class="content-menu_item" @click="copyInfo">
          <pa-icon name="link_line" />
          复制当前组件ID
        </div>
        <div class="content-menu_item" @click="copyUrl">
          <pa-icon name="link_line" />
          复制当前组件路径
        </div>
      </div>
    </div>
  </teleport>
  <slot></slot>
</template>

<script lang="ts" setup name="PaDevelopment">
/** @description Vue 核心响应式 API */
import { reactive, inject, ComputedRef, onMounted, nextTick, onUnmounted } from "vue";
/** @description 开发工具组件 Props 类型 */
import type { ComponentProps } from "./types";
/** @description 全局配置类型 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/** @description 消息反馈组件 */
import { M_Message } from "../feedback";
/** @description 组件 Props */
const props = withDefaults(defineProps<ComponentProps>(), { id: "" });
/** @description 全局配置注入 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/** @description 右键菜单状态 */
const menu = reactive({
  /** @description 是否可见 */
  visible: false,
  /** @description 顶部位置 */
  top: "-100%",
  /** @description 左侧位置 */
  left: "-100%"
});
/**
 * 复制组件 ID
 * @returns void
 * @description 将组件 ID 复制到剪贴板
 */
function copyInfo(): void {
  const copyInput = document.createElement("input");
  document.body.appendChild(copyInput);
  copyInput.setAttribute("value", `${props.id}`);
  copyInput.select();
  document.execCommand("Copy");
  M_Message.success({
    message: { "en-US": "Copied!", "zh-CN": "已复制！" }
  });
  document.body.removeChild(copyInput);
  menu.visible = false;
}
/**
 * 复制当前路径
 * @returns void
 * @description 将当前 URL 路径复制到剪贴板
 */
function copyUrl(): void {
  const copyInput = document.createElement("input");
  document.body.appendChild(copyInput);
  copyInput.setAttribute("value", `${typeof window !== "undefined" && window.location.hash.split("#")[1]?.split("?")[0]}`);
  copyInput.select();
  document.execCommand("Copy");
  M_Message.success({
    message: { "en-US": "Copied!", "zh-CN": "已复制！" }
  });
  document.body.removeChild(copyInput);
  menu.visible = false;
}
/**
 * 右键菜单事件处理
 * @param e - 鼠标事件
 * @returns void
 * @description 显示或隐藏右键菜单
 */
function onContextMenu(e: MouseEvent): void {
  e.preventDefault();
  menu.top = `${e.clientY}px`;
  menu.left = `${e.clientX}px`;
  menu.visible = !menu.visible;
}
/** @description 开发环境下组件挂载时绑定右键菜单事件 */
onMounted(() => {
  if (PancakeGlobalConfig.value.env == "development") {
    nextTick(() => {
      const element = typeof window !== "undefined" && window.document.getElementById(props.id);
      if (element) {
        element.addEventListener("contextmenu", onContextMenu);
      }
    });
  }
});
/** @description 开发环境下组件卸载时移除右键菜单事件 */
onUnmounted(() => {
  if (PancakeGlobalConfig.value.env == "development") {
    const element = typeof window !== "undefined" && window.document.getElementById(props.id);
    if (element) {
      element.removeEventListener("contextmenu", onContextMenu);
    }
  }
});
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
