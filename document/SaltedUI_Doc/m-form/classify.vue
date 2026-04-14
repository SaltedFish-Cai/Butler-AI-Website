<template>
  <m-form-v2 id="classify-form-demo" ref="proForm" :structure="formConfig" :ex-options="exOptions" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { MStructureV2Type } from "M_Types";

const proForm = ref();

const formConfig: MStructureV2Type.FormV2[] = [
  { unitName: "groupName#1", unitTip: "Tip Message", label: "Input1", prop: "Input1", type: "input" },
  { unitName: "groupName#1", label: "Input2", prop: "Input2", type: "input" },
  { unitName: "groupName#2", label: "Select1", prop: "Select1", type: "select" },
  { unitName: "groupName#2", label: "Number1", prop: "Number1", type: "number" },
  { unitName: "groupName#2", label: "Date1", prop: "Date1", type: "date-picker" }
];

const exOptions = ref({
  Select1: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});
</script>

<style scoped></style>
