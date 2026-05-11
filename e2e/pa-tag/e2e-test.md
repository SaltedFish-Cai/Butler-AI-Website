---
title: Tag E2E Test
---

<script setup>
import { ref } from 'vue'

const tagList = ref([
  { label: '标签1', value: 1 },
  { label: '标签2', value: 2 },
  { label: '标签3', value: 3 }
])

const removedTag = ref(null)

function handleRemoveTag(data) {
  removedTag.value = data
  // 从列表中移除
  tagList.value = tagList.value.filter(t => t.value !== data.value)
}
</script>

## Basic Tags
<pa-tag 
  data-testid="tag-basic" 
  :tag-list="tagList" 
  @remove-tag="handleRemoveTag"
/>

## Tags without Collapse
<pa-tag 
  data-testid="tag-no-collapse" 
  :tag-list="tagList" 
  :use-collapse="false"
/>

## Disabled Tags
<pa-tag 
  data-testid="tag-disabled" 
  :tag-list="tagList" 
  disabled
/>

## Tags with Custom Popover Width
<pa-tag 
  data-testid="tag-popover-width" 
  :tag-list="tagList" 
  :popover-width="200"
/>

## Single Tag
<pa-tag 
  data-testid="tag-single" 
  :tag-list="[{ label: '单个标签', value: 1 }]"
/>

## Empty Tags
<pa-tag 
  data-testid="tag-empty" 
  :tag-list="[]"
/>

## Remove Tag Event
<div data-testid="tag-removed">{{ removedTag ? removedTag.label : 'none' }}</div>

<style scoped>
div {
  margin: 16px 0;
}
</style>
