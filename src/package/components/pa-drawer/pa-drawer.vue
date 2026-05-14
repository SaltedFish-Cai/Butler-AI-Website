<template>
  <pa-overlay :modelValue="state.visible" @click-overlay="closeOnClickModal && closeMenu()" :class="positionClass">
    <transition :name="transitionName">
      <div v-if="state.visible" class="pa-drawer">
        <div class="pa-drawer-content" :class="position" :style="contentStyle">
          <div class="pa-drawer-content_header">
            <slot name="header">
              <div class="title_body">
                <div class="flex-center">
                  <slot name="title">
                    <div class="is_title_body" :style="{ fontWeight: 'bold' }">
                      {{ displayTitle }}
                    </div>
                  </slot>
                </div>
                <div v-if="subTitle" class="sub_title_body" :style="{ fontWeight: 'bold' }">
                  <slot name="subTitle">
                    {{ displaySubTitle }}
                  </slot>
                </div>
              </div>
            </slot>
            <div class="pa-drawer-content_header_close">
              <pa-icon name="close_line" class="flex-center" @click="closeMenu" />
            </div>
          </div>
          <div class="pa-drawer-content_body">
            <pa-scrollbar always v-if="scroll" :useScrollX="useScrollX">
              <div class="pa-drawer-content_body_content flex-col" :class="paddingClasses">
                <slot />
              </div>
            </pa-scrollbar>
            <div v-else class="pa-drawer-content_body_content flex-col" :class="paddingClasses">
              <slot />
            </div>
          </div>
          <div v-if="$slots['footer']" class="pa-drawer-content_footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </pa-overlay>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { reactive, watch, onMounted, onUnmounted, computed, inject, type ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 全局配置
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  id: "",
  title: "标题",
  scroll: true,
  useScrollX: false,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  position: "right"
});
/**
 * 组件事件定义
 * @type ComponentEmits
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 组件状态
 * @type Ref<{ visible: boolean; fullscreen: boolean }>
 * @description 组件的响应式状态
 */
const state = reactive({
  visible: false,
  fullscreen: false
});
/**
 * 位置映射表
 * @description 存储位置对应的样式类和动画名称
 */
const positionMap = {
  bottom: { class: "flex-end-center", animation: "mo-animation-fadeDownBig" },
  left: { class: "flex-center-start", animation: "mo-animation-fadeLeftBig" },
  top: { class: "flex-start-center", animation: "mo-animation-fadeUpBig" },
  right: { class: "flex-center-end", animation: "mo-animation-fadeRightBig" }
} as const;
/**
 * 当前语言
 * @type ComputedRef<string>
 * @description 当前使用的语言
 */
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
/**
 * 抽屉弹窗样式类
 * @type ComputedRef<string>
 * @description 根据位置获取对应的样式类名
 */
const positionClass = computed(() => positionMap[props.position]?.class || "flex-center-end");
/**
 * 抽屉弹窗动画名称
 * @type ComputedRef<string>
 * @description 根据位置获取对应的动画名称
 */
const transitionName = computed(() => positionMap[props.position]?.animation || "mo-animation-fadeRightBig");
/**
 * 抽屉弹窗内容样式
 * @type ComputedRef<{ width?: string; height?: string }>
 * @description 抽屉弹窗的宽度和高度样式
 */
const contentStyle = computed(() => ({
  width: props.width,
  height: props.height
}));
/**
 * 内边距样式类
 * @type ComputedRef<Record<string, boolean>>
 * @description 根据 padding 属性生成的样式类
 */
const paddingClasses = computed(() => ({
  "padding-top": props.padding?.includes("top") || props.padding?.includes("all"),
  "padding-left": props.padding?.includes("left") || props.padding?.includes("all"),
  "padding-bottom": props.padding?.includes("bottom") || props.padding?.includes("all"),
  "padding-right": props.padding?.includes("right") || props.padding?.includes("all")
}));
/**
 * 显示标题
 * @type ComputedRef<string>
 * @description 根据语言返回对应的标题文本
 */
const displayTitle = computed(() => (typeof props.title === "string" ? props.title : props.title[language.value]));
/**
 * 显示副标题
 * @type ComputedRef<string>
 * @description 根据语言返回对应的副标题文本
 */
const displaySubTitle = computed(() => (typeof props.subTitle === "string" ? props.subTitle : props.subTitle[language.value]));
/**
 * 关闭抽屉弹窗
 * @description 关闭抽屉弹窗并触发相关事件
 */
function closeMenu(): void {
  emits("update:modelValue", false);
  emits("closed", false);
}
/**
 * 处理键盘按下事件
 * @param e - 键盘事件对象
 * @description 处理ESC键关闭抽屉弹窗
 */
function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === "Escape" && state.visible) {
    closeMenu();
  }
}
/**
 * 组件挂载生命周期
 * @description 初始化组件
 */
onMounted(() => {
  props.closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
});
/**
 * 组件卸载生命周期
 * @description 清理事件监听器
 */
onUnmounted(() => {
  props.closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});
/**
 * 监听modelValue
 * @description 监听抽屉弹窗显示状态变化
 */
watch(
  () => props.modelValue,
  (data: boolean) => {
    state.visible = data;
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
