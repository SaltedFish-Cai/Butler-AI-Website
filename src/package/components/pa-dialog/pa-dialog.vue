<template>
  <pa-overlay :modelValue="state.visible" @click-overlay="closeOnClickModal && closeMenu()" class="flex-center">
    <transition name="mo-animation-fade">
      <div
        class="pa-dialog"
        :class="[state.fullscreen ? 'pa-dialog_full' : '']"
        ref="DialogRef"
        v-if="state.visible"
        :style="{
          height: `${setHeight}`,
          width: `${setSize}`,
          '--pa-dialog-offset-x': `${setOffsetX}`,
          '--pa-dialog-offset-y': `${setOffsetY}`
        }"
      >
        <div class="pa-dialog-content">
          <div class="pa-dialog-content_header">
            <slot name="header">
              <div class="title_body">
                <div class="flex-center">
                  <slot name="title">
                    <div class="is_title_body" :style="{ fontWeight: subTitle ? 'bold' : 'bold' }">
                      {{ typeof title === "string" ? title : title?.[language] }}
                    </div>
                  </slot>
                  <pa-icon
                    v-if="useFull"
                    :name="!state.fullscreen ? 'fullscreen_arrow_line' : 'fullscreen_arrow_exit_line'"
                    class="flex-center full_icon ml-size"
                    @click="state.fullscreen = !state.fullscreen"
                  />
                </div>
                <div v-if="subTitle" class="sub_title_body" :style="{ fontWeight: subTitle ? 'bold' : 'normal' }">
                  <slot name="subTitle">
                    {{ typeof subTitle === "string" ? subTitle : subTitle?.[language] }}
                  </slot>
                </div>
                <div><div></div></div>
              </div>
            </slot>
            <div class="pa-dialog-content_header_close" @click="closeMenu">
              <pa-icon name="close_line" class="flex-center" />
            </div>
          </div>
          <div class="pa-dialog-content_body" ref="ScrollbarRef">
            <pa-scrollbar
              v-if="scroll"
              pa-dialog-content_body
              :useScrollX="useScrollX"
              @scroll-child-change="scrollChildChange"
              :parentBoxRef="ScrollbarRef"
            >
              <div
                class="dialog__body flex-col"
                ref="ScrollbarBodyRef"
                :class="{
                  'padding-top': padding?.includes('top') || padding?.includes('all'),
                  'padding-left': padding?.includes('left') || padding?.includes('all'),
                  'padding-bottom': padding?.includes('bottom') || padding?.includes('all'),
                  'padding-right': padding?.includes('right') || padding?.includes('all')
                }"
              >
                <template v-if="keepAlive"> <slot></slot> </template>
              </div>
            </pa-scrollbar>
            <div
              v-else
              class="dialog__body flex-col"
              :class="{
                'padding-top': padding?.includes('top') || padding?.includes('all'),
                'padding-left': padding?.includes('left') || padding?.includes('all'),
                'padding-bottom': padding?.includes('bottom') || padding?.includes('all'),
                'padding-right': padding?.includes('right') || padding?.includes('all')
              }"
            >
              <template v-if="keepAlive"> <slot></slot> </template>
            </div>
          </div>
          <div v-if="$slots['footer'] || $slots['footerLeft'] || $slots['footerRight']" class="pa-dialog-content_footer">
            <div v-if="$slots['footerLeft'] || $slots['footerRight']" class="pa-dialog-content_footer_left">
              <slot name="footerLeft" />
            </div>
            <div v-if="$slots['footer']" class="pa-dialog-content_footer_center">
              <slot name="footer" />
            </div>
            <div v-if="$slots['footerRight'] || $slots['footerLeft']" class="pa-dialog-content_footer_right">
              <slot name="footerRight" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </pa-overlay>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, Ref, reactive, watch, computed, onMounted, onUnmounted, nextTick } from "vue";
/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits<ComponentEmits>();
/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  size: "m",
  height: "auto",
  offsetX: 0,
  offsetY: 0,
  keepAlive: true,
  title: "标题",
  useFull: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  titleAlign: "left",
  scroll: true
});
/**
 * **打开标识**
 * @type `string`
 * @description 弹窗打开时的唯一标识
 * */
let openId: string = "";
/**
 * **滚动条引用**
 * @type `Ref<HTMLElement | undefined>`
 * @description 滚动条容器 DOM 引用
 * */
const ScrollbarRef: Ref<HTMLElement | undefined> = ref();
/**
 * **滚动条内容引用**
 * @type `Ref<HTMLElement | undefined>`
 * @description 滚动条内容 DOM 引用
 * */
const ScrollbarBodyRef: Ref<HTMLElement | undefined> = ref();
/**
 * **组件状态**
 * @type `Ref<{ visible: boolean; fullscreen: boolean }>`
 * @description 组件的响应式状态
 * */
const state = reactive({
  visible: false,
  fullscreen: false
});
/**
 * **当前语言**
 * @type `string`
 * @description 当前使用的语言
 * */
