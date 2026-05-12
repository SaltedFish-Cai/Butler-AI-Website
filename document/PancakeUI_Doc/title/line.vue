<template>
  <pa-title style-mode="default" line-config>默认下划线样式</pa-title>
  <div class="block"></div>
  <pa-title style-mode="default" :line-config="lineConfig">自定义分割线样式</pa-title>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref } from "vue";
/**
 * 自定义分割线配置
 * @description 用于演示自定义分割线样式
 */
const lineConfig = ref({ borderColor: "var(--pa-color-success)", height: "5px", borderStyle: "dashed" });
</script>

<style scoped>
.block {
  height: 30px;
}
</style>
