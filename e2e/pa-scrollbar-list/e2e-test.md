---
title: ScrollBarList E2E Test
---

<script setup>
import { ref } from 'vue'

// Mock API for testing
const mockRequestApi = async (params) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    List: [
      { id: 1, name: 'Item 1', type: 'data' },
      { id: 2, name: 'Item 2', type: 'data' },
      { id: 3, name: 'Item 3', type: 'data' },
      { id: 4, name: 'Item 4', type: 'data' },
      { id: 5, name: 'Item 5', type: 'data' },
    ],
    TotalCount: 5
  }
}

const mockRequestApiMultiPage = async (params) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const pageNum = params.Page?.PageNum || 1
  const pageSize = params.Page?.PageSize || 50
  const items = []
  const start = (pageNum - 1) * pageSize
  for (let i = 0; i < Math.min(pageSize, 10); i++) {
    items.push({ id: start + i + 1, name: `Item ${start + i + 1}`, type: 'data' })
  }
  return {
    List: items,
    TotalCount: 25
  }
}
</script>

## ScrollBarList with Mock API
<pa-scrollbar-list 
  data-testid="scrollbar-list-api"
  :request-api="mockRequestApi"
  :row-key="'id'"
  style="height: 300px;"
>
  <template #default="{ row }">
    <div data-testid="scrollbar-list-item" class="list-item">{{ row.name }}</div>
  </template>
</pa-scrollbar-list>

## ScrollBarList without API (Empty State)
<pa-scrollbar-list 
  data-testid="scrollbar-list-empty"
  style="height: 200px;"
>
  <template #default="{ row }">
    <div class="list-item">{{ row.name }}</div>
  </template>
</pa-scrollbar-list>

## ScrollBarList Color Mode
<pa-scrollbar-list 
  data-testid="scrollbar-list-color"
  style-mode="color"
  :request-api="mockRequestApi"
  :row-key="'id'"
  style="height: 200px;"
>
  <template #default="{ row }">
    <div class="list-item">{{ row.name }}</div>
  </template>
</pa-scrollbar-list>

## ScrollBarList without Pagination
<pa-scrollbar-list 
  data-testid="scrollbar-list-no-pagination"
  :show-pagination="false"
  :request-api="mockRequestApi"
  :row-key="'id'"
  style="height: 200px;"
>
  <template #default="{ row }">
    <div class="list-item">{{ row.name }}</div>
  </template>
</pa-scrollbar-list>

## ScrollBarList with Padding
<pa-scrollbar-list 
  data-testid="scrollbar-list-padding"
  :padding="['top', 'bottom', 'left', 'right']"
  :request-api="mockRequestApi"
  :row-key="'id'"
  style="height: 200px;"
>
  <template #default="{ row }">
    <div class="list-item">{{ row.name }}</div>
  </template>
</pa-scrollbar-list>

## ScrollBarList with Footer Slot
<pa-scrollbar-list 
  data-testid="scrollbar-list-footer"
  :request-api="mockRequestApi"
  :row-key="'id'"
  style="height: 200px;"
>
  <template #default="{ row }">
    <div class="list-item">{{ row.name }}</div>
  </template>
  <template #footer>
    <div data-testid="scrollbar-list-footer-slot" class="footer-content">Footer Content</div>
  </template>
</pa-scrollbar-list>

<style scoped>
.list-item {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}
.footer-content {
  padding: 12px 16px;
  background-color: #f5f5f5;
  text-align: center;
}
</style>
