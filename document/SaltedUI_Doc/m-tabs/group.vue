<template>
  <div class="vp_title_label">组合使用</div>
  <m-tabs-v2 v-model="activeName2" align="edge" useHeaderLine>
    <m-tabs-v2-item label="第一页" name="page1" class="card_style">
      <m-tabs-v2 v-model="activeName5" mode="portrait" styleMode="default">
        <m-tabs-v2-item label="第一页" name="page1-1" :padding="['all']"> page1 </m-tabs-v2-item>
        <m-tabs-v2-item label="第二页" name="page2-1" :padding="['all']"> page2 </m-tabs-v2-item>
      </m-tabs-v2></m-tabs-v2-item
    >
    <m-tabs-v2-item label="第二页" name="page2" class="card_style" :padding="['all']"> page2 </m-tabs-v2-item>
  </m-tabs-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName2 = ref("page1");
const activeName5 = ref("page2-1");
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
