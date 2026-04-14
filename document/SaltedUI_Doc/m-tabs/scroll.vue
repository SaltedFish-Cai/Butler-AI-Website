<template>
  <m-tabs-v2 v-model="state.activeName" align="edge" class="tabs-box">
    <m-tabs-v2-item label="User" name="one" scroll :padding="['all']" useScrollX class="card_style">
      <div style="height: 800px; width: 2200px; background-color: aliceblue">scroll</div>
    </m-tabs-v2-item>
    <m-tabs-v2-item label="User" name="two" :padding="['all']" class="card_style">
      <div style="height: 800px; width: 2200px">no-scroll</div>
    </m-tabs-v2-item>
  </m-tabs-v2>
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
