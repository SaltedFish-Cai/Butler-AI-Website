<template>
  
  <div class="demo-title">
    
    <pa-title tips="这是提示信息">带提示的标题</pa-title>
    
    <pa-title>
      自定义提示插槽
      
      <template #tips>
        
        <span style="color: #999;">通过插槽自定义提示内容</span>
      
      </template>
    
    </pa-title>
  
  </div>
</template>

<style scoped>
.demo-title {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
