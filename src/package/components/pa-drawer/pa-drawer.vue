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

                <div></div>
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
// # Import
import { reactive, watch, onMounted, onUnmounted, computed, inject, ComputedRef } from "vue";
import { PaDrawerType } from "./type";
import { PancakeGlobalConfigType } from "../pa-manager/type";

// # Var
const props = withDefaults(defineProps<PaDrawerType>(), {
  id: "",
  title: "标题",
  scroll: true,
  useScrollX: false,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  position: "right"
});

const emits = defineEmits(["update:modelValue", "closed"]);

const state = reactive({
  visible: false,
  fullscreen: false
});

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");

// #Function 关闭弹窗回调
function closeMenu() {
  emits("update:modelValue", false);
  emits("closed", false);
}

// #添加ESC键监听
function handleKeyDown(e) {
  if (e.key === "Escape" && state.visible) {
    closeMenu();
  }
}

onMounted(() => {
  props.closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  props.closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});

// #Watch modelValue
watch(
  () => props.modelValue,
  data => {
    state.visible = data;
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
