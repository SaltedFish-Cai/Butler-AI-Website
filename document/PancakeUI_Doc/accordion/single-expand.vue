<template>
  <pa-accordion single-expand>
    <pa-accordion-item v-for="item in items" :key="item.title" v-model:expanded="item.expanded">
      <template #header>
        {{ item.title }}
      </template>
      {{ item.content }}
    </pa-accordion-item>
  </pa-accordion>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const items = ref([
  { title: "标题一", content: "内容一", expanded: false },
  { title: "标题二", content: "内容二", expanded: false },
  { title: "标题三", content: "内容三", expanded: false }
]);
</script>
