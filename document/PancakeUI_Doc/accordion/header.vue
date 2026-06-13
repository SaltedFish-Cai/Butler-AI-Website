<template>
  <pa-accordion>
    <pa-accordion-item v-model:expanded="expanded">
      <template #header="{ expanded, toggle }">
        <span>{{ expanded ? "收起" : "展开" }}</span>
        <pa-button size="small" @click.stop="toggle">切换</pa-button>
      </template>
      自定义头部内容
    </pa-accordion-item>
  </pa-accordion>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const expanded = ref(false);
</script>
