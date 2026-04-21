<template>
  <m-quick-table ref="visibleTableRef" :tableConfig="tableConfig" :tableData="tableData" :exOptions="exTableOptions">
    <template #Header>
      <pa-button
        is="add"
        @click="
          optionsVisible = true;
          editId = '';
        "
        >{{ language === "en-US" ? "New Data" : "新建数据" }}</pa-button
      >
    </template>
    <template #operation="{ data }">
      <pa-button is="edit" @click="handleEdit(data.id)"> {{ language === "en-US" ? "Edit" : "编辑" }} </pa-button>
      <pa-button is="delete" @click="handleDelete(data.id)"> {{ language === "en-US" ? "Delete" : "删除" }} </pa-button>
    </template>
  </m-quick-table>

  <pa-dialog
    v-model="optionsVisible"
    :title="{ 'zh-CN': '编辑数据', 'en-US': 'Edit Data' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="s"
  >
    <pa-form
      id="data-management-form"
      ref="formRef"
      :structure="formConfig"
      :exOptions="editId ? exTableOptions : exOptions"
      :ex-span="1"
      @form-cell-change="cellChange"
    />

    <template #footer>
      <pa-button is="save" @click="handleSubmit">
        {{ language === "en-US" ? "Save Simulated Interface" : "保存模拟接口" }}
      </pa-button>
    </template>
  </pa-dialog>
</template>

<script lang="tsx" setup>
import { ComputedRef, inject, ref, useTemplateRef, computed, onMounted, nextTick } from "vue";
import { PaOptionType, PaStructureType } from "M_Types";
import { PancakeGlobalConfigType } from "../../../pa-manager/type";
import { MInterfaceConfig, PaPlaygroundPagesType, MStructureType } from "../../type";
import { deleteData, getAllData, getDataById, storeData, updateData } from "../../../indexDB/indexDB";
import { M_Message, M_MessageBox } from "../../../feedback";
import MQuickTable from "../quick-table.vue";

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";
const visibleTableRef = useTemplateRef("visibleTableRef");
const props = withDefaults(
  defineProps<{
    id: string;
    playgroundItems: PaPlaygroundPagesType[];
    interfaceConfigs: MInterfaceConfig[];
    dataStructures: MStructureType[];
  }>(),
  {}
);
const tableData = ref<{ apiFunction: string; apiUrlId: string }[]>([]);

const optionsVisible = ref(false);
const editId = ref("");
const DB_NAME = "DB_" + props.id;
const STORE_NAME = "DB_" + props.id + "_Api";

const tableConfig = ref<PaStructureType.TableV2[]>([
  { prop: "apiUrlId", label: { "en-US": "API URL", "zh-CN": "API地址" }, filterType: "select" },
  { prop: "apiFunction", label: { "en-US": "API Function", "zh-CN": "API功能" }, filterType: "select" },
  { prop: "apiActionKey", label: { "en-US": "API Action Key", "zh-CN": "API操作键值" } },
  { prop: "operation", label: { "en-US": "Operation", "zh-CN": "操作" }, width: "170px" }
]);

const formConfig = computed<PaStructureType.FormV2[]>(() => {
  return [
    {
      prop: "apiUrlId",
      label: { "en-US": "API URL", "zh-CN": "API选择" },
      type: "select",
      display: editId.value ? true : false
    },
    { prop: "apiFunction", label: { "en-US": "API Function", "zh-CN": "API功能" }, type: "select" },
    {
      prop: "apiActionKey",
      label: { "en-US": "API Action Key", "zh-CN": "API操作键值" },
      type: "select",
      rules: [{ required: false }]
    }
  ];
});

const formRef = useTemplateRef("formRef");
const interfaceConfigsOptions = ref(
  props.interfaceConfigs.map(item => ({ label: `${item.name} (${item.apiUrl})`, value: item.id }))
);

