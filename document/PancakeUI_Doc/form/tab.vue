<template>
  <pa-title :padding="['bottom']">FormData结果值：</pa-title>

  <code-view v-model:html="formData"> </code-view>

  <pa-form
    id="tab-from-demo"
    ref="proForm"
    :structure="formConfig"
    :ex-options="exOptions"
    :span="2"
    :label-width="100"
    :data="baseFormData"
    :contrastData="contrastData"
  />

  <div class="flex-center">
    <pa-button is="submit" @click="submitForm">提交Form</pa-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PaStructureType } from "PancakeType";

const proForm = ref();
const formData = ref({});

const formConfig: PaStructureType.Form[] = [
  {
    unitName: "Tab Form 组件",
    label: "标签组件",
    prop: "Tab1",
    type: "tabs-form",
    contrastKey: "id",
    contrastUse: "oldId",
    tabsFormConfig: [
      { unitName: "Tab-groupName1", unitTip: "Tip Message", label: "Input1", prop: "Input1", type: "input" },
      { unitName: "Tab-groupName1", label: "Number2", prop: "Number2", type: "number" },
      { unitName: "Tab-groupName1", label: "Select1", prop: "Select1", type: "select" },
      { disabled: true, unitName: "Tab-groupName2", label: "Input2", prop: "Input2", type: "input" },
      { disabled: true, unitName: "Tab-groupName2", label: "Input3", prop: "Input3", type: "input" }
    ]
  }
];

const baseFormData = ref({
  Tab1: [
    {
      id: 1,
      Input1: "1"
    }
  ]
});
const contrastData = ref({
  Tab1: [
    {
      id: 2,
      oldId: 1,
      Input1: "1222"
    }
  ]
});

const exOptions = ref({
  Select1: [
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
