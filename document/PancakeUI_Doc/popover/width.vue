<template>
  <div style="display: flex; gap: 10px">
    <pa-popover :popover-width="300">
      <template #reference>
        <pa-button :useStop="false">固定宽度 300</pa-button>
      </template>
      <div>弹出层宽度为 300px</div>
    </pa-popover>
    <pa-popover :auto-width="true">
      <template #reference>
        <pa-button :useStop="false" style="width: 200px">自动宽度</pa-button>
      </template>
      <div>自动跟随参考元素宽度</div>
    </pa-popover>
  </div>
</template>
