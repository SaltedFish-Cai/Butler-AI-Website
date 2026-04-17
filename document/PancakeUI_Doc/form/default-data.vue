<template>
  <sa-title :padding="['bottom']">baseFormData结果值：</sa-title>

  <code-view v-model:html="baseFormData"> </code-view>

  <sa-title :padding="['bottom']">FormData结果值：</sa-title>

  <code-view v-model:html="formData"> </code-view>

  <sa-form id="base-from-demo" :data="baseFormData" ref="proForm" :structure="formConfig" :ex-options="exOptions" />

  <div class="flex-center">
    <sa-button is="submit" @click="submitForm">提交Form</sa-button>
    <sa-button is="go" @click="changeData">二次修改默认值</sa-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";
import { MStructureV2Type } from "M_Types";

const proForm = useTemplateRef("proForm");
const baseFormData = ref({
  Input2: "默认值",
  Select1: 1
});
const formData = ref({});

const formConfig: MStructureV2Type.FormV2[] = [
  { label: "Input1", tip: "Tip Message", prop: "Input1", type: "input" },
  { label: "Input2", prop: "Input2", type: "input", rules: [{ required: false }] },
  { label: "Select1", prop: "Select1", type: "select" }
];

const exOptions = ref({
  Select1: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function changeData() {
  proForm.value?.changeData_Item("Input2", "默认值2");
  proForm.value?.changeData_Item("Input1", "默认值2");
}

async function submitForm() {
  const data = await proForm.value?.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
</script>

<style scoped></style>
