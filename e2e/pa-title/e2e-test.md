---
title: Title E2E Test
---

<script setup>
import { ref } from 'vue'

const titleText = ref('主标题')
const tipsText = ref('提示信息')
</script>

## Basic Title
<pa-title data-testid="title-basic">主标题</pa-title>

## Title with Tips
<pa-title data-testid="title-tips" tips="这是一个提示">
  带提示的标题
</pa-title>

## Title with Tips Position Right
<pa-title data-testid="title-tips-right" tips="右侧提示" tips-position="right">
  提示在右侧
</pa-title>

## Title with Default Style Mode
<pa-title data-testid="title-default" style-mode="default">
  默认样式模式
</pa-title>

## Title with Horizontal Style Mode
<pa-title data-testid="title-horizontal" style-mode="horizontal">
  水平样式模式
</pa-title>

## Title with Vertical Style Mode
<pa-title data-testid="title-vertical" style-mode="vertical">
  垂直样式模式
</pa-title>

## Title with Line Config
<pa-title data-testid="title-line" :line-config="true">
  带分隔线
</pa-title>

## Title with Padding
<pa-title data-testid="title-padding" :padding="['top', 'bottom']">
  带内边距
</pa-title>

## Title with Custom Line Config
<pa-title 
  data-testid="title-custom-line" 
  :line-config="{ height: '5px', borderColor: '#ff0000' }"
>
  自定义分隔线
</pa-title>

## Title with Tips Slot
<pa-title data-testid="title-tips-slot" tips-position="right">
  使用插槽
  <template #tips>插槽提示内容</template>
</pa-title>

<style scoped>
div {
  margin: 16px 0;
}
</style>
