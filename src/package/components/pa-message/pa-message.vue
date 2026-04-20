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
          <div
            v-if="dangerouslyUseHTMLString"
            class="pa-message__content"
            v-html="dangerouslyUseHTMLString ? message : ''"
          ></div>
          <div v-else class="pa-message__content">{{ typeof message === "string" ? message : message?.[language] }}</div>
        </div>
        <pa-icon class="pa-message__closeBtn" @click="handleClose" name="close_line"></pa-icon>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { MessageOptions } from "./type";
import PaIcon from "../pa-icon/pa-icon.vue";

const language = typeof window !== "undefined" && typeof window !== "undefined" && window.PancakeGlobalConfig?.language || "zh-CN" || "zh-CN";

// Props
const props = defineProps<{
  id: string;
  options: MessageOptions;
}>();

// 解构选项
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

// 状态
const visible = ref(false);
const timer = ref<number | null>(null);
const verticalOffset = ref(offset);

const styles = computed(() => {
  const style = {
    zIndex,
    top: `${verticalOffset.value}px`
  };

  return style;
});

// 方法
const handleAfterEnter = () => {
  if (duration > 0) {
    timer.value = window.setTimeout(() => {
      if (visible.value) {
        handleClose();
      }
    }, duration);
  }
};

const handleAfterLeave = () => {
  const event = new CustomEvent("Message-closed", {
    detail: { id: props.id }
  });
  window.dispatchEvent(event);
};

const handleClick = () => {
  if (onClick) {
    onClick();
  }
  if (closeOnPressEscape) {
  }
};

const handleClose = () => {
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
  }
  if (onClose) {
    onClose();
  }
  if (closeOnPressEscape) {
  }
};

// #添加ESC键监听
function handleKeyDown(e) {
  const escapeMap = typeof window !== "undefined" && window.PancakeGlobalConfig.escapeMap || [];
  if (e.key === "Escape" && escapeMap[escapeMap.length - 1] === props.id) {
    handleClose();
  }
}

// 生命周期
onMounted(() => {
  // 使用setTimeout确保DOM已更新
  setTimeout(() => {
    visible.value = true;
  }, 10);
  closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
  if (closeOnPressEscape) {
    typeof window !== "undefined" && window.PancakeGlobalConfig.escapeMap.push(props.id);
  }
});

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});

// 暴露方法
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
