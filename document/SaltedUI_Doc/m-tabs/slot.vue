<template>
  <div class="flex config-box">
    <div class="in_title_label">是否现实第二页：<el-switch v-model="switchValue" /></div>
  </div>

  <m-tabs-v2 v-model="activeName" align="edge">
    <m-tabs-v2-item label="第一页" name="page1" class="card_style" :padding="['all']">
      <template #label>
        <m-icon name="applet_line" />
        <span>Page1</span>
      </template>
      page1
    </m-tabs-v2-item>
    <m-tabs-v2-item v-if="switchValue" label="第二页" name="page2" class="card_style" :padding="['all']"> page2 </m-tabs-v2-item>
  </m-tabs-v2>
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
