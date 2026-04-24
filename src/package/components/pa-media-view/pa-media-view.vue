<template>
  <div v-if="!hideBtn" class="flex m-hand">
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
              class="file-menu_item m-hand"
              :class="[index == viewIndex ? 'file-menu_item_action' : '']"
              @click="changeIndex(index)"
            >
              {{ item.fileName }}
            </div>
          </pa-scrollbar>
        </div>
        <div
          class="media-open-process m-hand"
          :class="[!processVisible ? '' : 'media-close-process']"
          @click="processVisible = !processVisible"
        >
          <pa-icon :name="!processVisible ? 'circle_arrow_right_line' : 'circle_arrow_left_line'"></pa-icon>
          {{ !processVisible ? languagePackage["expand"] : languagePackage["collapse"] }}
        </div>
      </div>
      <div class="m-media-page-body" v-if="show">
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
          <m-icon class="mr5" name="reset_line"></m-icon><span style="font-size: 12px">{{ languagePackage["rotateTip"] }}</span>
        </div>
        <m-icon name="minus_circle_line" class="m-hand" @click="handleMouseWheel({ deltaY: 1 })"></m-icon>
        <div
          style="font-size: 14px; width: 42px; text-align: center"
          class="pl5 ml5 mr5 m-hand-scroll"
          @mousewheel="handleMouseWheel"
          :title="languagePackage['zoomTip']"
        >
          {{ (zoomIndex * 100).toFixed(0) }}%
        </div>
        <m-icon name="add_circle_line" class="m-hand" @click="handleMouseWheel({ deltaY: -1 })"></m-icon>
      </div>
    </template>
  </pa-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, useTemplateRef, ComputedRef, inject } from "vue";
import { PaMediaViewType } from "./type";
import { isImageFile, isPdfFile, isTextFile, isWordFile, isExcelFile } from "./is";

import { useDownload } from "./use-download";
import imageView from "./image-view.vue";
import pdfView from "./pdf-view.vue";
import excelView from "./excel-view.vue";
import wordView from "./word-view.vue";
import textView from "./text-view.vue";
import { PancakeGlobalConfigType } from "../pa-manager/type";

const visible = ref(false);
const viewIndex = ref(0);
const zoomIndex = ref(1);
const show = ref(true);
// const startDistance = ref(0);
let scaleFactor = 1;
const processVisible = ref(true);

const pdfViewRef = useTemplateRef("pdfViewRef");

const props = withDefaults(defineProps<PaMediaViewType>(), {
  hideBtn: false
});

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package["media"] || {};
});

function openFile() {
  visible.value = true;
}

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

function changeIndex(index) {
  show.value = false;
  viewIndex.value = index;
  zoomIndex.value = 1;
  scaleFactor = 1;
  nextTick(() => {
    show.value = true;
  });
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
  pdfViewRef.value?.leftAll90();
}

// # Var 文件类型
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

// #Function 现在文件
function downFile() {
  const _viewIndex = viewIndex.value;
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  useDownload(config, props.fileList[_viewIndex]?.filePath, props.fileList[_viewIndex]?.fileName || "文件");
}

function downAll() {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  for (let i = 0; i < props.fileList.length; i++) {
    useDownload(config, props.fileList[i]?.filePath, props.fileList[i]?.fileName || "文件");
  }
}

function openVisible() {
  viewIndex.value = 0;
  show.value = true;
  visible.value = true;
}

function closeVisible() {
  viewIndex.value = 0;
  show.value = false;
  visible.value = false;
}

defineExpose({ openVisible, closeVisible });
</script>

<style lang="scss">
.pa-media-view-dialog {
  display: flex;
  height: 100%;
  .el-dialog__header {
    transition: var(--pa-animation-time, 0.2s);
  }
  .dialog__body {
    height: calc(100%) !important;
    padding: 0 !important;
  }
  .file-menu_box {
    position: relative;
    overflow: hidden;
    transition: all var(--pa-animation-time, 0.2s) ease;
    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      height: 100%;
      border-right: 1px solid var(--pa-color-primary);
    }
  }

  .m-media-page-body {
    width: calc(100%);
    flex: 1;
    height: 100%;
    background: var(--pa-color-default);
  }

  .zoom-box {
    font-size: var(--pa-size-font);
    .reset-btn {
      padding: 0 7px;
      border-radius: var(--pa-size-radius, 3px);
      cursor: pointer;
      transition: var(--pa-animation-time, 0.2s);
      border: 1px solid;
      .m-icon {
        font-size: var(--pa-size-font);
      }
      &:hover {
        color: var(--pa-color-white);
        border-color: var(--pa-color-primary);
        background-color: var(--pa-color-primary);
      }
    }
  }
  .file-menu {
    height: 100%;
    border-right: 1px solid var(--pa-color-border);
    .file-menu_item {
      padding: 5px 10px;
      font-weight: bold;
    }
    .file-menu_item_action {
      background-color: var(--pa-color-primary);
      color: var(--pa-color-white);
    }
  }

  .media-open-process {
    width: 24px;
    box-sizing: border-box;
    position: absolute;
    right: -23px;
    z-index: 2;
    bottom: 50%;
    background-color: var(--pa-color-primary);
    border: 1px solid var(--pa-color-primary);
    border-left: 0;
    line-height: 1.3em;
    color: var(--pa-color-white);
    border-top-right-radius: 4px;
    font-weight: bold;
    border-bottom-right-radius: 4px;
    padding: 5px;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    user-select: none; /* 标准语法 */
    z-index: 30;
  }

  .media-close-process {
    background-color: var(--pa-color-white);
    color: var(--pa-color-primary);
  }

  &:has(.file-menu .is-vertical .el-scrollbar__thumb[style*="height"]) {
    .media-close-process {
      right: -23px;
      background-color: var(--pa-color-border);
    }
    // .close-process {
    //   color: var(--pa-color-primary) !important;
    // }
  }
}

.pa-media-view-dialog_visible {
  .el-dialog__header {
    padding-left: 280px !important;
  }
}
</style>
