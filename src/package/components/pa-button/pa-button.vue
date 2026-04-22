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
        :class="state.slotsLength || text ? 'mr-btn btn-icon' : ''"
      />
    </slot>
    <div class="btn-text">
      <template v-if="state.slotsLength || text">
        <slot>
          <template v-if="text"> {{ typeof text == "string" ? text : text[languageValue] }} </template>
        </slot>
      </template>
    </div>
    <pa-icon v-if="iconPosition == 'right' && useFont" :name="state.buttonConfig.iconName" class="ml-btn btn-icon"></pa-icon>
  </button>
</template>

<script lang="ts" setup>
// # Import
import { reactive, onBeforeMount, useSlots, nextTick, watch, inject, ComputedRef, computed } from "vue";
import { ComponentProps } from "./type";
import inBrowser from "../tools/inBrowser";
import { M_MessageBox } from "../feedback";

import { PancakeGlobalConfigType } from "../pa-manager/type";

import _ from "lodash";
const { debounce } = _;

const props = withDefaults(defineProps<ComponentProps>(), {
  debounced: true,
  debouncedTime: 300,
  disabled: false,
  iconPosition: "left",
  size: undefined,
  loading: false,
  useLine: false,
  loadingBy: "#nprogress",
  useFont: true,
  usePlain: true,
  useStop: true
});

const emit = defineEmits(["click", "confirmClick", "deleteClick", "submitClick"]);

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
const state = reactive({
  id: new Date().getTime() + Math.random(),
  maskVisible: false,
  slotsLength: 0,
  isLoading: false,
  buttonConfig: { iconName: "finger_press_line", type: undefined, plain: true, size: "default" } as any
});

// # Vue onBeforeMount
onBeforeMount(() => {
  const slots = useSlots();
  state.slotsLength = slots.default ? 1 : 0;
  if (props.iconName) state.buttonConfig.iconName = props.iconName;
  if (props.type) state.buttonConfig.type = props.type;
  if (props.size) state.buttonConfig.size = props.size;
});

// #Function 点击按钮
const _debounce = debounce(realClick, props.debouncedTime, { trailing: true });
function btnClick(event: MouseEvent) {
  if (props.useStop) event.stopPropagation();
  if (props.onConfirmClick || props.onDeleteClick || props.onSubmitClick) {
    let confirmConfig = {
      title: { "en-US": "Tips", "zh-CN": "温馨提示" },
      message: { "en-US": "Are you sure you want to continue?", "zh-CN": "是否继续当前任务？" },
      confirmButtonText: { "en-US": "Continue", "zh-CN": "继续" },
      type: "success" as "danger" | "success" | "warning",
      onConfirm: props.onConfirmClick
    };
    if (props.onDeleteClick) {
      confirmConfig = {
        title: { "en-US": "Notice", "zh-CN": "注意" },
        message: { "en-US": "Are you sure you want to delete?", "zh-CN": "是否删除当前选项？" },
        confirmButtonText: { "en-US": "Delete", "zh-CN": "删除" },
        type: "danger" as const,
        onConfirm: props.onDeleteClick
      };
    }
    if (props.onSubmitClick) {
      confirmConfig = {
        title: { "en-US": "Tips", "zh-CN": "温馨提示" },
        message: { "en-US": "Are you sure you want to submit?", "zh-CN": "是否继续提交内容？" },
        confirmButtonText: { "en-US": "Submit", "zh-CN": "提交" },
        type: "warning" as const,
        onConfirm: props.onSubmitClick
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
    _debounce();
  } else {
    if (props.confirmConfig) {
      M_MessageBox.confirm(props.confirmConfig);
      return;
    }
    realClick();
  }
  // toolsStore.setButtonLoadingId(String(state.id));
}

// #Function 实际点击（Loading）
let lock = false;
function realClick() {
  if (lock) return;
  emit("click");
  if (props.debounced) lock = true;

  nextTick(() => {
    const EL = typeof window !== "undefined" && window.document.querySelector(props.loadingBy);
    if (EL && inBrowser) {
      state.isLoading = true;

      // 锁死保险
      const safeLock = setTimeout(() => {
        state.isLoading = false;
        observer?.disconnect && observer?.disconnect();
      }, 15 * 60 * 1000);

      const config = { childList: true };
      const callback = () => {
        const EL = typeof window !== "undefined" && window.document.querySelector(props.loadingBy);
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

// #Watch 处理 is
watch(
  () => props.is,
  text => {
    const config = {
      type: "primary",
      plain: true,
      iconName: "finger_press_line",
      color: "",
      size: ""
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
          // config.color = "#026ccf";
          // config.plain = false;
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

// #Watch 处理 iconName
watch(
  () => props.iconName,
  text => {
    if (text) state.buttonConfig.iconName = text;
  },
  { immediate: true }
);

// #Watch 处理 type
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
