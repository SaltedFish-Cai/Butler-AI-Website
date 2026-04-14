<template>
  <div class="h400">
    <m-table-v2
      id="children-table-demo"
      ref="proTable"
      row-key="Text"
      use-children
      :structure="tableConfig"
      :request-api="getTableList"
      :ex-options="exOptions"
    >
      <template #operation>
        <m-button-v2 is="edit"> 编辑 </m-button-v2>
      </template>
    </m-table-v2>
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
  Number: randNum(Number(randNum(1, "1234")), "0123456789"),
  children: Array.from({ length: 3 }, (_, i) => ({
    Text: `Text-${i + 1}`,
    Select: randNum(1, "1234"),
    Switch: true,
    Number: randNum(Number(randNum(1, "1234")), "0123456789")
  }))
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
