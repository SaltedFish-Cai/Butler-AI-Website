<template>
  <m-overlay-v2 :modelValue="state.visible" @click-overlay="closeOnClickModal && closeMenu()" class="flex-center">
    <transition name="mo-animation-fade">
      <div
        class="m-dialog-v2"
        :class="[state.fullscreen ? 'm-dialog-v2_full' : '', outOfRange ? 'out-of-range' : '']"
        v-if="state.visible"
        :style="{
          height: `${setHeight}`,
          width: `${setSize}`,
          '--m-dialog-v2-offset-x': `${setOffsetX}`,
          '--m-dialog-v2-offset-y': `${setOffsetY}`
        }"
      >
        <div class="m-dialog-v2-content">
          <div class="m-dialog-v2-content_header">
            <slot name="header">
              <div class="title_body">
                <div class="flex-center">
                  <slot name="title">
                    <div class="is_title_body" :style="{ fontWeight: subTitle ? 'bold' : 'bold' }">
                      {{ typeof title === "string" ? title : title?.[language] }}
                    </div>
                  </slot>
                  <m-icon-v2
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
            <div class="m-dialog-v2-content_header_close" @click="closeMenu">
              <m-icon-v2 name="close_line" class="flex-center" />
            </div>
          </div>

          <div class="m-dialog-v2-content_body" ref="ScrollbarRef">
            <m-scrollbar-v2
              v-if="scroll"
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
            </m-scrollbar-v2>

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

          <div v-if="$slots['footer'] || $slots['footerLeft'] || $slots['footerRight']" class="m-dialog-v2-content_footer">
            <div v-if="$slots['footerLeft'] || $slots['footerRight']" class="m-dialog-v2-content_footer_left">
              <slot name="footerLeft" />
            </div>
            <div v-if="$slots['footer']" class="m-dialog-v2-content_footer_center">
              <slot name="footer" />
            </div>
            <div v-if="$slots['footerRight'] || $slots['footerLeft']" class="m-dialog-v2-content_footer_right">
              <slot name="footerRight" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </m-overlay-v2>
</template>

<script lang="ts" setup>
// # Import
import { ref, reactive, watch, computed, onMounted, onUnmounted } from "vue";
import { MDialogV2Type } from "./type";

// # Var
const props = withDefaults(defineProps<MDialogV2Type>(), {
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

const emits = defineEmits(["update:modelValue", "closed"]);
const ScrollbarRef = ref();
const ScrollbarBodyRef = ref();
const outOfRange = ref(false);
const state = reactive({
  visible: false,
  fullscreen: false
});

const language = window.ManagerGlobalConfig?.language || "zh-CN";

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
    data = "80%";
  } else if (props.size == "m") {
    data = "80%";
  } else if (props.size == "s") {
    data = "80%";
  }
  if (props.height && props.height != "default") {
    data = isNumber(props.height) ? props.height + "px" : props.scroll === false ? "" : props.height;
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
  emits("update:modelValue", false);
  emits("closed", false);
}

// #添加ESC键监听
function handleKeyDown(e) {
  if (e.key === "Escape" && state.visible) {
    if (state.fullscreen) {
      state.fullscreen = false;
      return;
    }
    closeMenu();
  }
}

onMounted(() => {
  props.closeOnPressEscape && document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  props.closeOnPressEscape && document.removeEventListener("keydown", handleKeyDown);
});

function scrollChildChange() {
  if (ScrollbarBodyRef.value && ScrollbarRef.value) {
    if (ScrollbarBodyRef.value.clientHeight > ScrollbarRef.value.clientHeight) {
      outOfRange.value = true;
    } else {
      outOfRange.value = false;
    }
  }
}

defineExpose({ ScrollbarRef: ScrollbarRef });

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
