<template>
  <div style="display: flex; gap: 10px">
    <pa-popover trigger="click">
      <template #reference>
        <pa-button :useStop="false">点击触发</pa-button>
      </template>
      <div>点击外部区域关闭</div>
    </pa-popover>
    <pa-popover trigger="hover">
      <template #reference>
        <pa-button>悬停触发</pa-button>
      </template>
      <div>鼠标移出关闭</div>
    </pa-popover>
  </div>
</template>
