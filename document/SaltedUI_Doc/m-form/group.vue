<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form-v2 id="tab-from-demo" ref="proForm" :structure="formConfig" :ex-options="exOptions" :span="2" :data="formData" />

  <div class="flex-center">
    <m-button-v2 is="submit" @click="submitForm">提交Form</m-button-v2>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { MStructureV2Type } from "M_Types";

const proForm = ref();
const formData = ref({
  groupProp: 1
});

const formConfig: MStructureV2Type.FormV2[] = [
  { label: "Input1", tip: "Tip Message", prop: "Input1", type: "textarea", maxLength: 100 },
  { label: "Input2", prop: "Input2", type: "input", rules: [{ required: false }] },
  {
    label: "group组",
    tip: "这是一则提示",
    prop: "groupProp",
    type: "group",
    groupFormConfig: [
      {
        label: "选项1",
        prop: "childProp1",
        type: "input",
        value: "1"
      },
      {
        label: "选项2",
        prop: "childProp2",
        value: "2",
        type: "select"
      },
      {
        label: "选项3",
        prop: "childProp3",
        type: "switch",
        value: "3"
      }
    ]
  }
];

const exOptions = ref({
  childProp2: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function submitForm() {
  const data = await proForm.value.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
</script>

<style scoped></style>
