---
title: Color E2E Test
---

<script setup>
import { ref } from 'vue'

const colorValue = ref('#1890ff')
const colorChangeLog = ref('')

function handleColorChange(color) {
  colorChangeLog.value = color
}
</script>

## Basic Color Picker
<pa-color data-testid="color-basic" v-model="colorValue" />

## Color Picker with Alpha
<pa-color data-testid="color-alpha" v-model="colorValue" :use-alpha="true" />

## Color Picker without Alpha
<pa-color data-testid="color-no-alpha" v-model="colorValue" :use-alpha="false" />

## Color Picker without Input
<pa-color data-testid="color-no-input" v-model="colorValue" :use-input="false" />

## Disabled Color Picker
<pa-color data-testid="color-disabled" v-model="colorValue" disabled />

## Color Picker with Preset Colors
<pa-color 
  data-testid="color-preset" 
  v-model="colorValue" 
  :preset-colors="['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']"
/>

## Color Change Event
<pa-color data-testid="color-event" v-model="colorValue" @change="handleColorChange" />
<div data-testid="color-event-log">{{ colorChangeLog }}</div>

<style scoped>
div {
  margin: 16px 0;
}
</style>
