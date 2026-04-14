<template>
  <m-table-v2
    id="slot-table-demo1"
    ref="proTable"
    flat
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-options="exOptions"
  >
    <template #HeaderLeft><div class="max-box">HeaderLeft Slot</div></template>

    <template #HeaderCenter><div class="max-box">HeaderCenter Slot</div></template>

    <template #ToolButton><div class="max-box">ToolButton Slot</div></template>

    <template #HeaderAfter><div class="max-box">HeaderAfter Slot</div></template>

    <template #BodyAppend><div class="max-box">BodyAppend Slot</div></template>

    <template #Pagination><div class="max-box">Pagination Slot</div></template>

    <template #FooterCenter><div class="max-box">FooterCenter Slot</div></template>

    <template #FooterLeft><div class="max-box">FooterLeft Slot</div></template>
  </m-table-v2>

  <div class="line"></div>

  <m-table-v2
    id="slot-table-demo2"
    ref="proTable"
    flat
    :structure="tableConfig"
    :request-api="getTableListNull"
    :ex-options="exOptions"
  >
    <template #ToolButtonInline><div class="max-inline-box">ToolButtonInline Slot</div></template>
  </m-table-v2>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import { MStructureV2Type, MOptionV2Type } from "M_Types";

const proTable = ref();
const params = ref("");

const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" }
];

const exOptions: Ref<MOptionV2Type.Default> = ref({
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: 1 },
        { Text: "Text-d2i23411", Select: 2 }
      ]
    },
    Code: 200
  };
}

async function getTableListNull(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 0,
      List: []
    },
    Code: 200
  };
}
</script>

<style scoped>
.max-box {
  display: inline-block;
  height: 100%;
  text-align: center;
  font-size: 14px;
  background-color: var(--el-color-warning-light-7);
}
.max-inline-box {
  text-align: center;
  background-color: var(--el-color-success-light-7);
}
.line {
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: var(--vp-c-divider);
}
</style>
