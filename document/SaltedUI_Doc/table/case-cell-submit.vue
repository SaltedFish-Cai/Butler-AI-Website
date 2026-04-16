<template>
  <sa-title :padding="['bottom']">FormData结果值：</sa-title>

  <code-view v-model:html="tableFormData"> </code-view>

  <sa-title :padding="['bottom']">效果展示</sa-title>
  <div style="height: 200px">
    <sa-table
      id="cell-table-demo-submit"
      ref="proTable"
      :structure="tableConfig"
      :request-api="getTableList"
      :ex-dependent="exDependent"
      row-key="Text"
    >
      <template #operation>
        <sa-button is="edit"> 编辑 </sa-button>
      </template>

      <template #FooterCenter>
        <sa-button is="edit" @click="submitTable"> 提交表格 </sa-button>
      </template>
    </sa-table>
  </div>
</template>

<script lang="ts" setup>
import { MStructureV2Type } from "M_Types";
import { ref } from "vue";

const proTable = ref();
const params = ref({});
const tableFormData = ref({});

const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Cell-Input", prop: "Input", cellConfig: { type: "input" } },
  { label: "Cell-Input1", prop: "Input1", cellConfig: { type: "input" } },
  { label: "Cell-Input2", prop: "Input2", cellConfig: { type: "input" } },
  { label: "Cell-Input3", prop: "Input3", cellConfig: { type: "input", required: false } }
];

const exDependent = {
  exCellRules: {
    Input1: [{ validator: validatorRules, trigger: "blur" }]
  }
};

function validatorRules({ value, callback }) {
  if (value >= 99) {
    callback();
  } else {
    callback(new Error(`Input值必须大于99`));
  }
}

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [{ Text: "Text-692f8002", Input: 999, Input1: 11, Number: 81827, Switch: true }]
    },
    Code: 200
  };
}

async function submitTable() {
  const data = await proTable.value.getSubmitTableList();
  tableFormData.value = data;
}
</script>

<style scoped>
.vp_title_label {
  height: 32px;
}
.in_title_label {
  width: 33%;
  font-size: 14px;
}
.config-box {
  flex-wrap: wrap;
  padding: 5px 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
}
</style>
