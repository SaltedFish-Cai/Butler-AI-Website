<template>
  
  <div class="demo-title">
    
    <pa-title :line="true">带下划线的标题</pa-title>
    
    <pa-title :line="false">无下划线的标题</pa-title>
  
  </div>
</template>

<style scoped>
.demo-title {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
