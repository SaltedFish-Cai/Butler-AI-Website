<template>
  <pa-title :padding="['bottom']">纵向</pa-title>
  <pa-tabs v-model="activeName1" mode="portrait" styleMode="default">
    <pa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </pa-tabs-item>
    <pa-tabs-item label="第二页" name="page2" class="card_style"> page2 </pa-tabs-item>
  </pa-tabs>

  <pa-title :padding="['top', 'bottom']">纵向卡片</pa-title>
  <pa-tabs v-model="activeName2" mode="portrait">
    <pa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </pa-tabs-item>
    <pa-tabs-item label="第二页" name="page2" class="card_style"> page2 </pa-tabs-item>
  </pa-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName1 = ref("page1");
const activeName2 = ref("page1");
</script>

<style scoped lang="scss">
.card_style {
  height: 200px;
}
</style>
