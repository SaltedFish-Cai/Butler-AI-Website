<template>
  <pa-accordion>
    <pa-accordion-item v-model:expanded="expanded">
      可正常展开的内容
    </pa-accordion-item>
    <pa-accordion-item disabled v-model:expanded="disabledExpanded">
      此项目已被禁用，无法展开
    </pa-accordion-item>
  </pa-accordion>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const expanded = ref(true);
const disabledExpanded = ref(false);
</script>
