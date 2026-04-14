<template>
  <transition name="mo-animation-fadeUp" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :id="id"
      :class="['m-message-v2', type ? `m-message-v2--${type}` : '', customClass]"
      :style="styles"
      role="alert"
      @click="handleClick"
    >
      <div class="m-message-v2_header">
        <div class="flex-center-start">
          <m-icon-v2 class="m-message-v2__icon mr-size-v2" name="warning_line"></m-icon-v2>
          <div
            v-if="dangerouslyUseHTMLString"
            class="m-message-v2__content"
            v-html="dangerouslyUseHTMLString ? message : ''"
          ></div>
          <div v-else class="m-message-v2__content">{{ typeof message === "string" ? message : message?.[language] }}</div>
        </div>
        <m-icon-v2 class="m-message-v2__closeBtn" @click="handleClose" name="close_line"></m-icon-v2>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { MessageOptions } from "./type";
import MIconV2 from "../m-icon-v2/m-icon-v2.vue";

const language = window.ManagerGlobalConfig?.language || "zh-CN";

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
  zIndex = 2050
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
};

const handleClose = () => {
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
  }
  if (onClose) {
    onClose();
  }
};

// 生命周期
onMounted(() => {
  // 使用setTimeout确保DOM已更新
  setTimeout(() => {
    visible.value = true;
  }, 10);
});

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
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
