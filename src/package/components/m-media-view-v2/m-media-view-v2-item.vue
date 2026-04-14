<template>
  <div class="m-media-view-v2-download-file">
    <div @click="openFile" class="m-media-view-v2-download-file_name flex-center-start m-hand pr-size-v2">
      <m-icon-v2 :name="'attachment_line'" class="ml-size-v2 mr-size-v2" />
      <slot>
        <div style="white-space: initial; width: 100%">{{ file?.fileName }}</div>
      </slot>
    </div>
    <div class="flex-center down-file m-hand" @click="downFile">
      <m-icon-v2 name="download_line" />
      {{ languagePackage["download"] }}
    </div>
  </div>

  <m-dialog-v2
    v-model="visible"
    :subTitle="file?.OriginalName || file?.FileName"
    :title="languagePackage['fileDetail']"
    size="max"
    :scroll="false"
  >
    <div class="m-media-v2-page-body">
      <imageView v-if="fileType == 'image'" :filePath="filePath" v-model="zoomIndex" ref="viewRef"></imageView>
      <pdfView v-else-if="fileType == 'pdf'" :filePath="filePath" :zoom="zoomIndex" ref="viewRef"></pdfView>
      <office-view v-if="fileType == 'word' || fileType == 'excel'" :filePath="filePath" :zoom="zoomIndex"></office-view>
      <textView v-else-if="fileType == 'text'" :filePath="filePath" :zoom="zoomIndex"></textView>
    </div>
    <template #footer>
      <div class="flex-center" style="position: relative">
        <m-button-v2 :id="id + '-download'" is="download" type="primary" @click="downFile">
          {{ languagePackage["download"] }}
        </m-button-v2>
      </div>
    </template>
    <template #footerRight>
      <div class="flex-center zoom-box" v-if="fileType == 'pdf' || fileType == 'image'">
        <div class="flex-center mr-size reset-btn" @click="reset90" v-if="fileType == 'pdf' || fileType == 'image'">
          <m-icon-v2 class="mr5" name="reset_line"></m-icon-v2
          ><span style="font-size: 12px">{{ languagePackage["rotate"] }}</span>
        </div>
        <m-icon-v2 name="minus_circle_line" class="m-hand" @click="handleMouseWheel({ deltaY: 1 })"></m-icon-v2>
        <div
          style="font-size: 14px; width: 42px; text-align: center"
          class="pl5 ml5 mr5 m-hand-scroll"
          @mousewheel="handleMouseWheel"
          :title="languagePackage['zoom']"
        >
          {{ (zoomIndex * 100).toFixed(0) }}%
        </div>
        <m-icon-v2 name="add_circle_line" class="m-hand" @click="handleMouseWheel({ deltaY: -1 })"></m-icon-v2>
      </div>
    </template>
  </m-dialog-v2>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, ComputedRef } from "vue";
import { MMediaViewV2ItemType } from "./type";
import { isImageFile, isPdfFile, isTextFile, isWordFile, isExcelFile, isUnOpenFile } from "./is";
import { ElMessage } from "element-plus";

import { useDownload } from "./use-download";
import imageView from "./image-view.vue";
import pdfView from "./pdf-view.vue";
import officeView from "./office-view.vue";
import textView from "./text-view.vue";
import { useTemplateRef } from "vue";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;

const visible = ref(false);
const zoomIndex = ref(1);
// const startDistance = ref(0);
let scaleFactor = 1;

const viewRef = useTemplateRef("viewRef");

const props = withDefaults(defineProps<MMediaViewV2ItemType>(), {});

// function getDistance(touches) {
//   const dx = touches[0].clientX - touches[1].clientX;
//   const dy = touches[0].clientY - touches[1].clientY;
//   return Math.sqrt(dx * dx + dy * dy);
// }

// function handleTouchMove(event) {
//   if (event.touches.length === 2) {
//     const currentDistance = getDistance(event.touches);
//     handleMouseWheel({ deltaY: startDistance.value - currentDistance });
//   }
// }

const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package["cell"] || {};
});

function openFile() {
  const fileName = props.fileName || props?.file?.OriginalName || props?.file?.FileName;
  if (isUnOpenFile(fileName)) {
    return ElMessage.warning(languagePackage.value["errorText"]);
  }
  visible.value = true;
}

// #Function 滚轮缩放
function handleMouseWheel(event) {
  let _zoomIndex = event.deltaY < 0 ? scaleFactor + 0.02 : scaleFactor - 0.02;
  if (_zoomIndex < 0.3) _zoomIndex = 0.3;
  if (_zoomIndex > 1.7) _zoomIndex = 1.7;
  zoomIndex.value = _zoomIndex;
  scaleFactor = _zoomIndex;
}

function reset90() {
  viewRef.value?.leftAll90();
}

// # Var 文件类型
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

// #Function 现在文件
function downFile() {
  const config = {
    requestHeader: ManagerGlobalConfig.value?.requestHeader,
    downloadHose: ManagerGlobalConfig.value?.file_config?.downloadHose || ""
  };
  if (props.filePath)
    useDownload(config, props.filePath, props.fileName || props?.file?.OriginalName || props?.file?.FileName || "文件");
}

watch(
  () => zoomIndex.value,
  data => {
    scaleFactor = data;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.m-media-view-v2-download-file {
  display: flex;
  width: max-content;
  max-width: 100%;
  border: 1px solid var(--m-color-v2-border);
  border-radius: var(--m-size-v2-radius);
  margin: 3px 3px 3px 0;
  font-size: var(--m-size-v2-font);
  background-color: var(--m-color-v2-bg);

  > .m-media-view-v2-download-file_name {
    flex: 1;
    width: max-content;
    padding: calc(var(--m-size-v2-padding) / 4) calc(var(--m-size-v2-padding) / 1.5) !important;
    padding-left: 0 !important;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    line-height: 1.2em;
    & > * {
      word-break: break-all;
    }
  }
  .down-file {
    font-size: calc(var(--m-size-v2-font) - 2px);
    transition: var(--m-size-v2-animation, 0.3s);
    padding: 0 calc(var(--m-size-v2-padding) / 1.5);
    border-left: 1px solid var(--m-color-v2-border);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .download-file_text {
    word-break: break-all;
    display: inline-block;
    white-space: pre-line;
  }

  .remove-btn {
    font-size: var(--m-size-v2-font);
  }
}

.m-media-v2-page-body {
  width: 100%;
  height: 100%;
  background: gray;
}
</style>
