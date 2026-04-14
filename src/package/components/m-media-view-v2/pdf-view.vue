<template>
  <m-scrollbar-v2 always noPadding>
    <div class="PdfCss" :id="PDF_ID + '-pdf'" :style="{ '--word-view-body_zoom': zoom }"></div>
  </m-scrollbar-v2>

  <div class="menu-setting-box" v-if="menuSettingVisible" @click="menuSettingVisible = false">
    <transition v-show="menuSettingVisible" appear name="fade-opacity-transform" mode="out-in">
      <div class="menu-setting" :style="{ top: client.y + 'px', left: client.x + 'px' }">
        <div class="setting-item flex-center" @click="left90(PDF_ID + '-pdf', 1)">
          <m-icon name="flush_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateLeftTip"] }}</div>
        </div>
        <div class="setting-item flex-center mt5" @click="left90(PDF_ID + '-pdf', 2)">
          <m-icon name="flush_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateRightTip"] }}</div>
        </div>
        <div class="setting-item flex-center mt5" @click="left90(PDF_ID + '-pdf', 3)">
          <m-icon name="switch_horizontal_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateLeftRightTip"] }}</div>
        </div>
        <div class="setting-item flex-center mt5" @click="left90(PDF_ID + '-pdf', 4)">
          <m-icon name="switch_horizontal_line"> </m-icon>
          <div class="ml5">{{ languagePackage["rotateUpDownTip"] }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, onUnmounted, nextTick, computed, inject, ComputedRef } from "vue";
import { useGetBlob } from "./use-download";
import randChar from "../tools/rand-char";
import { mouseUp, left90, leftAll90 } from "./rotate-fn";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

// import Pdfh5 from "./pdf/js/pdfh5";
// import "./pdf/css/pdfh5.css";
// import Pdfh5 from "pdfh5";
// import "pdfh5/css/pdfh5.css";

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package["media"] || {};
});

const pdf: Ref<any> = ref(null);
const PDF_ID = ref(randChar());

const props = withDefaults(defineProps<{ filePath: string; zoom: number }>(), {});
const textUrl = String(props.filePath);

const client = ref({ x: -500, y: -500 });
const menuSettingVisible = ref(false);

onMounted(async () => {
  pdf.value = new window.Pdfh5("#" + PDF_ID.value + "-pdf", {
    pdfurl: textUrl,
    zoomEnable: false,
    pageNum: false,
    backTop: false,
    scrollEnable: false
  });
  pdf.value.on("complete", function () {
    // status: string, msg: string, time: string
    const el = document.getElementById(PDF_ID.value + "-pdf");
    if (el) {
      const container = el.querySelectorAll(".pageContainer");
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
  });
  return;
  const config = {
    requestHeader: ManagerGlobalConfig.value?.requestHeader,
    downloadHose: ManagerGlobalConfig.value?.file_config?.downloadHose || ""
  };
  const blobData = await useGetBlob(config, textUrl);
  if (blobData) {
    const _data = window.URL.createObjectURL(blobData);
    nextTick(() => {
      pdf.value = new window.Pdfh5("#" + PDF_ID.value + "-pdf", {
        pdfurl: _data,
        zoomEnable: false,
        pageNum: false,
        backTop: false,
        scrollEnable: false
      });
      pdf.value.on("complete", function () {
        // status: string, msg: string, time: string
        window.URL.revokeObjectURL(_data);
        const el = document.getElementById(PDF_ID.value + "-pdf");
        if (el) {
          const container = el.querySelectorAll(".pageContainer");
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
      });
    });
  }
});

onUnmounted(() => {
  pdf.value?.destroy();
});

defineExpose({ leftAll90: () => leftAll90(PDF_ID.value + "-pdf") });
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
.PdfCss {
  height: max-content !important;
  min-height: 100% !important;
  background-color: gray !important;

  * ::-webkit-scrollbar {
    display: block;
    width: 15px;
    height: 15px;
  }
  .pdfViewer {
    padding: 30px !important;
    min-height: 400px !important;
    height: 100%;
    background-color: gray;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    zoom: var(--word-view-body_zoom) !important;
    .pageContainer {
      margin: 0 !important;
      width: 780px;
      transition: var(--m-component-animation, 0.3s);
      --rotate-X: 0deg;
      --rotate-Z: 0deg;
      --rotate-Y: 0deg;
      --rotate-Index: 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: var(--position-width) !important;
      height: var(--position-height) !important;
      max-width: var(--position-width) !important;
      max-height: var(--position-height) !important;
      background-color: transparent !important;
      img {
        transition: var(--m-component-animation, 0.3s);
        width: 780px !important;
        max-width: 780px !important;
        height: initial !important;
        transform: rotateX(var(--rotate-X)) rotateZ(var(--rotate-Z)) rotateY(var(--rotate-Y)) !important;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  .pinch-zoom-container {
    height: 100% !important;
    min-height: 100% !important;
  }
}
</style>
