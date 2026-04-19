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

                <div></div>
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
// # Import
import { ref, reactive, watch, computed, onMounted, onUnmounted, nextTick } from "vue";
import { PaDialogType } from "./type";

// # Var
const props = withDefaults(defineProps<PaDialogType>(), {
  id: "",
  size: "m",
  offsetX: 0,
  offsetY: 0,
  keepAlive: true,
  title: "标题",
  useFull: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  titleAlign: "left",
  scroll: true,
  useScrollX: false,
  height: "auto"
});
let openId = "";
const emits = defineEmits(["update:modelValue", "closed"]);
const ScrollbarRef = ref();
const ScrollbarBodyRef = ref();
const state = reactive({
  visible: false,
  fullscreen: false
});

const language = typeof window !== "undefined" && typeof window !== "undefined" && window.PancakeGlobalConfig?.language || "zh-CN" || "zh-CN";

// #Computed setSize
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

// #Computed transform
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

// #Computed setOffsetX
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

// #Computed setOffsetY
const setOffsetY = computed(() => {
  let data = 0 as number | string;
  if (props.offsetY) {
    data = isNumber(props.offsetY) ? props.offsetY + "px" : props.offsetY;
  }
  if (state.fullscreen) {
    data = 0;
  }
  return data;
});

// #Computed setHeight
const setHeight = computed(() => {
  let data = 500 as number | string;

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

// #Function isNumber
function isNumber(value) {
  return Number.isNaN(value / 1) === false;
}

// #Function 关闭弹窗回调
function closeMenu() {
  if (typeof window !== "undefined") {
    window.PancakeGlobalConfig.escapeMap = window.PancakeGlobalConfig.escapeMap || [];
    window.PancakeGlobalConfig.escapeMap = window.PancakeGlobalConfig.escapeMap.filter(item => item != openId);
  }
  emits("update:modelValue", false);
  emits("closed", false);
}

// #添加ESC键监听
function handleKeyDown(e) {
  const escapeMap = typeof window !== "undefined" && window.PancakeGlobalConfig.escapeMap || [];
  if (e.key === "Escape" && state.visible && escapeMap[escapeMap.length - 1] === openId) {
    if (state.fullscreen && props.size != "full") {
      state.fullscreen = false;
      return;
    }
    closeMenu();
  }
}

onMounted(() => {
  nextTick(() => {
    scrollChildChange();
  });
  props.closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  props.closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});

function scrollChildChange() {
  if (!ScrollbarRef.value) return;
  console.dir(ScrollbarBodyRef.value);
  if (ScrollbarBodyRef.value.clientHeight < Number(String(setHeight.value)?.replace("px", ""))) return;
  ScrollbarRef.value.style.height = ScrollbarBodyRef.value.clientHeight + "px";
}

defineExpose({ ScrollbarRef: ScrollbarRef });

// #Watch modelValue
watch(
  () => props.modelValue,
  data => {
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
