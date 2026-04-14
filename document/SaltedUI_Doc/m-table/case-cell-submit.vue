<template>
  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="tableFormData"> </code-view>

  <div class="vp_title_label">效果展示</div>
  <div style="height: 200px">
    <m-table-v2
      id="cell-table-demo-submit"
      ref="proTable"
      :structure="tableConfig"
      :request-api="getTableList"
      :ex-dependent="exDependent"
      row-key="Text"
    >
      <template #operation>
        <m-button-v2 is="edit"> 编辑 </m-button-v2>
      </template>

      <template #FooterCenter>
        <m-button-v2 is="edit" @click="submitTable"> 提交表格 </m-button-v2>
      </template>
    </m-table-v2>
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
