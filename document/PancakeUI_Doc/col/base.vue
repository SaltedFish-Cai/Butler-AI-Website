<template>
  <pa-row>
    <pa-col v-for="item in 13" :key="item" :span="colSize">
      <div class="demo-show">Col {{ item }}</div>
    </pa-col>
  </pa-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const colSize = ref(5);
</script>

<style scoped lang="scss">
.demo-show {
  width: 100%;
  line-height: 30px;
  text-align: center;
  background-color: var(--pa-color-info-light-6);
}
</style>
