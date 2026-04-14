<template>
  <div style="height: 200px">
    <m-table-v2
      id="tag-table-demo"
      ref="proTable"
      :structure="tableConfig"
      :request-api="getTableList"
      :ex-options="exOptions"
      :ex-cell-dependent="exDependent"
      row-key="Text"
    >
      <template #operation>
        <m-button-v2 is="edit"> 编辑 </m-button-v2>
      </template>
    </m-table-v2>
  </div>
</template>

<script lang="ts" setup>
import { MOptionV2Type, MStructureV2Type } from "M_Types";
import { ref, nextTick } from "vue";
import { M_Notification } from "@/package/components/feedback";

const proTable = ref();
const params = ref({});

const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Cell-Text", prop: "Text" },
  { label: "Cell-Input", prop: "Select", cellConfig: { type: "tag" } },
  { label: "操作", prop: "operation" }
];

const exOptions = ref({});

const exDependent = {
  tag_click: {
    Select: targetTags
  }
};
function targetTags(data) {
  M_Notification.info({
    title: "点击标签",
    message: `${JSON.stringify(data)}`
  });
}

nextTick(async () => {
  const Select: MOptionV2Type.SelectList = [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 },
    { label: "选项3", value: 3 }
  ];
  const bgColor = ["#33b698", "#409eff", "#ff4040"];
  for (let index = 0; index < Select.length; index++) {
    Select[index].tagStyle = { bgColor: bgColor[index], textColor: "#fff" };
  }
  exOptions.value = { Select };
});

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: ["1", "2", "3"] },
        { Text: "Text-d2i23411", Select: "2" }
      ]
    },
    Code: 200
  };
}
</script>

<style scoped></style>
