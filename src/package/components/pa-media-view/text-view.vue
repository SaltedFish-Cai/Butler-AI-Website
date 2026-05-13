<template>
  <m-scrollbar always noPadding ref="scrollRef">
    <div class="text-view-body">
      <div class="text-wrapper" :style="{ zoom: zoom }">
        <pre class="text-view-body_pre">{{ mediaText }}</pre>
      </div>
    </div>
  </m-scrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, ComputedRef } from "vue";
import { useGetBlob } from "./use-download";
import { PancakeGlobalConfigType } from "../pa-manager/types";

const props = withDefaults(defineProps<{ filePath: string; zoom: number }>(), {});
const textUrl = String(props.filePath);
/**
 * 媒体文本内容
 * @description 当前加载的文本文件内容
 */
const mediaText = ref("");
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 组件挂载后加载文本
 * @description 获取文件 blob 并读取为文本内容
 */
onMounted(async () => {
  const config = {
    requestHeader: PancakeGlobalConfig.value?.requestHeader,
    downloadHose: PancakeGlobalConfig.value?.file_config?.downloadHose || ""
  };
  const blob = await useGetBlob(config, textUrl);
  if (blob) {
    const reader = new FileReader();
    reader.onload = function () {
      mediaText.value = String(reader.result);
    };
    if (blob) reader.readAsText(blob);
  }
});
</script>

<style lang="scss">
.text-view-body {
  position: relative;
  width: 100%;
  height: max-content;
  min-height: 100%;

  background: gray;
  padding: 30px;
  .text-wrapper {
    margin: auto;
    background-color: #fff;
    max-width: 780px;
    min-height: 100%;
  }

  .text-view-body_pre {
    padding: 10px;
    width: calc(100%);
    height: calc(100%);
    margin: 0;
    min-height: 100%;
  }
}
</style>
