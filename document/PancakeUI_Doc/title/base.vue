<template>
  
  <div class="demo-title">
    
    <pa-title>默认标题</pa-title>
    
    <pa-title :line="false">无下划线标题</pa-title>
    
    <pa-title tips="这是提示信息">带提示的标题</pa-title>
    
    <pa-title :padding="['top', 'bottom']">带内边距的标题</pa-title>
  
  </div>
</template>

<style scoped>
.demo-title {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
