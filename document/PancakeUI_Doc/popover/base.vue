<template>
  <div style="display: flex; gap: 10px">
    <pa-popover placement="bottom">
      <template #reference>
        <pa-button :useStop="false">底部弹出</pa-button>
      </template>
      <div>这是底部弹出的内容</div>
    </pa-popover>
    <pa-popover placement="top">
      <template #reference>
        <pa-button :useStop="false">顶部弹出</pa-button>
      </template>
      <div>这是顶部弹出的内容</div>
    </pa-popover>
    <pa-popover placement="left">
      <template #reference>
        <pa-button :useStop="false">左侧弹出</pa-button>
      </template>
      <div>这是左侧弹出的内容</div>
    </pa-popover>
    <pa-popover placement="right">
      <template #reference>
        <pa-button :useStop="false">右侧弹出</pa-button>
      </template>
      <div>这是右侧弹出的内容</div>
    </pa-popover>
  </div>
</template>
