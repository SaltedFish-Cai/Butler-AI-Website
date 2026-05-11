---
title: Select Icon E2E Test
---

<script setup>
import { ref } from 'vue'

const iconValue = ref('search_line')
const changeEvents = ref([])

function handleChange(data) {
  changeEvents.value.push(data)
}
</script>

## Basic Icon Select
<div class="test-section">
  <pa-select-icon 
    v-model="iconValue" 
    data-testid="select-icon-basic"
    @change="handleChange"
  />
  <span data-testid="icon-value">{{ iconValue }}</span>
</div>

## Icon Select with Placeholder
<div class="test-section">
  <pa-select-icon 
    placeholder="Choose an icon" 
    data-testid="select-icon-placeholder"
  />
</div>

## Disabled Icon Select
<div class="test-section">
  <pa-select-icon 
    v-model="iconValue" 
    disabled 
    data-testid="select-icon-disabled"
  />
</div>

## Icon Select with Title
<div class="test-section">
  <pa-select-icon 
    v-model="iconValue" 
    title="Icon" 
    data-testid="select-icon-title"
  />
</div>

## Display Mode
<div class="test-section">
  <pa-select-icon 
    v-model="iconValue" 
    display 
    data-testid="select-icon-display"
  />
</div>

## Change Events Count
<div class="test-section">
  <span data-testid="icon-change-events-count">{{ changeEvents.length }}</span>
</div>

<style scoped>
.test-section {
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
