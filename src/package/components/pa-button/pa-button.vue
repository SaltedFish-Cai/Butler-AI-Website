<template>
  <button :id="id" type="button" :disabled="disabled" :class="buttonClasses" :style="buttonStyle" @click="btnClick">
    <slot name="icon">
      <pa-icon v-if="showLeftIcon" :name="currentIconName" :class="hasContent ? 'mr-btn pa-button_icon' : ''" />
    </slot>
    <div class="pa-button_text">
      <template v-if="hasContent">
        <slot>
          <template v-if="text">{{ displayText }}</template>
        </slot>
      </template>
    </div>
    <pa-icon v-if="iconPosition === 'right' && useFont" :name="currentIconName" class="pa-button_ml pa-button_icon" />
  </button>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, useSlots, nextTick, inject, onUnmounted, getCurrentInstance, type ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入浏览器环境检测工具
 */
import inBrowser from "../tools/inBrowser";
/**
 * 模块导入
 * @description 导入消息弹窗组件
 */
import { M_MessageBox } from "../feedback";
/**
 * 模块导入
 * @description 导入图标组件
 */
import paIcon from "../pa-icon/pa-icon.vue";
/**
 * 模块导入
 * @description 导入全局配置类型定义
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入 lodash 防抖函数
 */
import { debounce } from "lodash-es";

/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象，包含 text、size、type 等
 */
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
 * 组件事件定义
 * @description 定义组件可触发的事件列表
 */
const emit = defineEmits<ComponentEmits>();
/**
 * 插槽
 * @description 获取组件插槽
 */
const slots = useSlots();
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 从父组件注入的全局配置对象，包含语言设置等
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 获取当前语言标识，如 zh-CN 或 en-US
 */
const languageValue = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
/**
 * 显示文本
 * @type string
 * @description 根据 text 类型返回对应的显示文字
 */
const displayText = computed(() => {
  if (typeof props.text === "string") return props.text;
  return props.text?.[languageValue.value] ?? "";
});
/**
 * 是否有内容
 * @type boolean
 * @description 判断插槽或 text 是否存在内容
 */
const hasContent = computed(() => !!slots.default || !!props.text);
/**
 * 按钮内置样式映射
 * @description 预设按钮样式类型对应的图标和类型配置
 */
const IS_MAP: Record<string, { iconName?: string; type?: string }> = {
  search: { iconName: "search_line" },
  view: { iconName: "document_query_line", type: "default" },
  add: { iconName: "add_circle_line", type: "success" },
  edit: { iconName: "edit_line" },
  check: { iconName: "subscribed" },
  save: { iconName: "save_line" },
  submit: { iconName: "share_forward_line" },
  upload: { iconName: "upload_line", type: "default" },
  download: { iconName: "download_line", type: "default" },
  remove: { iconName: "stop", type: "danger" },
  trash: { iconName: "trash_line", type: "danger" },
  refresh: { iconName: "refresh_line", type: "warning" },
  go: { iconName: "navigation_line" },
  file: { iconName: "attachment_line", type: "default" },
  time: { iconName: "time_line", type: "default" },
  switch: { iconName: "switch_horizontal_line", type: "warning" },
  sync: { iconName: "refresh_arrows_line" },
  import: { iconName: "file_download_line", type: "default" },
  export: { iconName: "file_upload_line", type: "default" },
  ok: { iconName: "check_circle_line", type: "success" },
  cancel: { iconName: "close_circle_line", type: "warning" },
  more: { iconName: "version_line", type: "warning" },
  delete: { iconName: "delete_back_line", type: "danger" }
};
/**
 * 当前图标名称
 * @type ComputedRef<string>
 * @description 根据 iconName 和 is 属性计算当前图标名称
 */
const currentIconName = computed(() => {
  if (props.iconName) return props.iconName;
  if (props.is) return IS_MAP[props.is]?.iconName ?? "finger_press_line";
  return "finger_press_line";
});
/**
 * 当前类型
 * @type ComputedRef<string>
 * @description 根据 type 和 is 属性计算当前按钮样式类型
 */
const currentType = computed(() => {
  if (props.type) return props.type;
  if (props.is) return IS_MAP[props.is]?.type ?? "primary";
  return "default";
});
/**
 * 是否显示左侧图标
 * @type ComputedRef<boolean>
 * @description 判断是否需要显示左侧图标
 */
const showLeftIcon = computed(
  () => props.iconPosition === "left" && !props.loading && !isLoading.value && (props.useFont || !!currentIconName.value)
);
/**
 * 按钮类名
 * @type Array<string | Record<string, boolean>>
 * @description 计算按钮的完整类名列表
 */
