<template>
  <div class="flex config-box">
    <div class="in_title_label">是否现实第二页：<el-switch v-model="switchValue" /></div>
  </div>

  <sa-tabs v-model="activeName" align="edge">
    <sa-tabs-item label="第一页" name="page1" class="card_style" :padding="['all']">
      <template #label>
        <m-icon name="applet_line" />
        <span>Page1</span>
      </template>
      page1
    </sa-tabs-item>
    <sa-tabs-item v-if="switchValue" label="第二页" name="page2" class="card_style" :padding="['all']"> page2 </sa-tabs-item>
  </sa-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName = ref("page1");
const switchValue = ref(false);
</script>

<style scoped lang="scss">
.card_style {
  background-color: #f5f5f5;
  height: 200px;
}
</style>
