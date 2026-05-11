---
title: Empty E2E Test
---

<script setup>
import { ref } from 'vue'

const customMessage = ref('没有找到任何内容')
</script>

## Basic Empty State
<pa-empty data-testid="empty-basic" />

## Empty with Default Message
<pa-empty data-testid="empty-default" message="暂无数据" />

## Empty with Custom Message
<pa-empty data-testid="empty-custom" :message="customMessage" />

## Empty with Custom Icon
<pa-empty data-testid="empty-icon" icon="file_unknow_line" />

## Empty with Different Icon
<pa-empty data-testid="empty-icon-search" icon="search_line" message="未找到搜索结果" />

## Empty with Long Message
<pa-empty data-testid="empty-long" message="这是一个较长的提示信息，用于展示当没有数据时的空状态显示效果" />

<style scoped>
div {
  margin: 16px 0;
}
</style>
