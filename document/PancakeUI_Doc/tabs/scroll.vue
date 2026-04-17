<template>
  <sa-tabs v-model="state.activeName" align="edge" class="tabs-box">
    <sa-tabs-item label="User" name="one" scroll :padding="['all']" useScrollX class="card_style">
      <div style="height: 800px; width: 2200px; background-color: aliceblue">scroll</div>
    </sa-tabs-item>
    <sa-tabs-item label="User" name="two" :padding="['all']" class="card_style">
      <div style="height: 800px; width: 2200px">no-scroll</div>
    </sa-tabs-item>
  </sa-tabs>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive({
  activeName: "one"
});
</script>

<style scoped lang="scss">
.tabs-box {
  width: 100%;
  height: 400px;
}
.card_style {
  background-color: #f5f5f5;
}
</style>
