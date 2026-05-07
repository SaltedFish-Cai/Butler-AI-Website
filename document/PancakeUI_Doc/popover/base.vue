<template>
  <div style="display: flex; gap: 20px">
    <pa-popover placement="bottom">
      <template #reference>
        <pa-button>底部弹出</pa-button>
      </template>
      <div>这是底部弹出的内容</div>
    </pa-popover>
    <pa-popover placement="top">
      <template #reference>
        <pa-button>顶部弹出</pa-button>
      </template>
      <div>这是顶部弹出的内容</div>
    </pa-popover>
  </div>
</template>
