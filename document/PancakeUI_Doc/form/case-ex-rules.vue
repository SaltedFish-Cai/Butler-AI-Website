<template>
  <pa-form id="case-ex-rules-from-demo" ref="proForm" :structure="formConfig" :ex-dependent="exRules" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PaStructureType } from "PancakeType";

const proForm = ref();

const formConfig: PaStructureType.Form[] = [{ label: "Input1", prop: "Input1", type: "input" }];

const exRules = ref({
  exCellRules: {
    Input1: [{ validator: Input1Rules, trigger: "blur" }]
  }
});

function Input1Rules({ value, callback }) {
  const rg = /^[A-Z0-9]{5}$/;
  if (rg.test(value)) {
    callback();
  } else {
    callback(new Error("至少5个字符，只能包含大写字母和数字"));
  }
}
</script>

<style scoped></style>
