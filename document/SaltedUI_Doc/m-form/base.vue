<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form-v2
    id="base-from-demo"
    ref="proForm"
    :structure="formConfig"
    :ex-options="exOptions"
    :max-span="3"
    @form-cell-change="handleCellChange"
  />

  <div class="flex-center">
    <m-button-v2 is="submit" @click="submitForm">提交Form</m-button-v2>
  </div>
</template>

<script lang="ts" setup>
import { MStructureV2Type } from "M_Types";
import { ref, Ref, useTemplateRef } from "vue";
import { M_Notification } from "@/package/components/feedback";

const proForm = useTemplateRef("proForm");
const formData = ref({});

const formConfig: Ref<MStructureV2Type.FormV2[]> = ref([]);
setTimeout(() => {
  formConfig.value = [
    { label: "Input1", tip: "Tip Message", prop: "Input1", type: "textarea", maxLength: 100, exSpan: 4 },
    { label: "Input2", prop: "Input2", type: "input", rules: [{ required: false }] },
    { label: "Select1", prop: "Select1", type: "select", clearable: false },
    { label: "协议有效期", prop: "AgreementPeriod", type: "date-picker-group" }
  ];
}, 1000);

const exOptions = ref({
  Select1: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function submitForm() {
  const data = await proForm.value?.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}

function handleCellChange(cell) {
  M_Notification.info(JSON.stringify(cell));
}
</script>

<style scoped></style>
