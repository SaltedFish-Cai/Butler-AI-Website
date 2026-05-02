<template>
  <div class="flex-col excel-view-body" ref="excelRef"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, ComputedRef } from "vue";
import { useGetBlob } from "./use-download";
import { PancakeGlobalConfigType } from "../pa-manager/types";

const props = withDefaults(defineProps<{ filePath: string; zoom: number }>(), {});
const textUrl = String(props.filePath);

// # Excel
const excelRef = ref();
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

onMounted(async () => {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  const blob = await useGetBlob(config, textUrl);
  if (blob) {
    const myExcelPreviewer = window.jsPreviewExcel.init(excelRef.value, {
      xls: false,
      widthOffset: 10,
      heightOffset: 10
    });
    myExcelPreviewer
      .preview(blob)
      .then(res => {
        console.log("预览完成", res);
      })
      .catch(e => {
        console.log("预览失败", e);
      });
  }
});
</script>

<style lang="scss">
.excel-view-body {
  width: calc(100%);
  height: 100%;
  box-sizing: border-box;

  ::-webkit-scrollbar-track {
    padding: 2px 0;
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: var(--el-color-info-light-1);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--el-color-primary);
    cursor: pointer;
  }

  .x-spreadsheet-scrollbar {
    opacity: 1;
  }
  .x-spreadsheet-sheet {
    position: relative;
    ::-webkit-scrollbar {
      display: block;
      width: 15px;
      height: 15px;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      right: 0;
      width: 15px;
      height: 15px;
      z-index: 1;
      background-color: #f4f5f8;
      border-top: 1px solid #ddd;
      border-left: 1px solid #ddd;
    }
  }

  .x-spreadsheet-menu {
    li {
      transition: var(--pa-component-animation, 0.3s);
    }
    > li.active {
      color: var(--el-color-primary);
    }
  }
}
</style>