const buttonClasses = computed(() => [
  "pa-button",
  props.class,
  {
    disabled: !!props.disabled,
    "use-line": !!props.useLine,
    "use-plain": !!props.usePlain
  },
  currentType.value,
  props.size
]);
/**
 * 按钮样式
 * @type Record<string, string | number>
 * @description 合并自定义样式
 */
const buttonStyle = computed(() => ({ ...props.style }));
/**
 * 加载状态
 * @type Ref<boolean>
 * @description 按钮的自动 loading 状态
 */
const isLoading = ref(false);
/**
 * 组件实例
 * @description 在 setup 阶段捕获的组件实例，用于访问 vnode.props
 */
const instance = getCurrentInstance();
/**
 * 检查是否有指定事件的监听器
 * @param camelKey - 驼峰格式 key，如 onDeleteClick
 * @param kebabKey - kebab 格式 key，如 onDelete-click
 * @returns boolean 是否有外部监听
 * @description 检查 vnode props 中是否有指定事件的监听器
 */
function hasListener(camelKey: string, kebabKey: string): boolean {
  const vnodeProps = instance?.vnode.props || {};
  return !!(vnodeProps[camelKey] || vnodeProps[kebabKey]);
}
/**
 * 获取确认弹窗配置
 * @returns MessageBoxOptions | null
 * @description 根据监听的事件类型生成对应的确认弹窗配置
 */
function getConfirmConfig() {
  if (hasListener("onDeleteClick", "onDelete-click")) {
    return {
      title: { "en-US": "Notice", "zh-CN": "注意" },
      message: { "en-US": "Are you sure you want to delete?", "zh-CN": "是否删除当前选项？" },
      confirmButtonText: { "en-US": "Delete", "zh-CN": "删除" },
      type: "danger" as const,
      onConfirm: () => emit("deleteClick")
    };
  }
  if (hasListener("onSubmitClick", "onSubmit-click")) {
    return {
      title: { "en-US": "Tips", "zh-CN": "温馨提示" },
      message: { "en-US": "Are you sure you want to submit?", "zh-CN": "是否继续提交内容？" },
      confirmButtonText: { "en-US": "Submit", "zh-CN": "提交" },
      type: "warning" as const,
      onConfirm: () => emit("submitClick")
    };
  }
  if (hasListener("onConfirmClick", "onConfirm-click")) {
    return {
      title: { "en-US": "Tips", "zh-CN": "温馨提示" },
      message: { "en-US": "Are you sure you want to continue?", "zh-CN": "是否继续当前任务？" },
      confirmButtonText: { "en-US": "Continue", "zh-CN": "继续" },
      type: "success" as const,
      onConfirm: () => emit("confirmClick")
    };
  }
  return null;
}
/**
 * 实际点击处理
 * @param event - 鼠标点击事件对象
 * @returns void
 * @description 触发 click 事件并处理 loading 状态
 */
function realClick(event: MouseEvent) {
  emit("click", event);
  if (!props.loadingBy) return;

  nextTick(() => {
    const EL = typeof window !== "undefined" && props.loadingBy && window.document.querySelector(props.loadingBy);
    if (EL && inBrowser) {
      isLoading.value = true;
      const safeLock = setTimeout(() => {
        isLoading.value = false;
        observer?.disconnect();
      }, 15 * 60 * 1000);

      const callback = () => {
        const target = typeof window !== "undefined" && props.loadingBy && window.document.querySelector(props.loadingBy);
        if (!target) {
          clearTimeout(safeLock);
          isLoading.value = false;
          observer?.disconnect();
        }
      };
      const observer = new window.MutationObserver(callback);
      observer.observe(document.body, { childList: true });
    }
  });
}
/**
 * 防抖点击函数
 * @description lodash-es 防抖包装的点击处理函数
 */
const debouncedClick = debounce(realClick, props.debouncedTime, { trailing: true });
/**
 * 按钮点击事件处理
 * @param event - 鼠标点击事件对象
 * @returns void
 * @description 处理按钮点击事件，包括确认弹窗、防抖、loading 状态等
 */
function btnClick(event: MouseEvent) {
  if (props.useStop) event.stopPropagation();
  if (props.disabled) return;

  // 确认弹窗优先
  const confirmConfig = props.confirmConfig || getConfirmConfig();
  if (confirmConfig) {
    M_MessageBox.confirm(confirmConfig);
    return;
  }

  // 防抖或直接点击
  if (props.debounced && props.debouncedTime) {
    debouncedClick(event);
  } else {
    realClick(event);
  }
}
</script>

<style lang="scss">
@use "./index.scss";
</style>
