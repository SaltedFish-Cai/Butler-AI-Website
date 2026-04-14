<template>
  <div class="flex config-box">
    <div class="in_title_label">显示筛选/刷新：<m-switch-v2 v-model="state.useToolButton" /></div>
    <div class="in_title_label">是否显示分页功能：<m-switch-v2 v-model="state.usePagination" /></div>
    <div class="in_title_label">是否功能按钮嵌入式样式：<m-switch-v2 v-model="state.embeddedToolButton" /></div>
  </div>

  <div class="vp_title_label">FormData结果值：</div>

  <code-view v-model:html="tableFormData"> </code-view>

  <div class="vp_title_label">效果展示</div>
  <m-table-v2
    id="options-table-demo"
    ref="proTable"
    :structure="tableConfig"
    :request-api="getTableList"
    :ex-options="exOptions"
    :useToolButton="state.useToolButton"
    :usePagination="state.usePagination"
    use-select
    :embeddedToolButton="state.embeddedToolButton"
    :exPagination="exPagination"
    row-key="Text"
  >
    <template #operation>
      <m-button-v2 is="edit"> 编辑 </m-button-v2>
    </template>
  </m-table-v2>
</template>

<script lang="ts" setup>
import { MStructureV2Type } from "M_Types";
import { ref, reactive } from "vue";

const proTable = ref();
const params = ref({});
const tableFormData = ref({});
const state = reactive({
  useToolButton: true,
  usePagination: true,
  embeddedToolButton: true
});

const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Input", prop: "Input", width: 200 },
  { label: "Label-Select", prop: "Select" },
  { label: "操作", prop: "operation" }
];

const exPagination = ref({
  pageNum: 1,
  pageSize: 100,
  pageSizes: [100, 200, 300]
});

const exOptions = ref({
  Select: [
    { label: "选项1", value: "select-1" },
    { label: "选项2", value: "select-2" }
  ]
});

async function getTableList(paramsData: any) {
  params.value = paramsData;
  return {
    Data: {
      TotalCount: 2,
      List: [
        { Text: "Text-692f8002", Select: "select-2", Input: 999 },
        { Text: "Text-d2i23411", Select: "select-2", Input: 66 }
      ]
    },
    Code: 200
  };
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
