---
title: Icon E2E Test
---

<script setup>
import { ref } from 'vue'

const iconClickCount = ref(0)

function handleIconClick() {
  iconClickCount.value++
}
</script>

## Basic Icons
<div class="icon-row">
  <pa-icon name="search_line" data-testid="icon-search" />
  <pa-icon name="add_circle_line" data-testid="icon-add" />
  <pa-icon name="edit_line" data-testid="icon-edit" />
  <pa-icon name="delete_back_line" data-testid="icon-delete" />
</div>

## Icon with Tip
<pa-icon name="search_line" tip="Search icon" data-testid="icon-with-tip" />

## Clickable Icon
<pa-icon name="search_line" data-testid="icon-clickable" @click="handleIconClick" />
<span data-testid="icon-click-count">{{ iconClickCount }}</span>

<style scoped>
.icon-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 16px 0;
}
</style>
