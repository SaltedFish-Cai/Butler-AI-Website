<template>
  <m-quick-table ref="visibleTableRef" :tableConfig="tableConfig" :tableData="tableData" :exOptions="exOption">
    <template #Header>
      <pa-button is="sync" @click="handleSync">{{ language === "en-US" ? "Sync" : "表同步" }}</pa-button>
    </template>
    <template #operation="{ data }">
      <pa-button is="view" @click="handleView(data as MStructureType)">
        {{ language === "en-US" ? "View Data" : "查看数据" }}
      </pa-button>
    </template>
  </m-quick-table>

  <pa-dialog
    v-model="optionsVisible"
    :title="{ 'zh-CN': '编辑数据', 'en-US': 'Edit Data' }"
    :padding="['all']"
    :closeOnClickModal="false"
  >
    <pa-table
      id="data-management-table"
      ref="visibleTableRef2"
      :structure="tableConfig2"
      :request-api="getTableList2"
      :exOptions="exOptionsTable2"
      :use-pagination="false"
    >
    </pa-table>
  </pa-dialog>
</template>

<script lang="tsx" setup>
import { ComputedRef, inject, ref, useTemplateRef, onMounted, nextTick } from "vue";
import { PaOptionType, PaStructureType } from "M_Types";
import { PancakeGlobalConfigType } from "../../../pa-manager/type";
import { MInterfaceConfig, PaPlaygroundPagesType, MStructureType } from "../../type";
import { getAllData, storeData, updateData } from "../../../indexDB/indexDB";
import { M_Message } from "../../../feedback";
import MQuickTable from "../quick-table.vue";

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

const props = withDefaults(
  defineProps<{
    id: string;
    playgroundItems: PaPlaygroundPagesType[];
    interfaceConfigs: MInterfaceConfig[];
    dataStructures: MStructureType[];
  }>(),
  {}
);

const visibleTableRef = useTemplateRef("visibleTableRef");

const tableData = ref<MStructureType[]>([]);

const optionsVisible = ref(false);
const DB_NAME = "DB_" + props.id;
const STORE_NAME = "DB_" + props.id + "_DataMap";

const exOptionsTable2 = ref<PaOptionType.Default>({
  valueType: [
    { label: { "en-US": "Text", "zh-CN": "文本" }, value: "text" },
    { label: { "en-US": "Number", "zh-CN": "数字" }, value: "number" },
    { label: { "en-US": "Boolean", "zh-CN": "布尔值" }, value: "boolean" },
    { label: { "en-US": "Date", "zh-CN": "日期" }, value: "date" }
  ]
});
const tableConfig = ref<PaStructureType.TableV2[]>([
  { prop: "description", label: { "en-US": "Data Table Name", "zh-CN": "数据表名" } },
  { prop: "status", label: { "en-US": "Status", "zh-CN": "状态" }, filterType: "select" },
  { prop: "operation", label: { "en-US": "Operation", "zh-CN": "操作" }, width: "120px" }
]);

const tableConfig2 = ref<PaStructureType.TableV2[]>([]);

const exOption = {
  status: [
    { label: { "en-US": "Active", "zh-CN": "活跃" }, value: "1" },
    { label: { "en-US": "Inactive", "zh-CN": "不活跃" }, value: "0" }
  ]
};

const visibleTableRef2 = useTemplateRef("visibleTableRef2");

const tableData2: any = ref([]);

// 确认编辑数据
async function handleView(data: MStructureType) {
  if (data) {
    try {
      const NAME = "DB_" + props.id + "_API_" + data.id;
      tableConfig2.value = data.config.map(item => ({
        label: item.description,
        prop: item.prop
      })) as PaStructureType.TableV2[];
      const dataList = await getAllData(DB_NAME, NAME);
      optionsVisible.value = true;
      tableData2.value = dataList;
      visibleTableRef2.value?.getTableList();
    } catch (error) {
      M_Message.danger(language === "en-US" ? "No data found" : "暂无数据");
    }
  } else {
    M_Message.danger(language === "en-US" ? "Data not found" : "数据不存在");
  }
}

// 同步数据
async function handleSync() {
  try {
    // 处理props.dataStructures中的数据
    for (const dataStructure of props.dataStructures) {
      const findData = tableData.value.find(item => item.id === dataStructure.id) as MStructureType & { dbid: number };
      if (findData) {
        // 两者都有，使用updateData更新，status = 1
        await updateData(DB_NAME, STORE_NAME, "id", findData.id, { ...dataStructure, status: "1" });
      } else {
        // props.dataStructures有，tableData.value没有，使用storeData新增，status = 1
        await storeData(DB_NAME, STORE_NAME, { ...dataStructure, status: "1" });
      }
    }

    // 处理tableData.value中有但props.dataStructures中没有的数据
    for (const item of tableData.value) {
      const findData = props.dataStructures.find(dataStructure => dataStructure.id === item.id);
      if (!findData) {
        // props.dataStructures没有，tableData.value有，使用updateData更新，status = 0
        await updateData(DB_NAME, STORE_NAME, "id", (item as MStructureType & { dbid: number }).id, { ...item, status: "0" });
      }
    }

    await getTableList();
    M_Message.success(language === "en-US" ? "Data structures synchronized successfully" : "数据结构同步成功");
  } catch (error) {
    console.error("同步数据结构失败:", error);
    M_Message.danger(language === "en-US" ? "Data structure synchronization failed" : "数据结构同步失败" + error);
  }
}

// 获取表格数据
async function getTableList() {
  const data = await getAllData(DB_NAME, STORE_NAME);
  const _data = data.map(item => ({ ...item.data, dbid: item.id }));
  tableData.value = _data;
  nextTick(() => {
    visibleTableRef.value?.setWidth();
  });
}

function getTableList2() {
  return { Data: tableData2.value, Code: 200 };
}

onMounted(() => {
  getTableList();
});
</script>

<style lang="scss" scoped></style>
