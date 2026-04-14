<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="formData"> </code-view>

  <m-form-v2
    id="show-from-demo"
    ref="proForm"
    :data="baseFormData"
    :contrastData="contrastData"
    :structure="formConfig"
    :ex-options="exOptions"
    :ex-cell-dependent="exCellDependent"
  >
  </m-form-v2>

  <div class="flex-center">
    <m-button-v2 is="submit" @click="submitForm">提交Form</m-button-v2>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { MStructureV2Type, MOptionV2Type } from "M_Types";

const proForm = ref();
const baseFormData = ref({
  Checkbox1: [1],
  City: "北京市",
  Icon1: "male_line",
  Input1: "北京市/西城区",
  Number1: -653400.1234,
  Province: "北京市",
  Radio1: 1,
  Region: "东城区",
  Select1: 1,
  Select2: [1],
  Select3: 11,
  Select4: [2, 22],
  Switch2: "1",
  Textarea: "北京市/东城区（东城区）",
  Time1: ["2024-04-23 00:00:00", "2024-04-23 00:00:01"],
  Time2: "2024-04-23",
  Time3: ["2024-04-23", "2024-04-23"],
  Time4: "00:00:00",
  Time5: ["00:20:00", "01:00:01"],
  "Province-City-Region": "820000-820000-820500",
  onlineSelect: 3,
  Transfer: [1],
  File1: [
    {
      FileId: "0000001",
      FileName: "baidu.png",
      FileUrl: "//www.baidu.com/img/flexible/logo/pc/result@2.png",
      FullPath: "//www.baidu.com/img/flexible/logo/pc/result@2.png",
      OriginalName: "baidu.png"
    }
  ]
});

const contrastData = ref({
  Checkbox1: [1],
  City: "北京市",
  Icon1: "cooperation_line",
  Input1: "北京市/东城区",
  Number1: -2123416300.55,
  Province: "北京市",
  Radio1: 2,
  Region: "东城区",
  Select1: 2,
  Select2: [1, 2],
  Select3: 22,
  Select4: [1, 21],
  Switch2: "2",
  Textarea: "北京市/东城区（北京市）",
  Time1: ["2024-04-23 00:00:00", "2024-04-23 00:00:01"],
  Time2: "2024-04-23",
  Time3: ["2024-04-23", "2024-04-23"],
  Time4: "02:01:01",
  Time5: ["00:00:00", "00:00:01"],
  onlineSelect: 3,
  Transfer: [1, 2]
});

const formData = ref({});

const formConfig: MStructureV2Type.FormV2[] = [
  { label: "输入框", prop: "Input1", type: "input", maxLength: 2000 },
  { label: "文本域", prop: "Textarea", type: "textarea", maxLength: 2000 },
  { label: "数字输入框", prop: "Number1", type: "number", precision: 2 },
  { label: "下拉框", prop: "Select1", type: "select" },
  { label: "远端下拉框", prop: "onlineSelect", type: "online-select" },
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
  { label: "年", prop: "Time2", type: "year-picker" },
  { label: "月", prop: "Time2", type: "month-picker" },
  { label: "日期组", prop: "Time3", type: "date-picker-group" },
  { label: "时间", prop: "Time4", type: "time-picker" },
  { label: "时间组", prop: "Time5", type: "time-picker-group" },
  { label: "日期时间组", prop: "Time1", type: "date-time-picker-group" },
  { label: "文件", prop: "File1", type: "file", fileMultiple: 2, rules: [] },
  { label: "穿梭框", prop: "Transfer", type: "transfer" }
];

const exCellDependent = {
  file_attachedData: {
    File1: { FileTypeCode: "AppealLabelCodeConfirmFiles", BusinessIdentifier: "" }
  },
  select_RequestApi: {
    onlineSelect: remoteMethodFn
  }
};

async function remoteMethodFn({ query }): Promise<MOptionV2Type.SelectList> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { label: `选项${query}-1`, value: 3 },
        { label: `选项${query}-2`, value: 4 }
      ] as MOptionV2Type.SelectList);
    }, 1000);
  });
}

const exOptions: MOptionV2Type.Default = {
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

<style scoped></style>
