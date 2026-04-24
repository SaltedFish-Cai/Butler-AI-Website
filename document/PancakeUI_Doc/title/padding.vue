<template>
  
  <div class="demo-title">
    
    <pa-title :padding="['top']">顶部内边距</pa-title>
    
    <pa-title :padding="['bottom']">底部内边距</pa-title>
    
    <pa-title :padding="['top', 'bottom']">上下内边距</pa-title>
    
    <pa-title :padding="['all']">全部内边距</pa-title>
  
  </div>
</template>

<style scoped>
.demo-title {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
