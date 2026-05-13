<template>
  <m-scrollbar always noPadding>
    <div class="PdfCss" :id="PDF_ID + '-pdf'" :style="{ '--word-view-body_zoom': zoom }"></div>
  </m-scrollbar>

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
        <div class="setting-item flex-center mt5" @click="changePix(0.5)">
          <m-icon name="circle_arrow_up_line"> </m-icon>
          <div class="ml5">{{ languagePackage["zoomInTip"] }}</div>
        </div>
        <div class="setting-item flex-center mt5" @click="changePix(-0.5)">
          <m-icon name="circle_arrow_down_line"> </m-icon>
          <div class="ml5">{{ languagePackage["zoomOutTip"] }}</div>
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
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 默认菜单位置
 * @description 菜单弹出时的默认位置坐标
 */
const DEFAULT_CLIENT = { x: -500, y: -500 } as const;

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
        rotateLeftRightTip: "左右翻转",
        zoomInTip: "放大",
        zoomOutTip: "缩小"
      }
    : {
        rotateLeftTip: "Rotate Left",
        rotateRightTip: "Rotate Right",
        rotateUpDownTip: "Rotate Up Down",
        rotateLeftRightTip: "Rotate Left Right",
        zoomInTip: "Zoom In",
        zoomOutTip: "Zoom Out"
      };
});
/**
 * PDF 实例
 * @description Pdfh5 库的实例引用
 */
const pdf: Ref<any> = ref(null);
/**
 * PDF 容器 ID
 * @description 用于标识 PDF 容器的唯一 ID
 */
const PDF_ID = randChar();

const props = withDefaults(defineProps<{ filePath: string; zoom: number }>(), {});
const textUrl = String(props.filePath);

const client = ref({ ...DEFAULT_CLIENT });
const menuSettingVisible = ref(false);
let pxit = 1.5;
let blobDataObject: string | undefined;
/**
 * 组件挂载后加载 PDF
 * @description 获取文件 blob 并创建 PDF 预览实例
 */
onMounted(async () => {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  const blobData = await useGetBlob(config, textUrl);
  if (blobData) {
    blobDataObject = window.URL.createObjectURL(blobData);
    createPdf();
  }
});
/**
 * 创建 PDF 预览实例
 * @returns void
 * @description 初始化 Pdfh5 并加载 PDF 文件
 */
function createPdf(): void {
  nextTick(() => {
    pdf.value = new window.Pdfh5("#" + PDF_ID + "-pdf", {
      pdfurl: blobDataObject,
      zoomEnable: false,
      pageNum: false,
      backTop: false,
      scrollEnable: false,
      scale: pxit
    });
    pdf.value.on("complete", function () {
      complete();
    });
  });
}
/**
 * PDF 加载完成回调
 * @returns void
 * @description PDF 加载完成后绑定右键菜单事件
 */
function complete(): void {
  const el = document.getElementById(PDF_ID + "-pdf");
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
}
/**
 * 调整缩放比例
 * @param val - 缩放增量
 * @returns void
 * @description 根据增量调整 PDF 缩放比例
 */
const changePix = (val: number): void => {
  pxit = pxit + val;
  pdf.value.destroy(() => {
    createPdf();
  });
};
/**
 * 组件卸载前清理
 * @description 释放 blob URL 和销毁 PDF 实例
 */
onUnmounted(() => {
  if (blobDataObject) {
    window.URL.revokeObjectURL(blobDataObject);
  }
  pdf.value?.destroy();
});

defineExpose({ leftAll90: () => leftAll90(PDF_ID + "-pdf") });
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
      transition: var(--pa-component-animation, 0.3s);
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
        transition: var(--pa-component-animation, 0.3s);
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
