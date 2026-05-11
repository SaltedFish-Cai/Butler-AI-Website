---
title: Select E2E Test
---

<script setup>
import { ref } from 'vue'

const singleValue = ref('apple')
const multipleValue = ref(['apple', 'banana'])
const disabledValue = ref('orange')

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
  { label: 'Watermelon', value: 'watermelon' }
]

const changeEvents = ref([])

function handleChange(data) {
  changeEvents.value.push(data)
}
</script>

## Basic Single Select
<div class="test-section">
  <pa-select 
    v-model="singleValue" 
    :ex-options="options" 
    data-testid="select-single"
    @change="handleChange"
  />
  <span data-testid="select-single-value">{{ singleValue }}</span>
</div>

## Multiple Select
<div class="test-section">
  <pa-select 
    v-model="multipleValue" 
    :ex-options="options" 
    type="multiple-select" 
    data-testid="select-multiple"
    @change="handleChange"
  />
  <span data-testid="select-multiple-value">{{ JSON.stringify(multipleValue) }}</span>
</div>

## Select with Placeholder
<div class="test-section">
  <pa-select 
    :ex-options="options" 
    placeholder="Please select a fruit" 
    data-testid="select-placeholder"
  />
</div>

## Disabled Select
<div class="test-section">
  <pa-select 
    v-model="disabledValue" 
    :ex-options="options" 
    disabled 
    data-testid="select-disabled"
  />
</div>

## Select with Title
<div class="test-section">
  <pa-select 
    :ex-options="options" 
    title="Fruit" 
    data-testid="select-with-title"
  />
</div>

## Display Mode
<div class="test-section">
  <pa-select 
    v-model="singleValue" 
    :ex-options="options" 
    display 
    data-testid="select-display"
  />
</div>

## Change Events Log
<div class="test-section">
  <span data-testid="change-events-count">{{ changeEvents.length }}</span>
</div>

<style scoped>
.test-section {
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
