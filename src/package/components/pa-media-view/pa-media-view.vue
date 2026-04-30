<template>
  <div v-if="!hideBtn" class="flex pa-hand">
    <slot>
      <pa-button is="view" @click="openFile">{{ languagePackage["filePreview"] }}</pa-button>
    </slot>
  </div>
  <pa-dialog
    v-model="visible"
    :title="fileList[viewIndex]?.OriginalName || fileList[viewIndex]?.FileName"
    size="max"
    class="pa-media-view-dialog"
    :scroll="false"
    :class="[processVisible ? 'pa-media-view-dialog_visible' : '']"
    @closed="show = false"
  >
    <div class="pa-media-view-dialog">
      <div
        style="position: relative; display: flex; transition: all var(--pa-animation-time, 0.2s) ease"
        :style="{ flex: processVisible ? '0 0 300px' : '0 0 0', width: processVisible ? '' : '0' }"
      >
        <div class="file-menu_box" :style="{ flex: processVisible ? '0 0 300px' : '0 0 0' }">
          <pa-scrollbar class="file-menu" always :useScrollX="false">
            <div
              v-for="(item, index) in fileList"
              :key="item.filePath"
              class="file-menu_item pa-hand"
              :class="[index == viewIndex ? 'file-menu_item_action' : '']"
              @click="changeIndex(index)"
            >
              {{ item.fileName }}
            </div>
          </pa-scrollbar>
        </div>
        <div
          class="media-open-process pa-hand"
          :class="[!processVisible ? '' : 'media-close-process']"
          @click="processVisible = !processVisible"
        >
          <pa-icon :name="!processVisible ? 'circle_arrow_right_line' : 'circle_arrow_left_line'"></pa-icon>
          {{ !processVisible ? languagePackage["expand"] : languagePackage["collapse"] }}
        </div>
      </div>
      <div class="pa-media-page-body" v-if="show">
        <imageView v-if="fileType == 'image'" :filePath="fileList[viewIndex]?.filePath" v-model="zoomIndex"></imageView>
        <pdfView
          v-else-if="fileType == 'pdf'"
          :filePath="fileList[viewIndex]?.filePath"
          :zoom="zoomIndex"
          ref="pdfViewRef"
        ></pdfView>
        <excel-view v-else-if="fileType == 'excel'" :filePath="fileList[viewIndex]?.filePath" :zoom="zoomIndex"></excel-view>
        <word-view v-if="fileType == 'word'" :filePath="fileList[viewIndex]?.filePath" :zoom="zoomIndex"></word-view>
        <textView v-else-if="fileType == 'text'" :filePath="fileList[viewIndex]?.filePath" :zoom="zoomIndex"></textView>
      </div>
    </div>
    <template #footer>
      <div class="flex-center" style="position: relative">
        <slot name="downloadBody">
          <slot name="downloadItem">
            <pa-button is="download" type="primary" @click="downFile">{{ languagePackage["downloadCurrentFile"] }}</pa-button>
          </slot>
          <slot name="downloadAll">
            <pa-button is="download" @click="downAll">{{ languagePackage["downloadAllFiles"] }}</pa-button>
          </slot>
        </slot>
      </div>
    </template>
    <template #footerRight>
      <div class="flex-center zoom-box">
        <div class="flex-center mr-size reset-btn" @click="reset90" v-if="fileType == 'pdf'">
          <pa-icon class="mr5" name="reset_line"></pa-icon><span style="font-size: 12px">{{ languagePackage["rotateTip"] }}</span>
        </div>
        <pa-icon name="minus_circle_line" class="pa-hand" @click="handleMouseWheel({ deltaY: 1 })"></pa-icon>
        <div
          style="font-size: 14px; width: 42px; text-align: center"
          class="pl5 ml5 mr5 pa-hand-scroll"
          @mousewheel="handleMouseWheel"
          :title="languagePackage['zoomTip']"
        >
          {{ (zoomIndex * 100).toFixed(0) }}%
        </div>
        <pa-icon name="add_circle_line" class="pa-hand" @click="handleMouseWheel({ deltaY: -1 })"></pa-icon>
      </div>
    </template>
  </pa-dialog>
</template>

