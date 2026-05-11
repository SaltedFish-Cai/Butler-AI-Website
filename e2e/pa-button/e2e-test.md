---
title: Button E2E Test
---

<script setup>
import { ref } from 'vue'

// 点击事件测试计数
const buttonClickCount = ref(0)
function handleButtonClick() {
  buttonClickCount.value++
}

// 防抖测试计数（独立）
const debounceClickCount = ref(0)
function handleDebounceClick() {
  debounceClickCount.value++
}

// 确认事件计数（独立）
const confirmClickCount = ref(0)
function handleConfirmClick() {
  confirmClickCount.value++
}

// 提交事件计数（独立）
const submitClickCount = ref(0)
function handleSubmitClick() {
  submitClickCount.value++
}

// 删除事件计数（独立）
const deleteClickCount = ref(0)
function handleDeleteClick() {
  deleteClickCount.value++
}
</script>

## Basic Buttons
<div class="button-row">
  <pa-button data-testid="btn-primary" type="primary">Primary</pa-button>
  <pa-button data-testid="btn-success" type="success">Success</pa-button>
  <pa-button data-testid="btn-warning" type="warning">Warning</pa-button>
  <pa-button data-testid="btn-danger" type="danger">Danger</pa-button>
  <pa-button data-testid="btn-info" type="info">Info</pa-button>
</div>

## Button Sizes
<div class="button-row">
  <pa-button size="large" data-testid="btn-large">Large</pa-button>
  <pa-button size="medium" data-testid="btn-medium">Medium</pa-button>
  <pa-button size="small" data-testid="btn-small">Small</pa-button>
</div>

## Disabled Button
<pa-button disabled data-testid="btn-disabled">Disabled</pa-button>

## Loading Button
<pa-button loading data-testid="btn-loading">Loading</pa-button>

## Button with Icon
<pa-button icon-name="search_line" data-testid="btn-with-icon">Search</pa-button>

## Clickable Button
<pa-button data-testid="btn-clickable" @click="handleButtonClick">Click Me</pa-button>
<span data-testid="btn-click-count">{{ buttonClickCount }}</span>

## Plain vs Non-Plain Buttons
<div class="button-row">
  <pa-button type="primary" use-plain data-testid="btn-plain">Plain</pa-button>
  <pa-button type="primary" :use-plain="false" data-testid="btn-non-plain">Non-Plain</pa-button>
</div>

## Preset Style Buttons (is prop)
<div class="button-row">
  <pa-button is="add" data-testid="btn-is-add">Add</pa-button>
  <pa-button is="delete" data-testid="btn-is-delete">Delete</pa-button>
  <pa-button is="edit" data-testid="btn-is-edit">Edit</pa-button>
  <pa-button is="search" data-testid="btn-is-search">Search</pa-button>
</div>

## Icon Position
<div class="button-row">
  <pa-button icon-name="search_line" icon-position="left" data-testid="btn-icon-left">Left Icon</pa-button>
  <pa-button icon-name="search_line" icon-position="right" data-testid="btn-icon-right">Right Icon</pa-button>
</div>

## Underline Button (useLine)
<pa-button use-line data-testid="btn-underline">Underline Button</pa-button>

## Text Attribute Button
<pa-button text="Text Prop Button" data-testid="btn-text-prop" />

## useFont Toggle
<div class="button-row">
  <pa-button is="add" :use-font="true" data-testid="btn-use-font-true">With Font</pa-button>
  <pa-button is="add" :use-font="false" data-testid="btn-use-font-false">No Font</pa-button>
</div>

## Default Type Button
<pa-button data-testid="btn-default-type">Default</pa-button>

## Debounced Toggle
<div class="button-row">
  <pa-button :debounced="true" data-testid="btn-debounced-true">Debounced</pa-button>
  <pa-button :debounced="false" data-testid="btn-debounced-false">Not Debounced</pa-button>
</div>

## Debounce Effect Test
<pa-button :debounced="true" :debounced-time="300" data-testid="btn-debounce-effect" @click="handleDebounceClick">Debounce Test</pa-button>
<span data-testid="debounce-click-count">{{ debounceClickCount }}</span>

## submitClick Event (is="file")
<pa-button is="file" data-testid="btn-submit-event" @submit-click="handleSubmitClick">Submit</pa-button>
<span data-testid="submit-click-count">{{ submitClickCount }}</span>

## deleteClick Event (is="trash")
<pa-button is="trash" data-testid="btn-delete-event" @delete-click="handleDeleteClick">Delete</pa-button>
<span data-testid="delete-click-count">{{ deleteClickCount }}</span>

## confirmClick Event with Dialog
<pa-button is="ok" data-testid="btn-confirm-event" @confirm-click="handleConfirmClick">Confirm</pa-button>
<span data-testid="confirm-click-count">{{ confirmClickCount }}</span>

## confirmConfig Prop
<pa-button data-testid="btn-confirm-config" :confirm-config="{ title: 'Confirm', message: 'Are you sure?' }">With ConfirmConfig</pa-button>

<style scoped>
.button-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 16px 0;
}
</style>