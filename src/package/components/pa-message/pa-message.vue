<template>
  <transition name="mo-animation-fadeUp" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :id="id"
      :class="['pa-message', type || '', customClass]"
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
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
/**
 * 模块导入
 * @description 导入消息配置类型
 */
import type { MessageOptions } from "./types.d.ts";
/**
 * 模块导入
 * @description 导入图标组件
 */
import PaIcon from "../pa-icon/pa-icon.vue";

const language = computed(() => (typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN");

const props = defineProps<{
  id: string;
  options: MessageOptions;
}>();

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

const visible = ref(false);
const timer = ref<number | null>(null);
const verticalOffset = ref(offset);

const styles = computed(() => ({
  zIndex,
  top: `${verticalOffset.value}px`
}));

const escapeMap = computed(() => (typeof window !== "undefined" && window.PancakeGlobalConfig.escapeMap) || []);

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

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === "Escape" && escapeMap.value[escapeMap.value.length - 1] === props.id) {
    handleClose();
  }
}

onMounted(() => {
  setTimeout(() => {
    visible.value = true;
  }, 10);
  if (!window.PancakeGlobalConfig.escapeMap) window.PancakeGlobalConfig.escapeMap = [];
  if (closeOnPressEscape) {
    document.addEventListener("keydown", handleKeyDown);
    window.PancakeGlobalConfig.escapeMap.push(props.id);
  }
});

onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  if (closeOnPressEscape) {
    document.removeEventListener("keydown", handleKeyDown);
    const map = window.PancakeGlobalConfig?.escapeMap;
    if (map) {
      const idx = map.indexOf(props.id);
      if (idx !== -1) map.splice(idx, 1);
    }
  }
});

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