<script lang="ts" setup name="PaMediaView">
/** @description Vue 核心响应式 API */
import { ref, computed, nextTick, useTemplateRef, ComputedRef, inject } from "vue";
/** @description 媒体查看器组件 Props 类型 */
import type { ComponentProps } from "./types";
/** @description 文件类型判断工具 */
import { isImageFile, isPdfFile, isTextFile, isWordFile, isExcelFile } from "./is";
/** @description 文件下载工具 */
import { useDownload } from "./use-download";
/** @description 图片预览组件 */
import imageView from "./image-view.vue";
/** @description PDF 预览组件 */
import pdfView from "./pdf-view.vue";
/** @description Excel 预览组件 */
import excelView from "./excel-view.vue";
/** @description Word 预览组件 */
import wordView from "./word-view.vue";
/** @description 文本预览组件 */
import textView from "./text-view.vue";
/** @description 全局配置类型 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/** @description 媒体查看器组件样式 */
import "./index.scss";
/** @description 对话框是否可见 */
const visible = ref(false);
/** @description 当前查看的文件索引 */
const viewIndex = ref(0);
/** @description 缩放比例 */
const zoomIndex = ref(1);
/** @description 是否显示内容区域 */
const show = ref(true);
/** @description 缩放因子 */
let scaleFactor = 1;
/** @description 文件目录面板是否可见 */
const processVisible = ref(true);
/** @description PDF 预览组件引用 */
const pdfViewRef = useTemplateRef("pdfViewRef");
/** @description 组件 Props */
const props = withDefaults(defineProps<ComponentProps>(), {
  hideBtn: false
});
/** @description 全局配置注入 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/** @description 语言包 */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package["media"] || {};
});
/**
 * 打开文件预览
 * @returns void
 * @description 设置对话框可见
 */
function openFile(): void {
  visible.value = true;
}
/**
 * 切换查看的文件索引
 * @param index - 文件索引
 * @returns void
 * @description 切换文件并重置缩放
 */
function changeIndex(index: number): void {
  show.value = false;
  viewIndex.value = index;
  zoomIndex.value = 1;
  scaleFactor = 1;
  nextTick(() => {
    show.value = true;
  });
}
/**
 * 处理滚轮缩放
 * @param event - 滚轮事件对象
 * @returns void
 * @description 根据滚轮方向调整缩放比例
 */
function handleMouseWheel(event: { deltaY: number }): void {
  let _zoomIndex = event.deltaY < 0 ? scaleFactor + 0.02 : scaleFactor - 0.02;
  if (_zoomIndex < 0.3) _zoomIndex = 0.3;
  if (_zoomIndex > 1.7) _zoomIndex = 1.7;
  zoomIndex.value = _zoomIndex;
  scaleFactor = _zoomIndex;
}
/**
 * 重置旋转90度
 * @returns void
 * @description 调用 PDF 组件的旋转方法
 */
function reset90(): void {
  pdfViewRef.value?.leftAll90();
}
/** @description 当前文件类型 */
const fileType = computed(() => {
  const _viewIndex = viewIndex.value;
  if (isImageFile(props.fileList[_viewIndex]?.filePath)) {
    return "image";
  } else if (isPdfFile(props.fileList[_viewIndex]?.filePath)) {
    return "pdf";
  } else if (isTextFile(props.fileList[_viewIndex]?.filePath)) {
    return "text";
  } else if (isWordFile(props.fileList[_viewIndex]?.filePath)) {
    return "word";
  } else if (isExcelFile(props.fileList[_viewIndex]?.filePath)) {
    return "excel";
  }
  return "";
});
/**
 * 下载当前文件
 * @returns void
 * @description 下载当前查看的文件
 */
function downFile(): void {
  const _viewIndex = viewIndex.value;
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  useDownload(config, props.fileList[_viewIndex]?.filePath, props.fileList[_viewIndex]?.fileName || "文件");
}
/**
 * 下载所有文件
 * @returns void
 * @description 下载文件列表中的所有文件
 */
function downAll(): void {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  for (let i = 0; i < props.fileList.length; i++) {
    useDownload(config, props.fileList[i]?.filePath, props.fileList[i]?.fileName || "文件");
  }
}
/**
 * 外部调用：打开预览
 * @returns void
 * @description 重置索引并打开对话框
 */
function openVisible(): void {
  viewIndex.value = 0;
  show.value = true;
  visible.value = true;
}
/**
 * 外部调用：关闭预览
 * @returns void
 * @description 关闭对话框并重置状态
 */
function closeVisible(): void {
  viewIndex.value = 0;
  show.value = false;
  visible.value = false;
}
defineExpose({ openVisible, closeVisible });
</script>
