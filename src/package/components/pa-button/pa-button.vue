<template>
  <button
    :id="id"
    @click="btnClick"
    type="button"
    :disabled="disabled"
    :class="[
      'pa-button',
      props.class,
      props.useLine ? 'use-line' : '',
      { disabled },
      `pa-button--${state.buttonConfig.type}`,
      `pa-button--${state.buttonConfig.size}`,
      props.usePlain ? 'use-plain' : ''
    ]"
    :style="{ ...props.style }"
  >
    <slot name="icon">
      <pa-icon
        v-if="iconPosition == 'left' && !loading && !state.isLoading && (useFont || state.buttonConfig.iconName)"
        :name="state.buttonConfig.iconName"
        :class="state.slotsLength || text ? 'mr-btn pa-button_icon' : ''"
      />
    </slot>
    <div class="pa-button_text">
      <template v-if="state.slotsLength || text">
        <slot>
          <template v-if="text"> {{ typeof text == "string" ? text : text[languageValue] }} </template>
        </slot>
      </template>
    </div>
    <pa-icon
      v-if="iconPosition == 'right' && useFont"
      :name="state.buttonConfig.iconName"
      class="pa-button_ml pa-button_icon"
    ></pa-icon>
  </button>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API、类型定义、工具函数等依赖
 * */
import { reactive, onBeforeMount, useSlots, nextTick, watch, inject, ComputedRef, computed, getCurrentInstance } from "vue";
import { ComponentProps, ComponentEmits } from "./types";
import inBrowser from "../tools/inBrowser";
import { M_MessageBox } from "../feedback";

import { PancakeGlobalConfigType } from "../pa-manager/type";

import _ from "lodash";
const { debounce } = _;

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象，包含 text、size、type 等
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  size: "medium",
  debounced: true,
  debouncedTime: 300,
  iconPosition: "left",
  useFont: true,
  usePlain: true,
  useStop: true
});

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件列表
 * */
const emit = defineEmits<ComponentEmits>();

/**
 * **实例对象注入**
 * @type `Instance`
 * @description 组件的实例对象，包含所有自定义属性和事件
 * */
const instance = getCurrentInstance();

/**
 * **检查是否有外部监听**
 * @description 检查是否有外部监听 onConfirmClick 事件
 * @returns `boolean` 是否有外部监听
 * */
const hasConfirmClick = computed(() => {
  const props = instance?.vnode.props || {};
  return !!(props.onConfirmClick || props["onConfirm-click"]);
});

/**
 * **检查是否有外部监听**
 * @description 检查是否有外部监听 onDeleteClick 事件
 * @returns `boolean` 是否有外部监听
 * */
const hasDeleteClick = computed(() => {
  const props = instance?.vnode.props || {};
  return !!(props.onDeleteClick || props["onDelete-click"]);
});

/**
 * **检查是否有外部监听**
 * @description 检查是否有外部监听 onSubmitClick 事件
 * @returns `boolean` 是否有外部监听
 * */
const hasSubmitClick = computed(() => {
  const props = instance?.vnode.props || {};
  return !!(props.onSubmitClick || props["onSubmit-click"]);
});

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置对象，包含语言设置等
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

/**
 * **获取当前语言值**
 * @returns `string` 返回当前语言标识，如 'zh-CN' 或 'en-US'
 * */
const languageValue = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");

/**
 * **组件状态**
 * @description 存储按钮的内部状态，包括 id、加载状态、按钮配置等
 * */
const state = reactive({
  id: new Date().getTime() + Math.random(),
  maskVisible: false,
  slotsLength: 0,
  isLoading: false,
  buttonConfig: {
    iconName: props.iconName || "finger_press_line",
    type: props.type || "default",
    plain: props.usePlain || true,
    size: props.size || "default"
  } as any
});

/**
 * **防抖锁**
 * @type `boolean`
 * @description 用于防止按钮重复点击的锁标志
 * */
let lock = false;

/**
 * **防抖函数实例**
 * @type `Function`
 * @description lodash 防抖函数实例，用于处理按钮点击防抖
 * */
const _debounce = debounce(realClick, props.debouncedTime, { trailing: true });

/**
 * **组件挂载前生命周期**
 * @description 初始化插槽信息、图标名称、类型和尺寸配置
 * */
onBeforeMount(() => {
  const slots = useSlots();
  state.slotsLength = slots.default ? 1 : 0;
  if (props.iconName) state.buttonConfig.iconName = props.iconName;
  if (props.type) state.buttonConfig.type = props.type;
  if (props.size) state.buttonConfig.size = props.size;
});

/**
 * **按钮点击事件处理**
 * @param `event` `MouseEvent` 鼠标点击事件对象
 * @returns `void`
 * @description 处理按钮点击事件，包括确认弹窗、防抖、loading 状态等
 * */
