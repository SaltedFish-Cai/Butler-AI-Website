<template>
  <div class="doc-split">
    <div class="doc-split_left">
      <slot name="demo" />
    </div>
    <div class="doc-split_right">
      <slot name="api" />
    </div>
  </div>
</template>

<style scoped>
.doc-split {
  display: flex;
  gap: 24px;
  margin: 16px 0;
  min-height: 400px;
}

.doc-split_left {
  flex: 1;
  min-width: 0;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 8px;
}

.doc-split_right {
  flex: 1;
  min-width: 0;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-left: 8px;
  border-left: 1px solid var(--vp-c-divider-light);
}

/* 左侧 demo 块间距 */
.doc-split_left :deep(.demo) {
  margin-bottom: 16px;
}

/* 右侧表格样式优化 */
.doc-split_right :deep(table) {
  width: 100%;
  font-size: 14px;
}

.doc-split_right :deep(h2) {
  margin-top: 0;
  font-size: 18px;
}

.doc-split_right :deep(h3) {
  font-size: 16px;
}

/* 移动端堆叠 */
@media (max-width: 768px) {
  .doc-split {
    flex-direction: column;
    gap: 16px;
  }

  .doc-split_left,
  .doc-split_right {
    max-height: none;
    overflow-y: visible;
  }

  .doc-split_right {
    border-left: none;
    padding-left: 0;
  }
}
</style>
