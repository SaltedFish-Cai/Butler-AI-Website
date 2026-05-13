<template>
  <transition name="mo-animation-fade" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :id="id"
      :class="['pa-notification', type ? `${type}` : '', customClass]"
      :style="styles"
      role="alert"
      @click="handleClick"
    >
      <div class="pa-notification_header mb-size">
        <div class="flex-center-start">
          <pa-icon class="pa-notification__icon mr-size" name="warning_line" />
          <div class="pa-notification__title">{{ typeof title === "string" ? title : title[language] }}</div>
        </div>
        <pa-icon class="pa-notification__closeBtn" @click="handleClose" name="close_line" />
      </div>
      <div v-if="dangerouslyUseHTMLString" class="pa-notification__content" v-html="dangerouslyUseHTMLString ? message : ''" />
      <div v-else class="pa-notification__content">{{ typeof message === "string" ? message : message?.[language] || "" }}</div>
      <div v-if="icon" class="pa-notification__icon" v-html="icon" />
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
 * 当前语言
 * @description 获取全局配置的语言设置
 */
const language = computed(() => (typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN");

/**
 * 语言包
 * @description 当前语言的消息文本
 */
const languagePackage = computed(
  () => languageMap[(typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN"]["message"]
);

/**
 * 标题
 * @description 通知标题，支持多语言，默认值来自语言包
 */
const title = computed(() => props.options.title ?? languagePackage.value["notificationTitle"]);

/**
 * 消息内容
 * @description 通知消息内容，支持多语言
 */
const message = computed(() => props.options.message);

/**
 * 通知类型
 * @description 通知的类型，影响样式展示
 */
const type = computed(() => props.options.type);

/**
 * 显示时长
 * @description 自动关闭的时长，单位毫秒，设为 0 则不自动关闭
 */
const duration = computed(() => props.options.duration ?? 3000);

/**
 * 自定义类名
 * @description 自定义通知容器的类名
 */
const customClass = computed(() => props.options.customClass ?? "");

/**
 * 偏移量
 * @description 通知距离边缘的偏移量
 */
const offset = computed(() => props.options.offset ?? 0);

/**
 * 显示位置
 * @description 通知在页面中的显示位置
 */
const position = computed(() => props.options.position ?? "top-right");

/**
 * HTML 内容标记
 * @description 是否将消息内容作为 HTML 字符串解析
 */
const dangerouslyUseHTMLString = computed(() => props.options.dangerouslyUseHTMLString ?? false);

/**
 * 点击回调
 * @description 点击通知时触发的回调函数
 */
const onClick = computed(() => props.options.onClick);

/**
 * 关闭回调
 * @description 关闭通知时触发的回调函数
 */
const onClose = computed(() => props.options.onClose);

/**
 * 自定义图标
 * @description 自定义图标组件或 HTML
 */
const icon = computed(() => props.options.icon);

/**
 * 层级
 * @description 通知的 z-index 值
 */
const zIndex = computed(() => props.options.zIndex ?? 2050);

/**
 * 可见状态
 * @description 控制通知的显示与隐藏
 */
const visible = ref(false);

/**
 * 定时器
 * @description 自动关闭的定时器引用
 */
const timer = ref<ReturnType<typeof setTimeout> | null>(null);

/**
 * 垂直偏移
 * @description 通知距离边缘的偏移量
 */
const verticalOffset = ref(offset.value);

/**
 * 计算样式
 * @description 计算通知的样式对象
 */
const styles = computed(() => {
  const style: Record<string, string | number> = {
    zIndex: zIndex.value,
    top: `${verticalOffset.value}px`,
    left: "auto",
    right: "auto",
    bottom: "auto"
  };
  if (position.value.includes("left")) {
    style.left = "20px";
    style.right = "auto";
  } else {
    style.right = "20px";
    style.left = "auto";
  }
  if (position.value.includes("bottom")) {
    style.top = "auto";
    style.bottom = `${verticalOffset.value}px`;
  }
  return style;
});

/**
 * 进入后处理
 * @description 动画进入后启动自动关闭定时器
 */
function handleAfterEnter() {
  if (duration.value > 0) {
    timer.value = setTimeout(() => {
      if (visible.value) {
        handleClose();
      }
    }, duration.value);
  }
}

/**
 * 离开后处理
 * @description 动画离开后触发关闭事件
 */
function handleAfterLeave() {
  const event = new CustomEvent("notification-closed", {
    detail: { id: props.id }
  });
  window.dispatchEvent(event);
}

/**
 * 点击处理
 * @description 点击通知时触发回调
 */
function handleClick() {
  if (onClick.value) {
    onClick.value();
  }
}

/**
 * 关闭处理
 * @description 关闭通知并触发回调
 */
function handleClose() {
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  if (onClose.value) {
    onClose.value();
  }
}

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
 * 组件卸载前
 * @description 清理定时器
 */
onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
});

/**
 * 暴露方法
 * @description 暴露给父组件的方法
 */
defineExpose({
  close: handleClose,
  setOffset: (newOffset: number) => {
    verticalOffset.value = newOffset;
  }
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
