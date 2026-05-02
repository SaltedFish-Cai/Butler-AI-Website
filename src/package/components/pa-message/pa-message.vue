<template>
  <transition name="mo-animation-fadeUp" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :id="id"
      :class="['pa-message', type ? `pa-message--${type}` : '', customClass]"
      :style="styles"
      role="alert"
      @click="handleClick"
    >
      <div class="pa-message_header">
        <div class="flex-center-start">
          <pa-icon class="pa-message__icon mr-size" name="warning_line"></pa-icon>
          <div v-if="dangerouslyUseHTMLString" class="pa-message__content" v-html="dangerouslyUseHTMLString ? message : ''"></div>
          <div v-else class="pa-message__content">{{ typeof message === "string" ? message : message?.[language] }}</div>
        </div>
        <pa-icon class="pa-message__closeBtn" @click="handleClose" name="close_line"></pa-icon>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 响应式 API
 * */
import { ref, computed, onMounted, onUnmounted } from "vue";
/**
 * **模块导入**
 * @description 导入消息配置类型
 * */
import type { MessageOptions } from "./types.d.ts";
/**
 * **模块导入**
 * @description 导入图标组件
 * */
import PaIcon from "../pa-icon/pa-icon.vue";
/**
 * **当前语言**
 * @description 获取全局配置的语言设置
 * */
const language = (typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN";
/**
 * **组件属性**
 * @description 组件的 props 定义
 * */
const props = defineProps<{
  id: string;
  options: MessageOptions;
}>();
/**
 * **解构选项**
 * @description 从 props.options 中解构配置项
 * */
const {
  message,
  type,
  duration = 3000,
  customClass = "",
  offset = 0,
  dangerouslyUseHTMLString = false,
  onClick,
  onClose,
  zIndex = 2050,
  closeOnPressEscape = true
} = props.options;
/**
 * **可见状态**
 * @description 控制消息的显示与隐藏
 * */
const visible = ref(false);
/**
 * **定时器**
 * @description 自动关闭的定时器引用
 * */
const timer = ref<number | null>(null);
/**
 * **垂直偏移**
 * @description 消息距离顶部的偏移量
 * */
const verticalOffset = ref(offset);
/**
 * **计算样式**
 * @description 计算消息的样式对象
 * */
const styles = computed(() => {
  const style = {
    zIndex,
    top: `${verticalOffset.value}px`
  };
  return style;
});
/**
 * **进入后处理**
 * @description 动画进入后启动自动关闭定时器
 * */
const handleAfterEnter = () => {
  if (duration > 0) {
    timer.value = window.setTimeout(() => {
      if (visible.value) {
        handleClose();
      }
    }, duration);
  }
};
/**
 * **离开后处理**
 * @description 动画离开后触发关闭事件
 * */
const handleAfterLeave = () => {
  const event = new CustomEvent("Message-closed", {
    detail: { id: props.id }
  });
  window.dispatchEvent(event);
};
/**
 * **点击处理**
 * @description 点击消息时触发回调
 * */
const handleClick = () => {
  if (onClick) {
    onClick();
  }
};
/**
 * **关闭处理**
 * @description 关闭消息并触发回调
 * */
const handleClose = () => {
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
  }
  if (onClose) {
    onClose();
  }
};
/**
 * **ESC键处理**
 * @param `e` `KeyboardEvent` 键盘事件
 * @description 监听 ESC 键关闭消息
 * */
function handleKeyDown(e: KeyboardEvent): void {
  const escapeMap = (typeof window !== "undefined" && window.PancakeGlobalConfig.escapeMap) || [];
  if (e.key === "Escape" && escapeMap[escapeMap.length - 1] === props.id) {
    handleClose();
  }
}
/**
 * **组件挂载**
 * @description 初始化消息显示和事件监听
 * */
onMounted(() => {
  setTimeout(() => {
    visible.value = true;
  }, 10);
  if (!window.PancakeGlobalConfig.escapeMap) window.PancakeGlobalConfig.escapeMap = [];
  closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
  if (closeOnPressEscape) {
    typeof window !== "undefined" && window.PancakeGlobalConfig.escapeMap.push(props.id);
  }
});
/**
 * **组件卸载**
 * @description 清理定时器和事件监听
 * */
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});
/**
 * **暴露方法**
 * @description 暴露给父组件的方法
 * */
defineExpose({
  close: handleClose,
  setOffset: (offset: number) => {
    verticalOffset.value = offset;
  }
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
