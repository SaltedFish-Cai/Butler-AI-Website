<template>
  <pa-scrollbar always noPadding ref="scrollRef">
    <div class="pa-image-view" :id="IMG_ID + '-img'">
      <div class="image-wrapper" :class="zoomIndex > baseIndex ? 'flex' : 'flex-center'" :style="{ zoom: zoomIndex }">
        <img ref="imgRef" :src="mediaImage" :onload="imgLoaded" />
      </div>
    </div>
  </pa-scrollbar>

  <div class="menu-setting-box" v-if="menuSettingVisible" @click="menuSettingVisible = false">
    <transition v-show="menuSettingVisible" appear name="fade-opacity-transform" mode="out-in">
      <div class="menu-setting" :style="{ top: client.y + 'px', left: client.x + 'px' }">
        <div class="setting-item flex-center" @click="left90(IMG_ID + '-img', 1)">
          <m-icon name="flush_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateLeftTip"] }}</div>
        </div>
        <div class="setting-item flex-center mt5" @click="left90(IMG_ID + '-img', 2)">
          <m-icon name="flush_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateRightTip"] }}</div>
        </div>
        <div class="setting-item flex-center mt5" @click="left90(IMG_ID + '-img', 3)">
          <m-icon name="switch_horizontal_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateLeftRightTip"] }}</div>
        </div>
        <div class="setting-item flex-center mt5" @click="left90(IMG_ID + '-img', 4)">
          <m-icon name="switch_horizontal_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateUpDownTip"] }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, inject, ComputedRef, onBeforeUnmount } from "vue";
import { useGetBlob } from "./use-download";
import randChar from "../tools/rand-char";
import { mouseUp, left90, leftAll90 } from "./rotate-fn";
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 默认菜单位置
 * @description 菜单弹出时的默认位置坐标
 */
const DEFAULT_CLIENT = { x: -500, y: -500 } as const;
/**
 * 图片引用
 * @description DOM 中图片元素的引用
 */
const imgRef = ref();
/**
 * 滚动容器引用
 * @description 滚动条容器的引用
 */
const scrollRef = ref();
/**
 * 媒体图片地址
 * @description 当前加载的图片 URL
 */
const mediaImage = ref("");
/**
 * 图片容器 ID
 * @description 用于标识图片容器的唯一 ID
 */
const IMG_ID = randChar();

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 语言包
 * @type ComputedRef
 * @description 当前语言的文本配置
 */
const languagePackage = computed(() => {
  return languageValue.value === "zh-CN"
    ? {
        rotateLeftTip: "左旋转",
        rotateRightTip: "右旋转",
        rotateUpDownTip: "上下翻转",
        rotateLeftRightTip: "左右翻转"
      }
    : {
        rotateLeftTip: "Rotate Left",
        rotateRightTip: "Rotate Right",
        rotateUpDownTip: "Rotate Up Down",
        rotateLeftRightTip: "Rotate Left Right"
      };
});

const props = withDefaults(defineProps<{ filePath: string; modelValue: number }>(), {});
const textUrl = String(props.filePath);
const zoomIndex = ref(1);
const baseIndex = ref(1);
const client = ref({ ...DEFAULT_CLIENT });
const menuSettingVisible = ref(false);
/**
 * 鼠标事件处理器数组
 * @description 用于存储事件处理器以便清理
 */
const mouseUpHandlers: Array<() => void> = [];

onMounted(async () => {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  const blobData = await useGetBlob(config, textUrl);
  if (blobData) {
    const _data = typeof window !== "undefined" && window.URL.createObjectURL(blobData);
    mediaImage.value = _data;

    setTimeout(() => {
      typeof window !== "undefined" && window.URL.revokeObjectURL(_data);
    }, 1000);
  }
});
/**
 * 图片加载完成回调
 * @returns void
 * @description 图片加载完成后绑定右键菜单事件
 */
function imgLoaded(): void {
  const el = document.getElementById(IMG_ID + "-img");
  if (el) {
    const container = el.querySelectorAll(".image-wrapper");
    for (let i = 0; i < container.length; i++) {
      (container[i] as HTMLElement).oncontextmenu = function (e: any) {
        e.preventDefault();
        return false;
      };
      const handler = (event: MouseEvent) =>
        mouseUp(event as MouseEvent, e => {
          menuSettingVisible.value = true;
          client.value = { x: e.clientX + 5, y: e.clientY + 10 };
        });
      mouseUpHandlers.push(handler);
      container[i].addEventListener("mouseup", handler, { passive: false });
    }
  }
}
/**
 * 组件卸载前清理
 * @description 移除事件监听器，防止内存泄漏
 */
onBeforeUnmount(() => {
  mouseUpHandlers.forEach(handler => {
    const el = document.getElementById(IMG_ID + "-img");
    if (el) {
      const container = el.querySelectorAll(".image-wrapper");
      container.forEach(item => item.removeEventListener("mouseup", handler));
    }
  });
  mouseUpHandlers.length = 0;
});

defineExpose({ leftAll90: () => leftAll90(IMG_ID + "-img") });

watch(
  () => props.modelValue,
  data => {
    zoomIndex.value = Number(data);
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.menu-setting-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 9990;
  width: 100%;
  height: 100%;
}
.menu-setting {
  position: fixed;
  top: -500px;
  left: -500px;
  z-index: 9999;
  padding: 5px 0;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 5px;
  box-shadow: 0 0 12px rgb(0 0 0 / 12%);
  .setting-item {
    padding: 5px 16px;
    &:hover {
      color: var(--el-color-primary);
      cursor: pointer;
      background-color: var(--el-color-primary-light-8);
    }
  }
}
</style>

<style lang="scss">
.pa-image-view {
  background: gray;
  padding: 30px;
  min-height: calc(100% - 60px);
  .image-wrapper {
    --rotate-X: 0deg;
    --rotate-Z: 0deg;
    --rotate-Y: 0deg;
    --rotate-Index: 1px;
    margin: 0 auto;
    width: var(--position-width) !important;
    height: var(--position-height) !important;
    max-width: var(--position-width) !important;
    max-height: var(--position-height) !important;
    img {
      transition: var(--pa-component-animation, 0.3s);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      display: block;
      width: 780px !important;
      max-width: 780px !important;
      transform: rotateX(var(--rotate-X)) rotateZ(var(--rotate-Z)) rotateY(var(--rotate-Y)) !important;
    }
  }
}
</style>
