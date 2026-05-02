<template>
  <pa-row :gutter="gutter">
    <div class="demo-show" v-for="item in 7" :key="item">Col {{ item }}</div>
  </pa-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const gutter = ref(10);
</script>

<style scoped lang="scss">
.demo-show {
  width: 20%;
  line-height: 30px;
  text-align: center;
  background-color: var(--pa-color-info-light-6);
}
</style>
