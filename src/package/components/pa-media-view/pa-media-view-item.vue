<template>
  <div class="pa-media-view-download-file">
    <div @click="openFile" class="pa-media-view-download-file_name flex-center-start pa-hand pr-size">
      <pa-icon :name="'attachment_line'" class="ml-size mr-size" />
      <slot>
        <div style="white-space: initial; width: 100%">{{ fileName || file?.OriginalName || file?.FileName }}</div>
      </slot>
    </div>
    <div class="flex-center down-file pa-hand" @click="downFile">
      <pa-icon name="download_line" />
      {{ languagePackage["download"] }}
    </div>
  </div>
  <pa-dialog
    v-model="visible"
    :subTitle="file?.OriginalName || file?.FileName"
    :title="languagePackage['fileDetail']"
    size="max"
    :scroll="false"
  >
    <div class="pa-media-page-body">
      <imageView v-if="fileType == 'image'" :filePath="filePath" v-model="zoomIndex" ref="viewRef"></imageView>
      <pdfView v-else-if="fileType == 'pdf'" :filePath="filePath" :zoom="zoomIndex" ref="viewRef"></pdfView>
      <excel-view v-else-if="fileType == 'excel'" :filePath="filePath" :zoom="zoomIndex"></excel-view>
      <word-view v-if="fileType == 'word'" :filePath="filePath" :zoom="zoomIndex"></word-view>
      <textView v-else-if="fileType == 'text'" :filePath="filePath" :zoom="zoomIndex"></textView>
    </div>
    <template #footer>
      <div class="flex-center" style="position: relative">
        <pa-button :id="id + '-download'" is="download" type="primary" @click="downFile">
          {{ languagePackage["download"] }}
        </pa-button>
      </div>
    </template>
    <template #footerRight>
      <div class="flex-center zoom-box" v-if="fileType == 'pdf' || fileType == 'image'">
        <div class="flex-center mr-size reset-btn" @click="reset90" v-if="fileType == 'pdf' || fileType == 'image'">
          <pa-icon class="mr5" name="reset_line"></pa-icon>
          <span style="font-size: 12px">{{ languagePackage["rotate"] }}</span>
        </div>
        <pa-icon name="minus_circle_line" class="pa-hand" @click="handleMouseWheel({ deltaY: 1 })"></pa-icon>
        <div
          style="font-size: 14px; width: 42px; text-align: center"
          class="pl5 ml5 mr5 pa-hand-scroll"
          @mousewheel="handleMouseWheel"
          :title="languagePackage['zoom']"
        >
          {{ (zoomIndex * 100).toFixed(0) }}%
        </div>
        <pa-icon name="add_circle_line" class="pa-hand" @click="handleMouseWheel({ deltaY: -1 })"></pa-icon>
      </div>
    </template>
  </pa-dialog>
</template>

<script lang="ts" setup name="PaMediaViewItem">
/**
 * Vue 核心响应式 API
 * @description Vue 核心响应式 API
 */
import { ref, computed, watch, inject, ComputedRef } from "vue";
/**
 * 媒体查看器子项组件 Props 类型
 * @description 媒体查看器子项组件 Props 类型
 */
import type { ComponentItemProps } from "./types";
/**
 * 文件类型判断工具
 * @description 文件类型判断工具
 */
import { isImageFile, isPdfFile, isTextFile, isWordFile, isExcelFile, isUnOpenFile } from "./is";
/**
 * 文件下载工具
 * @description 文件下载工具
 */
import { useDownload } from "./use-download";
/**
 * 图片预览组件
 * @description 图片预览组件
 */
import imageView from "./image-view.vue";
/**
 * PDF 预览组件
 * @description PDF 预览组件
 */
import pdfView from "./pdf-view.vue";
/**
 * Excel 预览组件
 * @description Excel 预览组件
 */
import excelView from "./excel-view.vue";
/**
 * Word 预览组件
 * @description Word 预览组件
 */
import wordView from "./word-view.vue";
/**
 * 文本预览组件
 * @description 文本预览组件
 */
import textView from "./text-view.vue";
/**
 * 模板引用 API
 * @description 模板引用 API
 */
import { useTemplateRef } from "vue";
/**
 * 全局配置类型
 * @description 全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 消息反馈组件
 * @description 消息反馈组件
 */
import { M_Message } from "../feedback";
/**
 * 全局配置注入
 * @description 全局配置注入
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 对话框是否可见
 * @description 对话框是否可见
 */
const visible = ref(false);
/**
 * 缩放比例
 * @description 缩放比例
 */
const zoomIndex = ref(1);
/**
 * 缩放因子
 * @description 缩放因子
 */
let scaleFactor = 1;
/**
 * 预览组件引用
 * @description 预览组件引用
 */
const viewRef = useTemplateRef("viewRef");
/**
 * 组件 Props
 * @description 组件 Props
 */
const props = withDefaults(defineProps<ComponentItemProps>(), {});
/**
 * 语言包
 * @description 语言包
 */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package["cell"] || {};
});
/**
 * 打开文件预览
 * @returns void
 * @description 判断文件类型后打开预览，不支持则提示
 */
function openFile(): void {
  const _fileName = props.fileName || props?.file?.OriginalName || props?.file?.FileName;
  if (isUnOpenFile(_fileName)) {
    M_Message.warning(languagePackage.value["errorText"]);
    return;
  }
  visible.value = true;
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
 * @description 调用预览组件的旋转方法
 */
function reset90(): void {
  viewRef.value?.leftAll90();
}
/**
 * 当前文件类型
 * @description 当前文件类型
 */
const fileType = computed(() => {
  if (isImageFile(props.filePath)) {
    return "image";
  } else if (isPdfFile(props.filePath)) {
    return "pdf";
  } else if (isTextFile(props.filePath)) {
    return "text";
  } else if (isWordFile(props.filePath)) {
    return "word";
  } else if (isExcelFile(props.filePath)) {
    return "excel";
  }
  return "";
});
/**
 * 下载当前文件
 * @returns void
 * @description 下载当前文件
 */
function downFile(): void {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  if (props.filePath)
    useDownload(config, props.filePath, props.fileName || props?.file?.OriginalName || props?.file?.FileName || "文件");
}
/**
 * @description 监听缩放比例变化，同步缩放因子
 */
watch(
  () => zoomIndex.value,
  data => {
    scaleFactor = data;
  },
  { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
