<template>
  <transition name="mo-animation-fadeIn" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div v-if="visible" class="pa-message-box__overlay" :style="overlayStyles">
      <div class="pa-message-box__overlay_mo" :style="overlayStyles" @click="handleClose"></div>
      <transition name="mo-animation-fadeIn">
        <div
          v-show="visible"
          :id="id"
          :class="['pa-message-box', type ? `${type}` : '', customClass]"
          :style="boxStyles"
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
/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
/**
 * 模块导入
 * @description 导入消息框配置类型
 */
import type { MessageBoxOptions } from "./types.d.ts";
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
 * @description 导入语言包
 */
import languageMap from "../language.json";
/**
 * 组件属性
 * @description 组件的 props 定义
 */
const props = defineProps<{
  id: string;
  options: MessageBoxOptions;
}>();
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
const languageKey = getLanguageKey();
/**
 * 语言包
 * @description 当前语言的消息文本
 */
const languagePackage = languageMap[languageKey]?.message || languageMap["zh-CN"]?.message;
/**
 * 当前语言
 * @description 获取全局配置的语言设置
 */
const language = languageKey;
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
  confirmButtonText = languagePackage?.confirmButtonText || "确定",
  cancelButtonText = isType === "confirm" ? languagePackage?.cancelButtonText : languagePackage?.confirmButtonText || "取消",
  cancelButtonIcon = "close_circle_line",
  confirmButtonIcon = "check_circle_line",
  zIndex = 2050,
  closeOnPressEscape = true
} = props.options;
/**
 * 可见状态
 * @description 控制消息框的显示与隐藏
 */
const visible = ref(false);
/**
 * 定时器
 * @description 自动关闭的定时器引用
 */
const timer = ref<number | null>(null);
/**
 * overlay 样式
 * @description 计算遮罩层的样式对象
 */
const overlayStyles = computed(() => ({ zIndex }));
/**
 * 消息框样式
 * @description 计算消息框的样式对象
 */
const boxStyles = computed(() => ({ zIndex }));
/**
 * ESC 键映射表
 * @description 获取全局 ESC 键映射表
 */
const escapeMap = typeof window !== "undefined" ? window.PancakeGlobalConfig?.escapeMap || [] : [];
/**
 * 进入后处理
 * @returns void
 * @description 动画进入后的回调
 */
const handleAfterEnter = (): void => {
  // 动画完成后的处理
};
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
const handleClick = (): void => {
  onConfirm?.();
  visible.value = false;
  clearTimeout(timer.value!);
};
/**
 * 关闭处理
 * @returns void
 * @description 关闭消息框并触发回调
 */
const handleClose = (): void => {
  onClose?.();
  visible.value = false;
  clearTimeout(timer.value!);
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
  closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
  if (closeOnPressEscape) {
    window.PancakeGlobalConfig.escapeMap.push(props.id);
  }
});
/**
 * 组件卸载
 * @description 清理定时器和事件监听
 */
onBeforeUnmount(() => {
  clearTimeout(timer.value!);
  closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});
/**
 * 暴露方法
 * @description 暴露给父组件的方法
 */
defineExpose({
  close: handleClose
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
