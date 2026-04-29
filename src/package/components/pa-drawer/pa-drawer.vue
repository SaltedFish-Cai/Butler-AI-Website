<template>
  <pa-overlay
    :modelValue="state.visible"
    @click-overlay="closeOnClickModal && closeMenu()"
    :class="[
      position == 'bottom'
        ? 'flex-end-center'
        : position == 'left'
        ? 'flex-center-start'
        : position == 'top'
        ? 'flex-start-center'
        : 'flex-center-end'
    ]"
  >
    <transition
      :name="
        position == 'bottom'
          ? 'mo-animation-fadeDownBig'
          : position == 'left'
          ? 'mo-animation-fadeLeftBig'
          : position == 'top'
          ? 'mo-animation-fadeUpBig'
          : 'mo-animation-fadeRightBig'
      "
    >
      <div class="pa-drawer" v-if="state.visible">
        <div class="pa-drawer-content" :class="[position]" :style="{ width: width, height: height }">
          <div class="pa-drawer-content_header">
            <slot name="header">
              <div class="title_body">
                <div class="flex-center">
                  <slot name="title">
                    <div class="is_title_body" :style="{ fontWeight: subTitle ? 'bold' : 'bold' }">
                      {{ typeof title === "string" ? title : title[language] }}
                    </div>
                  </slot>
                </div>
                <div v-if="subTitle" class="sub_title_body" :style="{ fontWeight: subTitle ? 'bold' : 'normal' }">
                  <slot name="subTitle">
                    {{ typeof subTitle === "string" ? subTitle : subTitle[language] }}
                  </slot>
                </div>
                <div><div></div></div>
              </div>
            </slot>
            <div class="pa-drawer-content_header_close">
              <pa-icon name="close_line" class="flex-center" @click="closeMenu" />
            </div>
          </div>
          <div class="pa-drawer-content_body">
            <pa-scrollbar always v-if="scroll" :useScrollX="useScrollX">
              <div
                class="pa-drawer-content_body_content flex-col"
                :class="{
                  'padding-top': padding?.includes('top') || padding?.includes('all'),
                  'padding-left': padding?.includes('left') || padding?.includes('all'),
                  'padding-bottom': padding?.includes('bottom') || padding?.includes('all'),
                  'padding-right': padding?.includes('right') || padding?.includes('all')
                }"
              >
                <slot></slot>
              </div>
            </pa-scrollbar>
            <div
              v-else
              class="pa-drawer-content_body_content flex-col"
              :class="{
                'padding-top': padding?.includes('top') || padding?.includes('all'),
                'padding-left': padding?.includes('left') || padding?.includes('all'),
                'padding-bottom': padding?.includes('bottom') || padding?.includes('all'),
                'padding-right': padding?.includes('right') || padding?.includes('all')
              }"
            >
              <slot></slot>
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
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { reactive, Ref, watch, onMounted, onUnmounted, computed, inject, ComputedRef } from "vue";
/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";
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
  id: "",
  title: "标题",
  scroll: true,
  useScrollX: false,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  position: "right"
});
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
 * **全局配置**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * **当前语言**
 * @type `ComputedRef<string>`
 * @description 当前使用的语言
 * */
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
/**
 * **关闭抽屉弹窗**
 * @description 关闭抽屉弹窗并触发相关事件
 * */
function closeMenu(): void {
  emits("update:modelValue", false);
  emits("closed", false);
}
/**
 * **处理键盘按下事件**
 * @param `e` `KeyboardEvent` 键盘事件对象
 * @description 处理ESC键关闭抽屉弹窗
 * */
function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === "Escape" && state.visible) {
    closeMenu();
  }
}
/**
 * **组件挂载生命周期**
 * @description 初始化组件
 * */
onMounted(() => {
  props.closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
});
/**
 * **组件卸载生命周期**
 * @description 清理事件监听器
 * */
onUnmounted(() => {
  props.closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});
/**
 * **监听modelValue**
 * @description 监听抽屉弹窗显示状态变化
 * */
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
