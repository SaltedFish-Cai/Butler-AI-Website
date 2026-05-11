---
title: Button E2E Test
---

<script setup>
import { ref } from 'vue'

const buttonClickCount = ref(0)

function handleButtonClick() {
  buttonClickCount.value++
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

<style scoped>
.button-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 16px 0;
}
</style>
