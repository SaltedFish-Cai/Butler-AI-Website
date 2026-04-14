<template>
  <m-form-v2 id="case-slot-from-demo" ref="proForm" :structure="formConfig">
    <template #SlotKey> 这是一个插槽 </template>
  </m-form-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { MStructureV2Type } from "M_Types";

const proForm = ref();

const formConfig: MStructureV2Type.FormV2[] = [
  {
    label: "Select1",
    prop: "Select1",
    type: "select",
    exOptions: [
      { label: "选项1", value: 1 },
      { label: "选项2", value: 2 }
    ]
  },
  {
    label: "Slot1",
    prop: "SlotKey",
    type: "slot"
  }
];
</script>

<style scoped></style>
