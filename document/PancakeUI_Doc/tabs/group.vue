<template>
  <pa-title :padding="['bottom']">组合使用</pa-title>
  <pa-tabs v-model="activeName2" align="edge" useHeaderLine>
    <pa-tabs-item label="第一页" name="page1" class="card_style">
      <pa-tabs v-model="activeName5" mode="portrait" styleMode="default">
        <pa-tabs-item label="第一页" name="page1-1" :padding="['all']"> page1 </pa-tabs-item>
        <pa-tabs-item label="第二页" name="page2-1" :padding="['all']"> page2 </pa-tabs-item>
      </pa-tabs></pa-tabs-item
    >
    <pa-tabs-item label="第二页" name="page2" class="card_style" :padding="['all']"> page2 </pa-tabs-item>
  </pa-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName2 = ref("page1");
const activeName5 = ref("page2-1");
</script>

<style scoped lang="scss"></style>
