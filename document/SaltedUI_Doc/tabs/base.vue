<template>
  <sa-title :padding="['bottom']">Card样式</sa-title>
  <sa-tabs v-model="activeName" align="edge">
    <sa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </sa-tabs-item>
    <sa-tabs-item label="第二页" name="page2" class="card_style"> page2 </sa-tabs-item>
  </sa-tabs>

  <div class="vp_title_label mt10">非Card样式</div>
  <sa-tabs v-model="activeName" styleMode="default" align="edge">
    <sa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </sa-tabs-item>
    <sa-tabs-item label="第二页" name="page2" class="card_style"> page2 </sa-tabs-item>
  </sa-tabs>

  <sa-title :padding="['bottom']">纵向</sa-title>

  <sa-tabs v-model="activeName3" mode="portrait" styleMode="default">
    <sa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </sa-tabs-item>
    <sa-tabs-item label="第二页" name="page2" class="card_style"> page2 </sa-tabs-item>
  </sa-tabs>

  <sa-title :padding="['bottom']">纵向卡片</sa-title>

  <sa-tabs v-model="activeName4" mode="portrait">
    <sa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </sa-tabs-item>
    <sa-tabs-item label="第二页" name="page2" class="card_style"> page2 </sa-tabs-item>
  </sa-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName = ref("page1");
const activeName3 = ref("page1");
const activeName4 = ref("page1");
</script>

<style scoped lang="scss">
.vp_title_label {
  margin-top: 20px;
  margin-bottom: 5px;
  &:first-child {
    margin-top: 0;
  }
}

.card_style {
  background-color: #f5f5f5;
  height: 200px;
}
</style>
