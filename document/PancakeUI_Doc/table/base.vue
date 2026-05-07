<template>
  <pa-title :padding="['bottom']">接口请求参数(params)：</pa-title>

  <code-view v-model:html="params"> </code-view>
  <div class="h400">
    <pa-table id="base-table-v2-demo" ref="proTable" :structure="tableConfig" :request-api="getTableList" :ex-options="exOptions">
      <template #operation>
        <pa-button key="key1" is="save" index="1"> 编辑1 </pa-button>
        <pa-button key="key2" is="trash" index="2"> 编辑2 </pa-button>
        <pa-button key="key3" is="trash" index="3"> 编辑3 </pa-button>
        <pa-button key="key4" is="edit" index="4"> 编辑4 </pa-button>
      </template>
    </pa-table>
  </div>
</template>

<script lang="ts" setup>
import { PaStructureType } from "PancakeType";
import { ref } from "vue";
import { randNum } from "@/package/components/tools/rand-char";

const proTable = ref();
const params = ref({});
const tableConfig: PaStructureType.TableV2[] = [
  { label: "Label-Text", prop: "Text", fixed: "left" },
  { label: "Label-Select", prop: "Select", filterType: "select" },
  {
    label: "Label-Number",
    prop: "Number",
    width: 150,
    cellConfig: {
      type: "number",
      display: true,
      precision: 2
    }
  },
  { label: "操作", prop: "operation" }
];

const exOptions = ref({
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 },
    { label: "选项3", value: 3 },
    { label: "选项4", value: 4 }
  ]
});

const maxLength = 200;
const domeList = Array.from({ length: maxLength }, (_, i) => ({
  Text: `Text-${i + 1}`,
  Select: randNum(1, "1234"),
  Switch: true,
  Number: randNum(Number(randNum(1, "1234")), "0123456789")
}));

async function getTableList(query: any) {
  params.value = query;
  const { PageNum, PageSize } = query.Page;
  const List: any = domeList.slice((PageNum - 1) * PageSize, PageNum * PageSize);
  return new Promise(resolve => {
    resolve({ Data: { TotalCount: domeList.length, List }, Code: 200 });
  });
}
</script>

<style scoped></style>
