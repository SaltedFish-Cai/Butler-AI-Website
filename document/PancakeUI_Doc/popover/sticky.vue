<template>
  <div style="display: flex; gap: 10px">
    <pa-popover placement="bottom" sticky="left">
      <template #reference>
        <pa-button :useStop="false">左对齐</pa-button>
      </template>
      <div>粘性定位 - 左对齐</div>
    </pa-popover>
    <pa-popover placement="bottom" sticky="right">
      <template #reference>
        <pa-button :useStop="false">右对齐</pa-button>
      </template>
      <div>粘性定位 - 右对齐</div>
    </pa-popover>
  </div>
</template>
