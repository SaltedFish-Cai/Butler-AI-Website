<template>
  <div class="vp_title_label">对其方式：default</div>
  <sa-tabs v-model="activeName">
    <sa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </sa-tabs-item>
  </sa-tabs>

  <div class="vp_title_label mt10">对其方式：edge</div>
  <sa-tabs v-model="activeName" align="edge">
    <sa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']"> page1 </sa-tabs-item>
  </sa-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName = ref("page1");
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
