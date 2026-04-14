<template>
  <div class="vp_title_label">Card样式</div>
  <m-tabs-v2 v-model="activeName" align="edge">
    <m-tabs-v2-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </m-tabs-v2-item>
    <m-tabs-v2-item label="第二页" name="page2" class="card_style"> page2 </m-tabs-v2-item>
  </m-tabs-v2>

  <div class="vp_title_label mt10">非Card样式</div>
  <m-tabs-v2 v-model="activeName" styleMode="default" align="edge">
    <m-tabs-v2-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </m-tabs-v2-item>
    <m-tabs-v2-item label="第二页" name="page2" class="card_style"> page2 </m-tabs-v2-item>
  </m-tabs-v2>

  <div class="vp_title_label">纵向</div>

  <m-tabs-v2 v-model="activeName3" mode="portrait" styleMode="default">
    <m-tabs-v2-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </m-tabs-v2-item>
    <m-tabs-v2-item label="第二页" name="page2" class="card_style"> page2 </m-tabs-v2-item>
  </m-tabs-v2>

  <div class="vp_title_label">纵向卡片</div>

  <m-tabs-v2 v-model="activeName4" mode="portrait">
    <m-tabs-v2-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </m-tabs-v2-item>
    <m-tabs-v2-item label="第二页" name="page2" class="card_style"> page2 </m-tabs-v2-item>
  </m-tabs-v2>
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
