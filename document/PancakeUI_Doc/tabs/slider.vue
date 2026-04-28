<template>
  <div class="max-box">
    <pa-tabs v-model="activeName5" mode="slider">
      <pa-tabs-item label="第一页" name="page1-1" class="card_style" :padding="['all']"> page1 </pa-tabs-item>
      <pa-tabs-item label="第二页" name="page2-1" class="card_style" :padding="['all']"> page2 </pa-tabs-item>
      <pa-tabs-item label="第三页" name="page3-1" class="card_style" :padding="['all']"> page3 </pa-tabs-item>
      <pa-tabs-item label="第四页" name="page4-1" class="card_style" :padding="['all']"> page4 </pa-tabs-item>
    </pa-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName5 = ref("page3-1");
</script>

<style scoped lang="scss">
.max-box {
  height: 200px;
}
.card_style {
  background-color: #f5f5f5;
  height: 300px;
}
</style>