function btnClick(event: MouseEvent) {
  if (props.useStop) event.stopPropagation();

  if (hasConfirmClick.value || hasDeleteClick.value || hasSubmitClick.value) {
    let confirmConfig = {
      title: { "en-US": "Tips", "zh-CN": "温馨提示" },
      message: { "en-US": "Are you sure you want to continue?", "zh-CN": "是否继续当前任务？" },
      confirmButtonText: { "en-US": "Continue", "zh-CN": "继续" },
      type: "success" as "danger" | "success" | "warning",
      onConfirm: () => emit("confirm-click")
    };

    if (hasDeleteClick.value) {
      confirmConfig = {
        title: { "en-US": "Notice", "zh-CN": "注意" },
        message: { "en-US": "Are you sure you want to delete?", "zh-CN": "是否删除当前选项？" },
        confirmButtonText: { "en-US": "Delete", "zh-CN": "删除" },
        type: "danger" as const,
        onConfirm: () => emit("delete-click")
      };
    }

    if (hasSubmitClick.value) {
      confirmConfig = {
        title: { "en-US": "Tips", "zh-CN": "温馨提示" },
        message: { "en-US": "Are you sure you want to submit?", "zh-CN": "是否继续提交内容？" },
        confirmButtonText: { "en-US": "Submit", "zh-CN": "提交" },
        type: "warning" as const,
        onConfirm: () => emit("submit-click")
      };
    }

    M_MessageBox.confirm(confirmConfig);
    return;
  }

  if (props.disabled) return;
  if (props.debounced && props.debouncedTime) {
    if (props.confirmConfig) {
      M_MessageBox.confirm(props.confirmConfig);
      return;
    }
    _debounce(event);
  } else {
    if (props.confirmConfig) {
      M_MessageBox.confirm(props.confirmConfig);
      return;
    }
    realClick(event);
  }
}

/**
 * **实际点击处理**
 * @returns `void`
 * @description 触发 click 事件并处理 loading 状态
 * */
function realClick(event: MouseEvent) {
  if (lock) return;
  emit("click", event);
  if (props.debounced) lock = true;

  nextTick(() => {
    const EL = typeof window !== "undefined" && props.loadingBy && window.document.querySelector(props.loadingBy);
    if (EL && inBrowser) {
      state.isLoading = true;

      // 锁死保险
      const safeLock = setTimeout(() => {
        state.isLoading = false;
        observer?.disconnect && observer?.disconnect();
      }, 15 * 60 * 1000);

      const config = { childList: true };
      const callback = () => {
        const EL = typeof window !== "undefined" && props.loadingBy && window.document.querySelector(props.loadingBy);
        if (!EL) {
          clearTimeout(safeLock);
          state.isLoading = false;
          observer?.disconnect && observer?.disconnect();
          return;
        }
      };
      const observer = new window.MutationObserver(callback);
      const Body = document.body;
      if (EL) observer.observe(Body, config);
    }
    if (props.debounced) {
      setTimeout(() => {
        lock = false;
      }, 1000);
    }
  });
}

/**
 * **监听 is 属性变化**
 * @description 根据内置样式类型设置按钮的图标、类型等配置
 * */
watch(
  () => props.is,
  text => {
    const config = {
      type: props.type || "primary",
      plain: props.usePlain || true,
      iconName: props.iconName || "finger_press_line",
      size: props.size || "medium"
    };

    if (text) {
      switch (text) {
        case "search":
          config.iconName = "search_line";
          break;
        case "view":
          config.iconName = "document_query_line";
          config.type = "default";
          break;
        case "add":
          config.iconName = "add_circle_line";
          break;
        case "edit":
          config.iconName = "edit_line";
          break;
        case "check":
          config.iconName = "file_save_line";
          break;
        case "save":
          config.iconName = "save_line";
          break;
        case "submit":
          config.iconName = "send_plane_line";
          break;
        case "upload":
          config.iconName = "upload_line";
          config.type = "default";
          break;
        case "download":
          config.iconName = "download_line";
          config.type = "default";
          break;
        case "remove":
          config.iconName = "close_circle_line";
          config.type = "danger";
          break;
        case "trash":
          config.iconName = "trash_line";
          config.type = "danger";
          break;
        case "refresh":
          config.iconName = "refresh_line";
          config.type = "warning";
          break;
        case "go":
          config.iconName = "finger_press_line";
          break;
        case "file":
          config.iconName = "attachment_line";
          config.type = "default";
          break;
        case "time":
          config.iconName = "time_line";
          config.type = "default";
          break;
        case "switch":
          config.iconName = "switch_horizontal_line";
          config.type = "warning";
          break;
        case "sync":
          config.iconName = "refresh_arrows_line";
          break;
        case "import":
          config.iconName = "entrance_line";
          config.type = "default";
          break;
        case "export":
          config.iconName = "exit_line";
          config.type = "default";
          break;
        case "ok":
          config.iconName = "check_circle_line";
          config.type = "success";
          break;
        case "cancel":
          config.iconName = "close_circle_line";
          config.type = "warning";
          break;
        case "more":
          config.iconName = "version_line";
          config.type = "warning";
          break;
        case "delete":
          config.iconName = "close_circle_line";
          config.type = "danger";
          break;
        default:
          break;
      }
    }

    if (props.size) config.size = props.size;

    state.buttonConfig = config;
  },
  { immediate: true }
);

/**
 * **监听 iconName 属性变化**
 * @description 同步更新按钮图标名称
 * */
watch(
  () => props.iconName,
  text => {
    if (text) state.buttonConfig.iconName = text;
  },
  { immediate: true }
);

/**
 * **监听 type 属性变化**
 * @description 同步更新按钮样式类型
 * */
watch(
  () => props.type,
  text => {
    if (text) state.buttonConfig.type = text;
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
