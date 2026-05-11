---
title: Input E2E Test
---

<script setup>
import { ref } from 'vue'

const inputValue = ref('Initial Value')
const inputValue2 = ref('')
const focusCount = ref(0)
const blurCount = ref(0)
const enterCount = ref(0)
const changeCount = ref(0)

function handleFocus() {
  focusCount.value++
}

function handleBlur() {
  blurCount.value++
}

function handleEnter() {
  enterCount.value++
}

function handleChange(e) {
  changeCount.value++
}
</script>

## Basic Input (Textarea)
<div data-testid="input-basic"><pa-input placeholder="Please enter text" /></div>

## Input with Initial Value
<div data-testid="input-with-value"><pa-input v-model="inputValue" placeholder="Type here..." /></div>

## Input with MaxLength
<div data-testid="input-maxlength"><pa-input v-model="inputValue2" :max-length="10" placeholder="Max 10 characters" /></div>

## Disabled Input
<div data-testid="input-disabled"><pa-input disabled placeholder="Disabled input" /></div>

## Display Mode
<div data-testid="input-display"><pa-input :model-value="'Display Value'" :display="true" /></div>

## Input with Title
<div data-testid="input-with-title"><pa-input title="Label" placeholder="With label" /></div>

## Input with Autofocus
<div data-testid="input-autofocus"><pa-input :autofocus="true" placeholder="Auto focus" /></div>

## Clearable Input with Value
<div data-testid="input-clearable"><pa-input v-model="inputValue" :clearable="true" placeholder="Click clear button" /></div>

## Focus/Blur Events
<div class="event-section">
  <div data-testid="input-events"><pa-input placeholder="Focus and blur me" @focus="handleFocus" @blur="handleBlur" @enter="handleEnter" @change="handleChange" /></div>
  <span data-testid="focus-count">Focus: {{ focusCount }}</span>
  <span data-testid="blur-count">Blur: {{ blurCount }}</span>
  <span data-testid="enter-count">Enter: {{ enterCount }}</span>
  <span data-testid="change-count">Change: {{ changeCount }}</span>
</div>

## Multiple Inputs
<div class="multi-section">
  <div data-testid="input-1"><pa-input v-model="inputValue" placeholder="First input" /></div>
  <div data-testid="input-2"><pa-input placeholder="Second input" /></div>
</div>

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
.multi-section {
  display: flex;
  gap: 16px;
  margin: 16px 0;
}
</style>
