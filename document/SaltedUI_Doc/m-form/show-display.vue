<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <div class="config-box">
    <div class="in_title_label">使用 Display 模式：<m-switch v-model="state.display" /></div>
    <div class="in_title_label">使用 上标题 模式：<m-switch v-model="state.useTopTitle" /></div>
    <div class="in_title_label">使用 Disabled 模式：<m-switch v-model="state.disabled" /></div>
  </div>
  <m-form-v2
    id="show-from-demo"
    ref="proForm"
    :labelWidth="100"
    :data="baseFormData"
    :structure="formConfig"
    :ex-options="exOptions"
    :ex-cell-dependent="exDependent"
    :display="state.display"
    :disabled="state.disabled"
    :labelPosition="state.useTopTitle ? 'top' : 'right'"
  />
  <div class="flex-center">
    <m-button-v2 is="submit" @click="submitForm">提交Form</m-button-v2>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { MStructureV2Type, MOptionV2Type } from "M_Types";

const proForm = ref();
const formData = ref({});

const state: any = reactive({
  display: false,
  disabled: false,
  useTopTitle: true
});
const baseFormData = ref({
  groupProp: "value2",
  Input1: "Input1",
  Textarea: "阿斯蒂芬阿斯蒂芬阿斯蒂芬阿斯蒂芬阿斯蒂芬",
  Number1: 66,
  Select1: 1,
  Select2: [1, 2, 3],
  Select3: [2],
  Select4: [11, 1],
  Switch2: "1",
  Radio1: 1,
  Checkbox1: [2],
  Province: "河北省",
  City: "秦皇岛市",
  Region: "山海关区",
  Time1: ["2024-04-16 00:00:00", "2024-04-24 00:00:00"],
  Time2: "2024-05",
  Time3: ["2024-04-24", "2024-05-03"],
  Time4: "16:47:30",
  Time5: ["16:47:30", "17:47:30"],
  Transfer: [1]
});

const formConfig: MStructureV2Type.FormV2[] = [
  {
    label: "group组",
    prop: "groupProp",
    type: "group",
    groupFormConfig: [
      {
        label: "选项1",
        prop: "childProp1",
        type: "input",
        value: "value1"
      },
      {
        label: "选项2",
        prop: "childProp2",
        value: "value2",
        type: "select",
        exOptions: [
          { label: "ch选项1", value: 1 },
          { label: "ch选项2", value: 2 }
        ]
      }
    ]
  },
  { label: "输入框", prop: "Input1", type: "input", disabled: true },
  { label: "文本域", prop: "Textarea", type: "textarea" },
  { label: "数字输入框", prop: "Number1", type: "number" },
  {
    label: "下拉框",
    prop: "Select1",
    type: "select",
    exOptions: [
      { label: "选项1", value: 1 },
      { label: "选项2", value: 2 }
    ]
  },
  { label: "多选下拉框", prop: "Select2", type: "multiple-select" },
  { label: "联级选择", prop: "Select3", type: "cascader-check" },
  { label: "联级选择多选", prop: "Select4", type: "multiple-cascader-check" },
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
  { label: "地址选择", prop: "Province-City-Region", type: "address" },
  { label: "月份", prop: "Time2", type: "month-picker" },
  { label: "日期组", prop: "Time3", type: "date-picker-group" },
  { label: "时间", prop: "Time4", type: "time-picker" },
  { label: "时间组", prop: "Time5", type: "time-picker-group" },
  { label: "日期时间组", prop: "Time1", type: "date-picker-group" },
  { label: "文件", prop: "File1", type: "file" },
  { label: "穿梭框", prop: "Transfer", type: "transfer" }
];

const exDependent = {
  file_attachedData: {
    File1: { FileTypeCode: "AppealLabelCodeConfirmFiles", BusinessIdentifier: "" }
  }
};

const exOptions: MOptionV2Type.Default = {
  Switch2: {
    activeValue: "1",
    inActiveValue: "2",
    activeText: "选择1",
    inActiveText: "选择2"
  },

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
  ],
  Transfer: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 },
    { label: "选项3", value: 3 },
    { label: "选项4", value: 4 }
  ]
};

async function submitForm() {
  const data = await proForm.value.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
</script>

<style scoped>
.config-box {
  flex-wrap: wrap;
  padding: 5px 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
}
</style>
