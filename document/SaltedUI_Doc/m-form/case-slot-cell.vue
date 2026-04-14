<template>
  <m-form-v2 id="case-slot-from-demo" ref="proForm" :structure="formConfig" :span="2">
    <template #cell-Select> <m-button-v2 is="go">Cell 单元扩展</m-button-v2> </template>
  </m-form-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { MStructureV2Type } from "M_Types";

const proForm = ref();

const formConfig: MStructureV2Type.FormV2[] = [
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
