<template>
  <transition name="mo-animation-fadeIn" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div v-if="visible" class="pa-message-box__overlay" :style="styles">
      <div class="pa-message-box__overlay_mo" :style="styles" @click="handleClose"></div>
      <transition name="mo-animation-fadeIn">
        <div
          v-show="visible"
          :id="id"
          :class="['pa-message-box', type ? `pa-message-box--${type}` : '', customClass]"
          :style="styles"
          role="alert"
        >
          <div class="pa-message-box_header mb-size">
            <div class="flex-center-start">
              <pa-icon class="pa-message-box__icon mr-size" name="warning_line"></pa-icon>
              <div class="pa-message-box__title">
                {{ typeof title === "string" ? title : title?.[language] || languagePackage["notificationTitle"] }}
              </div>
            </div>
            <pa-icon class="pa-message-box__closeBtn" @click="handleClose" name="close_line"></pa-icon>
          </div>
          <div
            v-if="dangerouslyUseHTMLString"
            class="pa-message-box__content"
            v-html="dangerouslyUseHTMLString ? message : ''"
          ></div>
          <div v-else class="pa-message-box__content">{{ typeof message === "string" ? message : message?.[language] }}</div>

          <div class="pa-message-box__footer">
            <pa-button
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
      </transition>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { MessageBoxOptions } from "./type";
import PaIcon from "../pa-icon/pa-icon.vue";
import PaButton from "../pa-button/pa-button.vue";
import languageMap from "../language.json";

// Props
const props = defineProps<{
  id: string;
  options: MessageBoxOptions;
}>();

const languagePackage = languageMap[typeof window !== "undefined" && typeof window !== "undefined" && window.PancakeGlobalConfig?.language || "zh-CN" || "zh-CN"]["message"];
const language = typeof window !== "undefined" && typeof window !== "undefined" && window.PancakeGlobalConfig?.language || "zh-CN" || "zh-CN";

// 解构选项
const {
  title,
  message,
  type,
  isType,
  customClass = "",
  dangerouslyUseHTMLString = false,
  onConfirm,
  onClose,
  confirmButtonText = languagePackage["confirmButtonText"],
  cancelButtonText = isType === "confirm" ? languagePackage["cancelButtonText"] : languagePackage["confirmButtonText"],
  cancelButtonIcon = "close_circle_line",
  confirmButtonIcon = "check_circle_line",
  zIndex = 2050,
  closeOnPressEscape = true
} = props.options;

// 状态
const visible = ref(false);
const timer = ref<number | null>(null);

const styles = computed(() => {
  const style = {
    zIndex
  };

  return style;
});

// 方法
const handleAfterEnter = () => {
  //
};

const handleAfterLeave = () => {
  const event = new CustomEvent("notification-closed", {
    detail: { id: props.id }
  });
  window.dispatchEvent(event);
};

const handleClick = () => {
  onConfirm?.();
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
  }
  if (closeOnPressEscape) {
  }
};

const handleClose = () => {
  onClose?.();
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
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
  close: handleClose
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
