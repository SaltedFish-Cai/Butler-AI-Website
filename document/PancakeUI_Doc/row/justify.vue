<template>
  <pa-row justify="space-between" align="center">
    <div class="demo-show" v-for="item in 3" :key="item">Col {{ item }}</div>
  </pa-row>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.demo-show {
  width: 20%;
  line-height: 30px;
  text-align: center;
  background-color: var(--pa-color-info-light-6);
  &:first-child {
    line-height: 70px;
  }
}
</style>
