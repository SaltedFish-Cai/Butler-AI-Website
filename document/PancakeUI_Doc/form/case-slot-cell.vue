<template>
  <pa-form id="case-slot-from-demo" ref="proForm" :structure="formConfig" :span="2">
    <template #cell-Select> <pa-button is="go">Cell 单元扩展</pa-button> </template>
  </pa-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PaStructureType } from "PancakeType";

const proForm = ref();

const formConfig: PaStructureType.Form[] = [
  {
    label: "Select1",
    prop: "Select",
    type: "select",
    exOptions: [
      { label: "选项1", value: 1 },
      { label: "选项2", value: 2 }
    ]
  },
  {
    label: "Select2",
    prop: "Select2",
    type: "select",
    exOptions: [
      { label: "选项1", value: 1 },
      { label: "选项2", value: 2 }
    ]
  }
];
</script>

<style scoped></style>
