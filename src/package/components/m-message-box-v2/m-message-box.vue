<template>
  <transition name="mo-animation-fadeIn" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div v-if="visible" class="m-message-box-v2__overlay" :style="styles">
      <div class="m-message-box-v2__overlay_mo" :style="styles" @click="handleClose"></div>
      <transition name="mo-animation-fadeIn">
        <div
          v-show="visible"
          :id="id"
          :class="['m-message-box-v2', type ? `m-message-box-v2--${type}` : '', customClass]"
          :style="styles"
          role="alert"
        >
          <div class="m-message-box-v2_header mb-size">
            <div class="flex-center-start">
              <m-icon-v2 class="m-message-box-v2__icon mr-size-v2" name="warning_line"></m-icon-v2>
              <div class="m-message-box-v2__title">
                {{ typeof title === "string" ? title : title?.[language] || languagePackage["notificationTitle"] }}
              </div>
            </div>
            <m-icon-v2 class="m-message-box-v2__closeBtn" @click="handleClose" name="close_line"></m-icon-v2>
          </div>
          <div
            v-if="dangerouslyUseHTMLString"
            class="m-message-box-v2__content"
            v-html="dangerouslyUseHTMLString ? message : ''"
          ></div>
          <div v-else class="m-message-box-v2__content">{{ typeof message === "string" ? message : message?.[language] }}</div>

          <div class="m-message-box-v2__footer">
            <m-button-v2 is="cancel" :type="isType === 'confirm' ? 'default' : 'primary'" @click="handleClose">
              {{ cancelButtonText }}
            </m-button-v2>
            <m-button-v2 v-if="isType === 'confirm'" :type="type" font="check_circle_line" is="submit" @click="handleClick">
              {{ confirmButtonText }}
            </m-button-v2>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { MessageBoxOptions } from "./type";
import MIconV2 from "../m-icon-v2/m-icon-v2.vue";
import MButtonV2 from "../m-button-v2/m-button-v2.vue";
import languageMap from "../language.json";

// Props
const props = defineProps<{
  id: string;
  options: MessageBoxOptions;
}>();

const languagePackage = languageMap[window.ManagerGlobalConfig?.language || "zh-CN"]["message"];
const language = window.ManagerGlobalConfig?.language || "zh-CN";

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
  zIndex = 2050
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
};

const handleClose = () => {
  onClose?.();
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
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
  close: handleClose
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
