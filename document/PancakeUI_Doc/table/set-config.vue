<template>
  <pa-title :padding="['bottom']">全局配置：</pa-title>
  <div class="flex config-box">
    <div class="in_title_label">表列宽缓存：<el-switch v-model="globalConfig.isKeepAliveTableWidth" /></div>
    <div class="in_title_label">表列宽自动列宽： <el-switch v-model="globalConfig.isAutoTableWidth" /></div>
    <div class="in_title_label">表格文本一键复制： <el-switch v-model="globalConfig.isTableTextCopy" /></div>
    <div class="in_title_label">表缩放： <el-input-number v-model="globalConfig.tableGlobalZoom" :min="1" size="small" :max="100" :controls="false" /></div>
  </div>

  <m-table id="set-config-table-demo" ref="proTable" flat :structure="tableConfig" :request-api="getTableList" :ex-options="exOptions">
    <template #operation>
      <pa-button is="edit"> 编辑 </pa-button>
    </template>
  </m-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { PaStructureType } from "PancakeType";

const proTable = ref();
const globalConfig = ref({
  // 表列宽缓存
  isKeepAliveTableWidth: false,
  // 表列宽自动列宽
  isAutoTableWidth: false,
  // 表格文本一键复制
  isTableTextCopy: false,
  // 表缩放
  tableGlobalZoom: 100
});

const tableConfig: PaStructureType.Table[] = [
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Select", prop: "Select", filterType: "select" },
  { label: "操作", prop: "operation" }
];

const exOptions = ref({
  Select: [
    { label: "选项1", value: 1 },
    { label: "选项2", value: 2 }
  ]
});

onMounted(() => {
  // const _window: any = window;
  // globalConfig.value = _window.getManagerTableGlobalConfig();
});

async function getTableList(params: any) {
  console.log("++++++++++> params:", params);

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
</script>

<style scoped lang="scss">
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
