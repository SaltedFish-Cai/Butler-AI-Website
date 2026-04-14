<template>
  <m-form-v2 id="case-slot-from-demo" ref="proForm" :structure="formConfig">
    <template #option-Select="{ config }">
      <div>扩展：{{ config.label }}</div>
    </template>
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
    type: "cascader",
    exOptions: [
      { label: "选项1", value: 1, children: [{ label: "选项1-1", value: 11 }] },
      { label: "选项2", value: 2 }
    ]
  }
];
</script>

<style scoped></style>
