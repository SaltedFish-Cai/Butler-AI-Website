<template>
  <m-scrollbar-v2 always noPadding ref="scrollRef">
    <div class="m-image-view-v2" :id="IMG_ID + '-img'">
      <div class="image-wrapper" :class="zoomIndex > baseIndex ? 'flex' : 'flex-center'" :style="{ zoom: zoomIndex }">
        <img ref="imgRef" :src="mediaImage" :onload="imgLoaded" />
      </div>
    </div>
  </m-scrollbar-v2>

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
import { ref, onMounted, computed, watch, inject, ComputedRef } from "vue";
import { useGetBlob } from "./use-download";
import randChar from "../tools/rand-char";
import { mouseUp, left90, leftAll90 } from "./rotate-fn";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const imgRef = ref();
const scrollRef = ref();
const mediaImage = ref("");
const IMG_ID = ref(randChar());

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package["media"] || {};
});

// const startDistance = ref(0);

// let scaleFactor = 1;

const props = withDefaults(defineProps<{ filePath: string; modelValue: number }>(), {});
const textUrl = String(props.filePath);
const zoomIndex = ref(1);
const baseIndex = ref(1);
// const emits = defineEmits(["update:modelValue"]);
const client = ref({ x: -500, y: -500 });
const menuSettingVisible = ref(false);

onMounted(async () => {
  mediaImage.value = props.filePath;
  return;

  const config = {
    requestHeader: ManagerGlobalConfig.value?.requestHeader,
    downloadHose: ManagerGlobalConfig.value?.file_config?.downloadHose || ""
  };
  const blobData = await useGetBlob(config, textUrl);
  if (blobData) {
    const _data = window.URL.createObjectURL(blobData);
    mediaImage.value = _data;

    setTimeout(() => {
      window.URL.revokeObjectURL(_data);
    }, 1000);
  }
});

function imgLoaded() {
  const el = document.getElementById(IMG_ID.value + "-img");
  if (el) {
    const container = el.querySelectorAll(".image-wrapper");
    for (let i = 0; i < container.length; i++) {
      (container[i] as HTMLElement).oncontextmenu = function (e: any) {
        e.preventDefault();
        return false;
      };
      container[i].addEventListener(
        "mouseup",
        event =>
          mouseUp(event as MouseEvent, e => {
            menuSettingVisible.value = true;
            client.value = { x: e.clientX + 5, y: e.clientY + 10 };
          }),
        { passive: false }
      );
    }
  }

  // setTimeout(() => {
  //   const { clientWidth } = imgRef.value;
  //   const scrollBody = scrollRef.value.el.wrapRef;
  //   console.dir(scrollBody);
  //   const _zoomIndex = scrollBody.clientWidth / clientWidth;
  //   zoomIndex.value = _zoomIndex;
  //   baseIndex.value = _zoomIndex;
  //   emits("update:modelValue", _zoomIndex);
  // }, 200);
  // scaleFactor = zoomIndex.value;
}

defineExpose({ leftAll90: () => leftAll90(IMG_ID.value + "-img") });

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
.m-image-view-v2 {
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
      transition: var(--m-component-animation, 0.3s);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      display: block;
      width: 780px !important;
      max-width: 780px !important;
      transform: rotateX(var(--rotate-X)) rotateZ(var(--rotate-Z)) rotateY(var(--rotate-Y)) !important;
    }
  }
}
</style>
