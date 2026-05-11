---
title: Number E2E Test
---

<script setup>
import { ref } from 'vue'

const numberValue = ref(10)
const numberValue2 = ref(50)
const focusCount = ref(0)
const blurCount = ref(0)
const changeCount = ref(0)

function handleFocus() {
  focusCount.value++
}

function handleBlur() {
  blurCount.value++
}

function handleChange() {
  changeCount.value++
}
</script>

## Basic Number Input
<div data-testid="number-basic"><pa-number placeholder="Enter number" /></div>

## Number with Initial Value
<div data-testid="number-with-value"><pa-number v-model="numberValue" placeholder="Enter number" /></div>

## Number with Controls (default)
<div data-testid="number-with-controls"><pa-number v-model="numberValue2" placeholder="Use controls" /></div>

## Number without Controls
<div data-testid="number-no-controls"><pa-number v-model="numberValue2" :controls="false" placeholder="No controls" /></div>

## Number with Min/Max
<div data-testid="number-with-limit"><pa-number v-model="numberValue" :min="0" :max="100" placeholder="Limited 0-100" /></div>

## Number with Step
<div data-testid="number-with-step"><pa-number :model-value="5" :step="5" placeholder="Step 5" /></div>

## Number with Precision (Decimal)
<div data-testid="number-precision"><pa-number :model-value="10.555" :precision="2" placeholder="2 decimal places" /></div>

## Number with Unit
<div data-testid="number-with-unit"><pa-number :model-value="100" unit="元" placeholder="With unit" /></div>

## Disabled Number
<div data-testid="number-disabled"><pa-number :model-value="50" disabled placeholder="Disabled" /></div>

## Display Mode
<div data-testid="number-display"><pa-number :model-value="123" :display="true" /></div>

## Number with Title
<div data-testid="number-with-title"><pa-number title="Quantity" :model-value="10" placeholder="Enter quantity" /></div>

## Focus/Blur Events
<div class="event-section">
  <div data-testid="number-events"><pa-number placeholder="Focus and blur me" @focus="handleFocus" @blur="handleBlur" @change="handleChange" /></div>
  <span data-testid="number-focus-count">Focus: {{ focusCount }}</span>
  <span data-testid="number-blur-count">Blur: {{ blurCount }}</span>
  <span data-testid="number-change-count">Change: {{ changeCount }}</span>
</div>

## Clearable Number
<div data-testid="number-clearable"><pa-number v-model="numberValue" :clearable="true" placeholder="Click clear button" /></div>

<style scoped>
.event-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
}
.event-section span {
  font-size: 14px;
  color: #666;
}
</style>