const language: string =
  (typeof window !== "undefined" && typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN" || "zh-CN";
/**
 * **计算宽度**
 * @type `ComputedRef<number | string>`
 * @description 计算弹窗的宽度
 * */
const setSize = computed(() => {
  let size: number | string = 500;
  switch (props.size) {
    case "s":
      size = "30%";
      break;
    case "m":
      size = "50%";
      break;
    case "l":
      size = "70%";
      break;
    case "max":
      size = "95%";
      break;
    default:
      break;
  }
  return props.width || size;
});
/**
 * **计算偏移**
 * @type `ComputedRef<number | string>`
 * @description 计算弹窗的偏移量
 * */
const transform = computed(() => {
  let size: number | string = 0;
  switch (props.size) {
    case "s":
      size = 0;
      break;
    case "m":
      size = 0;
      break;
    case "l":
      size = 0;
      break;
    case "max":
      size = 0;
      break;
    default:
      break;
  }
  return props.offsetX || size;
});
/**
 * **计算X轴偏移量**
 * @type `ComputedRef<number | string>`
 * @description 计算弹窗的X轴偏移量
 * */
const setOffsetX = computed(() => {
  let data = transform.value;
  if (props.offsetX) {
    data = isNumber(props.offsetX) ? props.offsetX + "px" : props.offsetX;
  }
  if (state.fullscreen) {
    data = 0;
  }
  return data;
});
/**
 * **计算Y轴偏移量**
 * @type `ComputedRef<number | string>`
 * @description 计算弹窗的Y轴偏移量
 * */
const setOffsetY = computed(() => {
  let data: number | string = 0;
  if (props.offsetY) {
    data = isNumber(props.offsetY) ? props.offsetY + "px" : props.offsetY;
  }
  if (state.fullscreen) {
    data = 0;
  }
  return data;
});
/**
 * **计算高度**
 * @type `ComputedRef<number | string>`
 * @description 计算弹窗的高度
 * */
const setHeight = computed(() => {
  let data: number | string = 500;
  if (props.size == "max") {
    data = "95%";
  } else if (props.size == "l") {
    data = "85%";
  } else if (props.size == "m") {
    data = "70%";
  } else if (props.size == "s") {
    data = "50%";
  }
  if (props.height && props.height != "auto") {
    data = isNumber(props.height) ? props.height + "px" : props.scroll === false ? "" : props.height;
  }
  if (props.height == "auto" && props.scroll) {
    data = "max-content";
  }
  if (state.fullscreen) {
    data = "100%";
  }
  return data;
});
/**
 * **判断是否为数字**
 * @param `value` `unknown` 要判断的值
 * @returns `boolean` 是否为数字
 * @description 判断给定的值是否为数字类型
 * */
function isNumber(value: unknown): boolean {
  return Number.isNaN(Number(value)) === false;
}
/**
 * **关闭弹窗**
 * @description 关闭弹窗并触发相关事件
 * */
function closeMenu(): void {
  if (typeof window !== "undefined") {
    window.PancakeGlobalConfig.escapeMap = window.PancakeGlobalConfig.escapeMap || [];
    window.PancakeGlobalConfig.escapeMap = window.PancakeGlobalConfig.escapeMap.filter((item: string) => item != openId);
  }
  emits("update:modelValue", false);
  emits("closed", false);
}
/**
 * **处理键盘按下事件**
 * @param `e` `KeyboardEvent` 键盘事件对象
 * @description 处理ESC键关闭弹窗
 * */
function handleKeyDown(e: KeyboardEvent): void {
  const escapeMap = (typeof window !== "undefined" && window.PancakeGlobalConfig.escapeMap) || [];
  if (e.key === "Escape" && state.visible && escapeMap[escapeMap.length - 1] === openId) {
    if (state.fullscreen && props.size != "full") {
      state.fullscreen = false;
      return;
    }
    closeMenu();
  }
}
/**
 * **滚动子元素变化处理**
 * @description 处理滚动内容变化时的逻辑
 * */
function scrollChildChange(): void {
  if (!ScrollbarRef.value) return;
  if (ScrollbarBodyRef.value && ScrollbarBodyRef.value.clientHeight < Number(String(setHeight.value)?.replace("px", ""))) return;
  if (ScrollbarRef.value && ScrollbarBodyRef.value) {
    ScrollbarRef.value.style.height = ScrollbarBodyRef.value.clientHeight + "px";
  }
}
/**
 * **组件挂载生命周期**
 * @description 初始化组件
 * */
onMounted(() => {
  nextTick(() => {
    scrollChildChange();
  });
  props.closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
});
/**
 * **组件卸载生命周期**
 * @description 清理事件监听器
 * */
onUnmounted(() => {
  props.closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});
defineExpose({ ScrollbarRef: ScrollbarRef });
/**
 * **监听modelValue**
 * @description 监听弹窗显示状态变化
 * */
watch(
  () => props.modelValue,
  (data: boolean) => {
    state.visible = data;
    if (data) {
      scrollChildChange();
    }
    if (data && props.closeOnPressEscape && typeof window !== "undefined") {
      window.PancakeGlobalConfig.escapeMap = window.PancakeGlobalConfig.escapeMap || [];
      openId = new Date().getTime().toString();
      window.PancakeGlobalConfig.escapeMap.push(openId);
    }
    if (props.size == "full") {
      state.fullscreen = true;
    } else {
      state.fullscreen = false;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
