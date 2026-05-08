<template>
  <pa-title style-mode="default" line-config>默认下划线样式</pa-title>
  <div class="block"></div>
  <pa-title style-mode="default" :line-config="lineConfig">自定义分割线样式</pa-title>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const lineConfig = ref({ borderColor: "#bce2db", height: "5px", borderStyle: "dashed" as const });
</script>

<style scoped>
.block {
  height: 30px;
}
</style>