const exOptions = ref<PaOptionType.Default>({
  apiUrlId: [],
  apiFunction: [
    { label: { "en-US": "Get", "zh-CN": "获取数据" }, value: "getData" },
    { label: { "en-US": "Add/Update", "zh-CN": "新增/修改" }, value: "newData" },
    { label: { "en-US": "Delete", "zh-CN": "删除" }, value: "deleteData" }
  ]
});

const exTableOptions = ref<PaOptionType.Default>({
  apiUrlId: interfaceConfigsOptions.value,
  apiFunction: [
    { label: { "en-US": "Get", "zh-CN": "获取数据" }, value: "getData" },
    { label: { "en-US": "Add/Update", "zh-CN": "新增/修改" }, value: "newData" },
    { label: { "en-US": "Delete", "zh-CN": "删除" }, value: "deleteData" }
  ]
});

// 确认编辑数据
async function handleEdit(id: number) {
  editId.value = id.toString();
  const { data } = await getDataById(DB_NAME, STORE_NAME, id);
  if (data) {
    optionsVisible.value = true;
    setTimeout(() => {
      formRef.value?.changeData_All({ id: id, ...data });
      cellChange({ prop: "apiUrlId", value: data.apiUrlId });
    }, 300);
  } else {
    M_Message.danger(language === "en-US" ? "Data not found" : "数据不存在");
  }
}

// 确认单元格变化
function cellChange({ prop, value }) {
  if (prop === "apiUrlId") {
    const findInterfaceConfigs = props.interfaceConfigs.find(item => item.id === value);
    if (findInterfaceConfigs) {
      const findDataStructure = props.dataStructures.find(item => item.id === findInterfaceConfigs.dataStructure);
      if (findDataStructure) {
        exOptions.value["apiActionKey"] = findDataStructure.config.map(item => ({ label: item.description, value: item.prop }));
        exTableOptions.value["apiActionKey"] = findDataStructure.config.map(item => ({
          label: item.description,
          value: item.prop
        }));
      }
    }
  }
}

// 确认删除数据
async function handleDelete(id: number) {
  M_MessageBox.delete({
    onConfirm: async () => {
      try {
        await deleteData(DB_NAME, STORE_NAME, id);
        getTableList();

        M_Message.success(language === "en-US" ? "Data deleted successfully" : "数据删除成功");
      } catch (error) {
        M_Message.danger(language === "en-US" ? "Data deletion failed" : "数据删除失败" + error);
      }
    }
  });
}

// 确认提交数据
async function handleSubmit() {
  const data = await formRef.value?.getSubmitForm();

  if (data && data !== "no-change") {
    if (data.id) {
      // 存储数据到IndexedDB
      try {
        await updateData(DB_NAME, STORE_NAME, "apiUrlId", data.apiUrlId, data);
        M_Message.success(language === "en-US" ? "Data updated successfully" : "数据更新成功");
        optionsVisible.value = false;
        getTableList();
      } catch (error) {
        M_Message.danger(language === "en-US" ? "Data update failed" : "数据更新失败" + error);
      }
    } else {
      // 存储数据到IndexedDB
      try {
        await storeData(DB_NAME, STORE_NAME, data);
        M_Message.success(language === "en-US" ? "Data stored successfully" : "数据存储成功");
        optionsVisible.value = false;
        getTableList();
      } catch (error) {
        M_Message.danger(language === "en-US" ? "Data storage failed" : "数据存储失败" + error);
      }
    }
  }
}

// 获取表格数据
async function getTableList() {
  try {
    const data = await getAllData(DB_NAME, STORE_NAME);
    const _data = data.map(item => ({ ...item.data, id: item.id }));
    tableData.value = _data;
    exOptions.value["apiUrlId"] = setApiUrlId();
  } catch (error) {
    exOptions.value["apiUrlId"] = setApiUrlId();
  }
  nextTick(() => {
    visibleTableRef.value?.setWidth();
  });
}

function setApiUrlId() {
  const outData = interfaceConfigsOptions.value.filter(
    item => tableData.value.findIndex(data => data.apiUrlId === item.value) === -1
  );
  return outData;
}
onMounted(() => {
  getTableList();
});

defineExpose({});
</script>

<style lang="scss" scoped></style>
