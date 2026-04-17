<template>
  <sa-dialog
    v-model="visible"
    :title="{ 'zh-CN': '接口管理', 'en-US': 'Interface Management' }"
    :padding="['all']"
    :closeOnClickModal="false"
    @closed="handleClose"
    size="l"
  >
    <m-quick-table ref="tableRef" :tableConfig="tableConfig" :tableData="inEditData" :ex-options="exOptions">
      <template #Header>
        <sa-button is="add" @click="handleAdd" :text="{ 'zh-CN': '新建接口', 'en-US': 'New Interface' }" />
      </template>

      <template #operation="{ data }">
        <sa-button
          is="edit"
          @click="handleEdit(data as MInterfaceConfig)"
          :text="{ 'zh-CN': '编辑接口', 'en-US': 'Edit Interface' }"
        />
        <sa-button
          is="delete"
          @click="handleDelete(data as MInterfaceConfig)"
          :text="{ 'zh-CN': '删除接口', 'en-US': 'Delete Interface' }"
        />
      </template>
    </m-quick-table>
  </sa-dialog>

  <sa-dialog
    v-model="editVisible"
    :title="{ 'zh-CN': '接口编辑', 'en-US': 'Interface Edit' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="s"
  >
    <sa-form
      id="sa-playground_base"
      ref="formRef"
      :structure="formConfig"
      :data="inEditDataItem"
      :ex-span="1"
      :ex-options="exOptions"
      @form-cell-change="handleFormCellChange"
    >
    </sa-form>

    <template #footer>
      <sa-button is="save" @click="handleSubmit" :text="{ 'zh-CN': '保存配置', 'en-US': 'Save Config' }" />
    </template>
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef, watch } from "vue";
import { MInterfaceConfig, MStructureType } from "../type";
import { SaOptionType, SaStructureType } from "M_Types";
import { M_Message, M_MessageBox } from "../../feedback";
import { SaltedGlobalConfigType } from "../../sa-content/type";
import MQuickTable from "./quick-table.vue";

const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const languageValue = computed(() => {
  return SaltedGlobalConfig.value?.language?.value || "zh-CN";
});

const tableRef = useTemplateRef("tableRef");

const props = withDefaults(
  defineProps<{
    editBaseData: MInterfaceConfig[];
    dataStructures: MStructureType[];
  }>(),
  {}
);

const inEditData = ref<MInterfaceConfig[]>([]);
const inEditDataItem = ref<MInterfaceConfig>({} as MInterfaceConfig);

const formConfig = ref<SaStructureType.FormV2[]>([
  { label: { "zh-CN": "接口名称", "en-US": "Interface Name" }, prop: "name", type: "input" },
  { label: { "zh-CN": "API 类型", "en-US": "API Type" }, prop: "apiType", type: "select" },
  { label: { "zh-CN": "API URL", "en-US": "API URL" }, prop: "apiUrl", type: "input" },
  { label: { "zh-CN": "数据源", "en-US": "Data Source" }, prop: "dataStructure", type: "select" },
  {
    label: { "zh-CN": "请求带参", "en-US": "Request Parameters" },
    prop: "requestParameters",
    type: "multiple-select",
    rules: [{ required: false }]
  }
]);

const tableConfig = ref<SaStructureType.TableV2[]>([
  { label: { "zh-CN": "接口名称", "en-US": "Interface Name" }, prop: "name", width: "200px" },
  { label: { "zh-CN": "API 类型", "en-US": "API Type" }, prop: "apiType", width: "150px" },
  { label: { "zh-CN": "API URL", "en-US": "API URL" }, prop: "apiUrl" },
  { label: { "zh-CN": "数据源", "en-US": "Data Source" }, prop: "dataStructure", filterType: "select", width: "200px" },
  { label: { "zh-CN": "操作", "en-US": "Operation" }, prop: "operation" }
]);

const exOptions = ref<SaOptionType.Default>({
  apiType: [
    { value: "get", label: "GET" },
    { value: "post", label: "POST" }
  ]
});

const formRef = useTemplateRef("formRef");
const emits = defineEmits(["submit"]);

const visible = ref(false);
const editVisible = ref(false);

// 处理表单单元格变化
const handleFormCellChange = ({ prop, value }) => {
  if (prop === "dataStructure") {
    const findItem = props.dataStructures.find(i => i.id === value);
    if (findItem) {
      exOptions.value["requestParameters"] =
        findItem.config.map(i => {
          return { value: i.prop, label: i.label || i.description };
        }) || [];
    }
  }
};

// # 打开新建接口弹窗
const handleAdd = () => {
  inEditDataItem.value = {} as MInterfaceConfig;
  editVisible.value = true;
};

// # 编辑接口
const handleEdit = (item: MInterfaceConfig) => {
  handleFormCellChange({ prop: "dataStructure", value: item.dataStructure });
  inEditDataItem.value = item;
  editVisible.value = true;
};

// # 删除接口
const handleDelete = (item: MInterfaceConfig) => {
  M_MessageBox.delete({
    message: languageValue.value === "zh-CN" ? "确认删除接口吗？" : "Are you sure you want to delete the interface?",
    onConfirm: async () => {
      try {
        inEditData.value = inEditData.value.filter(i => i.id !== item.id);
        M_Message.success(languageValue.value === "zh-CN" ? "接口删除成功" : "Interface deleted successfully");
      } catch (error) {
        M_Message.danger(languageValue.value === "zh-CN" ? "接口删除失败" + error : "Interface deletion failed" + error);
      }
    }
  });
};

// # 打开编辑表格列弹窗
const openEditTableColDialog = () => {
  exOptions.value["dataStructure"] = props.dataStructures.map(i => ({ value: i.id, label: i.description }));
  visible.value = true;
};

// 提交表单
async function handleSubmit() {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    if (formData.id) {
      inEditData.value = inEditData.value.map(i => (i.id === formData.id ? { ...formData } : i)) as MInterfaceConfig[];
    } else {
      inEditData.value.push({ ...formData, id: Date.now().toString() } as MInterfaceConfig);
    }

    editVisible.value = false;
    tableRef.value?.setWidth();
  }
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false;
  emits("submit", inEditData.value);
};

watch(
  () => props.editBaseData,
  newVal => {
    inEditData.value = newVal || [];
  },
  { immediate: true }
);

defineExpose({
  open: openEditTableColDialog
});
</script>

<style scoped></style>
