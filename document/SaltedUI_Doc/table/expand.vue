<template>
  <div class="h400">
    <sa-table
      id="expand-table-demo"
      ref="proTable"
      :structure="tableConfig"
      :request-api="getTableList"
      use-expand
      :ex-options="exOptions"
      row-key="Text"
    >
      <template #Expand="scope">
        <div class="expand-class">这里是展开的内容 Scope : {{ scope }}</div>
      </template>
      <template #operation="{ index, row }">
        <sa-button is="edit" @click="openExpand(index, row)"> 编辑 </sa-button>
      </template>
    </sa-table>
  </div>
</template>

<script lang="ts" setup>
import { MStructureV2Type } from "M_Types";
import { ref } from "vue";
import { randNum } from "@/package/components/tools/rand-char";

const proTable = ref();

const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" },
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
  const { PageNum, PageSize } = query.Page;
  const List: any = domeList.slice((PageNum - 1) * PageSize, PageNum * PageSize);
  return new Promise(resolve => {
    resolve({ Data: { TotalCount: domeList.length, List }, Code: 200 });
  });
}

function openExpand(index, row) {
  proTable.value.setExpandRowKey(index, row, true);
}
</script>

<style scoped>
.expand-class {
  padding: var(--sa-size-padding);
}
</style>
