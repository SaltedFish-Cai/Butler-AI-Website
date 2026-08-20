<template>
  <pa-overlay v-if="visible" :model-value="visible" @click-overlay="handleClose">
    <div :id="renderId" :class="['pa-message-box', type ? `${type}` : '', customClass]" :style="overlayStyles" role="alert">
      <div class="pa-message-box_header pa-mb-size">
        <div class="flex-center-start">
          <pa-icon class="pa-message-box__icon pa-mr-size" name="warning_line" />
          <div class="pa-message-box__title">
            {{ typeof title === "string" ? title : title?.[language] || languagePackage["notificationTitle"] }}
          </div>
        </div>
        <pa-icon class="pa-message-box__closeBtn" @click="handleClose" name="close_line" />
      </div>
      <slot name="content">
        <div v-if="dangerouslyUseHTMLString" class="pa-message-box__content" v-html="dangerouslyUseHTMLString ? message : ''" />
        <div v-else class="pa-message-box__content">{{ typeof message === "string" ? message : message?.[language] }}</div>
      </slot>
      <div class="pa-message-box__footer">
        <pa-button
          v-if="showCancelButton"
          is="cancel"
          :iconName="cancelButtonIcon"
          :type="isType === 'confirm' ? 'default' : 'primary'"
          @click="handleClose"
        >
          {{ cancelButtonText }}
        </pa-button>
        <pa-button
          :iconName="confirmButtonIcon"
          v-if="isType === 'confirm'"
          :type="type"
          font="check_circle_line"
          is="submit"
          @click="handleClick"
        >
          {{ confirmButtonText }}
        </pa-button>
      </div>
    </div>
  </pa-overlay>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import useRenderId from "../tools/render-id";
/**
 * 模块导入
 * @description 导入消息框配置类型
 */
import type { MessageBoxOptions } from "./types";
/**
 * 模块导入
 * @description 导入图标组件
 */
import PaIcon from "../pa-icon/pa-icon.vue";
/**
 * 模块导入
 * @description 导入按钮组件
 */
import PaButton from "../pa-button/pa-button.vue";
/**
 * 模块导入
 * @description 导入遮罩层组件
 */
import PaOverlay from "../pa-overlay/pa-overlay.vue";
/**
 * 模块导入
 * @description 导入语言包
 */
import languageMap from "../language.json";
/**
 * 组件属性
 * @description 组件的 props 定义
 */
const props = defineProps<{
  id: string;
  renderId?: string;
  options: MessageBoxOptions;
}>();
const renderId = ref(props.renderId || (props.id ? props.id : "pa-message-box_" + useRenderId()));

/**
 * 获取语言键
 * @returns 语言键值
 * @description 从全局配置获取当前语言键
 */
function getLanguageKey(): string {
  if (typeof window === "undefined" || !window.PancakeGlobalConfig?.language) {
    return "zh-CN";
  }
  const lang = window.PancakeGlobalConfig.language;
  return typeof lang === "string" ? lang : "zh-CN";
}
/**
 * 语言键
 * @description 当前语言键值
 */
const language = getLanguageKey();
/**
 * 语言包
 * @description 当前语言的消息文本
 */
const languagePackage = languageMap[language]?.message || languageMap["zh-CN"]?.message;
/**
 * 解构选项
 * @description 从 props.options 中解构配置项
 */
const {
  title,
  message,
  type,
  isType,
  customClass = "",
  dangerouslyUseHTMLString = false,
  onConfirm,
  onClose,
  confirmButtonIcon = "check_circle_line",
  confirmButtonText = languagePackage?.confirmButtonText || "确定",
  showCancelButton = true,
  cancelButtonIcon = "close_circle_line",
  cancelButtonText = isType === "confirm" ? languagePackage?.cancelButtonText : languagePackage?.confirmButtonText || "取消",
  closeOnPressEscape = true
} = props.options;
/**
 * 全局层级获取函数
 * @description 从父组件注入的全局层级管理函数
 */
const getGlobalZIndex = window.getGlobalZIndex;
/**
 * 遮罩层层级
 * @description 当前遮罩层的 z-index 值
 */
const zIndex = ref(getGlobalZIndex());
/**
 * 可见状态
 * @description 控制消息框的显示与隐藏
 */
const visible = ref(false);
/**
 * overlay 样式
 * @description 计算遮罩层和消息框的 z-index 样式
 */
const overlayStyles = computed(() => ({ zIndex: zIndex.value }));
/**
 * ESC 键映射表
 * @description 获取全局 ESC 键映射表的引用
 */
const escapeMap = typeof window !== "undefined" ? window.PancakeGlobalConfig?.escapeMap || [] : [];
/**
 * 离开后处理
 * @returns void
 * @description 动画离开后触发关闭事件
 */
const handleAfterLeave = (): void => {
  const event = new CustomEvent("notification-closed", {
    detail: { id: props.id }
  });
  window.dispatchEvent(event);
};
/**
 * 点击确认处理
 * @returns void
 * @description 点击确认按钮时触发回调并关闭
 */
const handleClick = async (): Promise<void> => {
  const back = await onConfirm?.();
  console.log(back);
  if (!back) {
    visible.value = false;
    handleAfterLeave();
  }
};
/**
 * 关闭处理
 * @returns void
 * @description 关闭消息框并触发清理
 */
const handleClose = (): void => {
  onClose?.();
  visible.value = false;
  handleAfterLeave();
};
/**
 * ESC键处理
 * @param e - 键盘事件
 * @returns void
 * @description 监听 ESC 键关闭消息框
 */
function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === "Escape" && escapeMap[escapeMap.length - 1] === props.id) {
    handleClose();
  }
  if (e.key === "Enter" && isType === "confirm") {
    handleClick();
  }
}
/**
 * 组件挂载
 * @description 初始化消息框显示和事件监听
 */
onMounted(() => {
  setTimeout(() => {
    visible.value = true;
  }, 10);
  if (!window.PancakeGlobalConfig.escapeMap) window.PancakeGlobalConfig.escapeMap = [];
  document.addEventListener("keydown", handleKeyDown);
  if (closeOnPressEscape) {
    window.PancakeGlobalConfig.escapeMap.push(props.id);
  }
});
/**
 * 组件卸载
 * @description 清理事件监听（无条件移除，避免 closeOnPressEscape 中途变化导致泄漏）
 */
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeyDown);
  const map = window.PancakeGlobalConfig?.escapeMap;
  if (map) {
    const idx = map.indexOf(props.id);
    if (idx !== -1) map.splice(idx, 1);
  }
});
/**
 * 暴露方法
 * @description 暴露给父组件的方法
 */
defineExpose({
  open: () => {
    visible.value = true;
  },
  close: handleClose
});
</script>

<style lang="scss">
@use "../styles/default/pa-message-box.scss";
</style>
