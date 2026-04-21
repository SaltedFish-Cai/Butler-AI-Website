<template>
  <m-scrollbar always noPadding>
    <div class="word-view-body">
      <div ref="docxRef" class="word-view-body_pre" :style="{ '--word-view-body_zoom': zoom }"></div>
    </div>
  </m-scrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, ComputedRef } from "vue";
import { useGetBlob } from "./use-download";
import { PancakeGlobalConfigType } from "../pa-manager/type";

const props = withDefaults(defineProps<{ filePath: string; zoom: number }>(), {});
const textUrl = String(props.filePath);

const docxRef = ref();
const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

onMounted(async () => {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  const blob = await useGetBlob(config, textUrl);
  if (blob) {
    const myDocxPreviewer = window.jsPreviewDocx.init(docxRef.value);
    myDocxPreviewer
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
.word-view-body {
  width: 100%;
  min-height: 100%;
  background: gray;

  .word-view-body_pre {
    overflow: scroll;
    height: calc(100% - 0px);
    width: 100%;
    zoom: var(--word-view-body_zoom);
    .vue-office-docx-main,
    .docx-wrapper {
      width: 100%;
      display: block;
      margin: 0 auto !important;
      height: 100%;
    }
    .docx-wrapper {
      padding: 30px !important;
      width: initial !important;
    }
    .docx {
      width: 100% !important;
      max-width: calc(780px) !important;
      padding: 50px 80px !important;
      margin: 0 auto !important;
      zoom: var(--word-view-body_zoom);
    }
    p {
      line-height: initial !important;
    }
    div,
    img,
    p {
      width: 100% !important;
    }
  }
}
</style>
