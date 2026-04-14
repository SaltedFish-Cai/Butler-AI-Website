<template>
  <div style="height: 200px">
    <sa-table
      id="cell-table-demo"
      ref="proTable"
      :structure="tableConfig"
      :request-api="getTableList"
      :ex-options="exOptions"
      :ex-cell-dependent="exDependent"
      :ex-dependent="exCellDependent"
      row-key="Text"
    >
      <template #operation>
        <sa-button is="edit"> 编辑 </sa-button>
      </template>
    </sa-table>
  </div>
</template>

<script lang="ts" setup>
import { MOptionV2Type, MStructureV2Type } from "M_Types";
import { ref } from "vue";
import { randNum } from "@/package/components/tools/rand-char";

const proTable = ref();
const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Cell-Text", prop: "Text" },
  { label: "Cell-Input", prop: "Input", cellConfig: { type: "input" } },
  { label: "Cell-Number", prop: "Number", cellConfig: { type: "number", min: -10, display: true, precision: 2 } },
  { label: "Cell-Select", prop: "Select", cellConfig: { type: "select" } },
  { label: "Cell-Multiple-Select", prop: "MultipleSelect", cellConfig: { type: "multiple-select" }, width: 300 },
  { label: "Cell-Switch", prop: "Switch", cellConfig: { type: "switch", activeText: "aa", inActiveText: "bb" } },
  { label: "Cell-Radio", prop: "Radio", cellConfig: { type: "radio" } },
  { label: "Cell-Checkbox", prop: "CheckBox", cellConfig: { type: "checkbox" } },
  { label: "Cell-Cascader", prop: "Cascader", cellConfig: { type: "cascader" } },
  { label: "Cell-Time", prop: "Time", cellConfig: { type: "date-picker-group" } },
  { label: "Cell-Icon", prop: "Icon", cellConfig: { type: "select-icon" } },
  { label: "Cell-File", prop: "File", cellConfig: { type: "file" } },
  { label: "Cell-Request-Select", prop: "requestSelect", cellConfig: { type: "request-select" } },
  {
    label: "Cell-Online-Select",
    prop: "onlineSelect",
    cellConfig: { type: "online-select" }
  },
  { label: "操作", prop: "operation" }
];

const exDependent = {
  select_RequestApi: { requestSelect, requestSelect2: requestSelect, onlineSelect },
  exCellRules: {
    Input: {
      roleFn: InputRole,
      errorMessage: "Input值必须大于99"
    }
  }
};

const exCellDependent = {
  disabledRule: { Input: disabledRule },
  file_attachedData: {
    File: { FileTypeCode: "AppealLabelCodeConfirmFiles", BusinessIdentifier: "" }
  }
};

function InputRole(data) {
  return data.Input >= 99;
}

async function requestSelect() {
  // const List = await Api();
  const opt: MOptionV2Type.SelectList = [
    { label: "online-选项1", value: "request-value-1" },
    { label: "online-选项2", value: "request-value-2" }
  ];
  return opt;
}

async function onlineSelect() {
  // const List = await Api();
  const opt: MOptionV2Type.SelectList = [
    { label: "online-选项33", value: "online-value-1" },
    { label: "online-选项44", value: "online-value-2" }
  ];
  return opt;
}

function disabledRule(row) {
  return row.Input == 999;
}

const exOptions = ref({
  Select: [
    { label: "选项1", value: "select-1" },
    { label: "选项2", value: "select-2" }
  ],
  MultipleSelect: [
    { label: "多选项1", value: "multiple-select-1" },
    { label: "多选项2", value: "multiple-select-2" },
    { label: "多选项3", value: "multiple-select-3" },
    { label: "多选项4", value: "multiple-select-4" },
    { label: "多选项5", value: "multiple-select-5" }
  ],
  Switch: {
    activeText: "A",
    inActiveText: "B"
  },
  Radio: [
    { label: "A", value: "a" },
    { label: "B", value: "b" }
  ],
  CheckBox: [
    { label: "A", value: "a" },
    { label: "B", value: "b" }
  ],
  Cascader: [
    {
      label: "A",
      value: "a",
      children: [
        { label: "A-A", value: "aa" },
        { label: "A-B", value: "ab" }
      ]
    },
    {
      label: "B",
      value: "b",
      children: [
        { label: "B-A", value: "ba" },
        { label: "B-B", value: "bb" }
      ]
    }
  ]
});

const maxLength = 1;
const domeList = Array.from({ length: maxLength }, (_, i) => ({
  Text: `Text-${i + 1}`,
  Select: randNum(1, "1234"),
  Switch: true,
  Number: randNum(Number(randNum(1, "1234")), "0123456789")
}));

async function getTableList(query: any) {
  const { PageNum, PageSize } = query.Page;
  const List: any = domeList.slice((PageNum - 1) * PageSize, PageNum * PageSize);
  return new Promise(resolve => {
    resolve({ Data: { TotalCount: domeList.length, List }, Code: 200 });
  });
}
</script>

<style scoped></style>
