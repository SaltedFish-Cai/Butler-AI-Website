<template>
  <sa-title :padding="['bottom']">FormData结果值：</sa-title>

  <code-view v-model:html="formData"> </code-view>

  <m-form
    id="show-from-demo"
    ref="proForm"
    :labelWidth="100"
    :labelPosition="'right'"
    :data="baseFormData"
    :structure="formConfig"
    :ex-options="exOptions"
    :ex-dependent="exDependent"
    :span="2"
  >
    <template #Input1> 123 </template>
  </m-form>

  <div class="flex-center">
    <m-button is="submit" @click="submitForm">提交Form</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { mFormStructureType, mOptionType } from "@m/global";

const proForm = ref();
const baseFormData = ref({ Select4: [11, 21, 2, 22, 13] });
const formData = ref({});

const formConfig: mFormStructureType[] = [
  { label: "输入框", prop: "Input1", type: "input" },
  { label: "文本域", prop: "Textarea", type: "textarea" },
  { label: "数字输入框", prop: "Number1", type: "number" },
  { label: "下拉框", prop: "Select1", type: "select", disabled: true },
  { label: "远端下拉框", prop: "onlineSelect", type: "online-select" },
  { label: "多选下拉框", prop: "Select2", type: "multiple-select" },
  { label: "联级选择", prop: "Select3", type: "cascader-check" },
  { label: "联级选择多选", prop: "Select4", type: "multiple-cascader-check", maxCollapseTags: 2 },
  { label: "图标选择", prop: "Icon1", type: "select-icon" },
  {
    label: "开关",
    prop: "Switch2",
    type: "switch",
    activeValue: "1",
    inActiveValue: "2",
    activeText: "选择1",
    inActiveText: "选择2"
  },
  { label: "多选", prop: "Checkbox1", type: "checkbox" },
  { label: "单选", prop: "Radio1", type: "radio" },
  { label: "地址选择", prop: ["Province", "City", "Region"], type: "address" },
  { label: "日期", prop: "Time2", type: "date-picker" },
  { label: "日期组", prop: "Time3", type: "date-picker-group" },
  { label: "时间", prop: "Time4", type: "time-picker" },
  { label: "时间组", prop: "Time5", type: "time-picker-group" },
  { label: "日期时间组", prop: "Time1", type: "date-time-range" },
  { label: "文件", prop: "File1", type: "file" }
];

const exDependent = {
  fileData: {
    File1: { FileTypeCode: "AppealLabelCodeConfirmFiles", BusinessIdentifier: "" }
  },
  remoteMethod: {
    onlineSelect: remoteMethod
  }
};
function remoteMethod() {
  return [
    { label: "online-选项1", value: "a" },
    { label: "online-选项12", value: "b" }
  ];
}

const exOptions: mOptionType = {
  Switch2: {
    activeValue: "1",
    inActiveValue: "2",
    activeText: "选择1",
    inActiveText: "选择2"
  },
  Select1: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ],
  Select2: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 },
    { label: "选项3", value: 3 },
    { label: "选项4", value: 4 }
  ],
  Select3: [
    {
      label: "选项1",
      value: 1,
      children: [
        { label: "child-选项11", value: 11 },
        { label: "child-选项12", value: 12 },
        { label: "child-选项13", value: 13 }
      ]
    },
    {
      label: "选项2",
      value: 2,
      children: [
        { label: "child-选项21", value: 21 },
        { label: "child-选项22", value: 22 },
        { label: "child-选项23", value: 23 }
      ]
    }
  ],
  Select4: [
    {
      label: "选项1",
      value: 1,
      children: [
        { label: "child-选项11", value: 11 },
        { label: "child-选项12", value: 12 },
        { label: "child-选项13", value: 13 }
      ]
    },
    {
      label: "选项2",
      value: 2,
      children: [
        { label: "child-选项21", value: 21 },
        { label: "child-选项22", value: 22 },
        { label: "child-选项23", value: 23 }
      ]
    }
  ],
  Checkbox1: [
    { label: "多选-选项1", value: 1 },
    { label: "多选-选项2", value: 2 }
  ],
  Radio1: [
    { label: "单选-选项1", value: 1 },
    { label: "单选-选项2", value: 2 }
  ]
};

async function submitForm() {
  const data = await proForm.value.submitForm();
  if (data) {
    formData.value = data;
  }
}
</script>

<style scoped></style>
