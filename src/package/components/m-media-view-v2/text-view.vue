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
import { ref, onMounted } from "vue";

const props = withDefaults(defineProps<{ filePath: string; zoom: number }>(), {});
const textUrl = String(props.filePath);

const mediaText = ref("");

onMounted(async () => {
  try {
    // 构建完整URL
    const fullUrl = textUrl;

    // 直接通过fetch获取文本内容
    const response = await fetch(fullUrl, {
      method: "GET"
    });

    if (!response.ok) {
      mediaText.value = `读取文件失败: ${response.statusText}`;
      return;
    }

    // 检查是否是JSON错误响应
    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      const json = await response.json();
      mediaText.value = `服务器错误: ${json.Message || "未知错误"}`;
      return;
    }

    // 直接获取并显示文本内容
    mediaText.value = await response.text();
  } catch (error) {
    console.error("读取文本文件时出错:", error);
    mediaText.value = `读取文件失败: ${error instanceof Error ? error.message : "未知错误"}`;
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
