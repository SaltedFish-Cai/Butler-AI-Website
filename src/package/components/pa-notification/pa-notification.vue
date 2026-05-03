<template>
  <transition name="mo-animation-fade" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :id="id"
      :class="['pa-notification', type ? `pa-notification--${type}` : '', customClass]"
      :style="styles"
      role="alert"
      @click="handleClick"
    >
      <div class="pa-notification_header mb-size">
        <div class="flex-center-start">
          <pa-icon class="pa-notification__icon mr-size" name="warning_line"></pa-icon>
          <div class="pa-notification__title">{{ typeof title === "string" ? title : title[language] }}</div>
        </div>
        <pa-icon class="pa-notification__closeBtn" @click="handleClose" name="close_line"></pa-icon>
      </div>
      <div
        v-if="dangerouslyUseHTMLString"
        class="pa-notification__content"
        v-html="dangerouslyUseHTMLString ? message : ''"
      ></div>
      <div v-else class="pa-notification__content">{{ typeof message === "string" ? message : message[language] }}</div>
      <div v-if="icon" class="pa-notification__icon" v-html="icon"></div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
/**
 * 模块导入
 * @description 导入通知配置类型
 */
import type { NotificationOptions } from "./types.d.ts";
/**
 * 模块导入
 * @description 导入图标组件
 */
import PaIcon from "../pa-icon/pa-icon.vue";
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
  options: NotificationOptions;
}>();
/**
 * 语言包
 * @description 当前语言的消息文本
 */
const languagePackage =
  languageMap[(typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN"]["message"];
/**
 * 当前语言
 * @description 获取全局配置的语言设置
 */
const language = (typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN";
/**
 * 解构选项
 * @description 从 props.options 中解构配置项
 */
const {
  title = languagePackage["notificationTitle"],
  message,
  type,
  duration = 3000,
  customClass = "",
  offset = 0,
  position = "top-right",
  dangerouslyUseHTMLString = false,
  onClick,
  onClose,
  icon,
  zIndex = 2050
} = props.options;
/**
 * 可见状态
 * @description 控制通知的显示与隐藏
 */
const visible = ref(false);
/**
 * 定时器
 * @description 自动关闭的定时器引用
 */
const timer = ref<number | null>(null);
/**
 * 垂直偏移
 * @description 通知距离边缘的偏移量
 */
const verticalOffset = ref(offset);
/**
 * 计算样式
 * @description 计算通知的样式对象
 */
const styles = computed(() => {
  const style = {
    zIndex,
    top: `${verticalOffset.value}px`,
    left: "auto",
    right: "auto",
    bottom: "auto"
  };
  if (position.includes("left")) {
    style.left = "20px";
    style.right = "auto";
  } else {
    style.right = "20px";
    style.left = "auto";
  }
  if (position.includes("bottom")) {
    style.top = "auto";
    style.bottom = `${verticalOffset.value}px`;
  }
  return style;
});
/**
 * 进入后处理
 * @description 动画进入后启动自动关闭定时器
 */
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
 * 离开后处理
 * @description 动画离开后触发关闭事件
 */
const handleAfterLeave = () => {
  const event = new CustomEvent("notification-closed", {
    detail: { id: props.id }
  });
  window.dispatchEvent(event);
};
/**
 * 点击处理
 * @description 点击通知时触发回调
 */
const handleClick = () => {
  if (onClick) {
    onClick();
  }
};
/**
 * 关闭处理
 * @description 关闭通知并触发回调
 */
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
 * 组件挂载
 * @description 初始化通知显示
 */
onMounted(() => {
  setTimeout(() => {
    visible.value = true;
  }, 10);
});
/**
 * 组件卸载
 * @description 清理定时器
 */
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
});
/**
 * 暴露方法
 * @description 暴露给父组件的方法
 */
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
