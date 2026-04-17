<template>
  <sa-dialog
    v-model="visible"
    :title="{ 'zh-CN': '扩展选项管理', 'en-US': 'Extension Option Management' }"
    :padding="['all']"
    :closeOnClickModal="false"
    @closed="handleClose"
  >
    <m-quick-table ref="tableRef" :tableData="inEditData" :tableConfig="tableConfig" :ex-options="exOptions">
      <template #Header>
        <sa-button is="add" @click="handleAdd" :text="{ 'zh-CN': '新建选项', 'en-US': 'New Option' }" />
      </template>

      <template #operation="{ data }">
        <sa-button
          is="edit"
          @click="handleEdit(data as MOptionsType)"
          :text="{ 'zh-CN': '编辑选项', 'en-US': 'Edit Option' }"
        />
        <sa-button
          is="delete"
          @click="handleDelete(data as MOptionsType)"
          :text="{ 'zh-CN': '删除选项', 'en-US': 'Delete Option' }"
        />
      </template>
    </m-quick-table>
  </sa-dialog>

  <sa-dialog
    v-model="editVisible"
    :title="{ 'zh-CN': '扩展选项编辑', 'en-US': 'Extension Option Edit' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="s"
    @closed="inEditDataItem = ({}  as MOptionsType)"
  >
    <sa-form
      id="sa-playground_base"
      ref="formRef"
      :structure="formConfig"
      :data="inEditDataItem"
      :ex-span="1"
      :ex-options="exOptions"
      @form-cell-change="handleCellChange"
    >
    </sa-form>

    <m-quick-table
      v-if="selectType === 'select'"
      ref="selectTableRef"
      :tableData="inEditDataItem.config as SaOptionType.SelectList"
      :tableConfig="editTableConfig"
      :ex-options="exOptions"
      class="mt-size"
    >
      <template #Header>
        <sa-button
          is="add"
          @click="handleAddProp"
          :debounced="false"
          :text="{ 'zh-CN': '新增扩展选项', 'en-US': 'Add Extension Option' }"
        />
      </template>

      <template #label="{ data }">
        <sa-input
          v-model="data.label['zh-CN']"
          :title="languageValue === 'zh-CN' ? '中文文本' : 'Chinese Text'"
          :titleWidth="languageValue === 'zh-CN' ? '70px' : '100px'"
          :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
        ></sa-input>
        <sa-input
          class="mt-size"
          v-model="data.label['en-US']"
          :title="languageValue === 'zh-CN' ? '英文文本' : 'English Text'"
          :titleWidth="languageValue === 'zh-CN' ? '70px' : '100px'"
          :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
        ></sa-input>
      </template>

      <template #value="{ data }">
        <sa-input
          v-model="data.value"
          :placeholder="{ 'zh-CN': '请输入选项值', 'en-US': 'Please input option value' }"
        ></sa-input>
      </template>

      <template #operation="{ data }">
        <sa-button
          is="delete"
          @click="handleDeleteProp(data as SaOptionType.Select)"
          :text="{ 'zh-CN': '删除', 'en-US': 'Delete' }"
        />
      </template>
    </m-quick-table>

    <div class="m-playground-dialog-table mt-size" v-else-if="selectType === 'switch'">
      <div class="m-playground-dialog-table-body">
        <div class="m-playground-dialog-table-row">
          <div class="m-playground-dialog-table-cell" style="flex: 0 0 180px">
            {{ languageValue === "zh-CN" ? "生效标签" : "Active Text" }}
          </div>
          <div class="m-playground-dialog-table-cell">
            <sa-input
              v-if="(inEditDataItem.config as SaOptionType.Switch).activeText"
              v-model="(inEditDataItem.config as any).activeText['zh-CN']"
              :title="languageValue === 'zh-CN' ? '中文文本' : 'Chinese Text'"
              :titleWidth="languageValue === 'zh-CN' ? '70px' : '110px'"
              :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
            ></sa-input>
            <sa-input
              class="mt-size"
              v-if="(inEditDataItem.config as SaOptionType.Switch).activeText"
              v-model="(inEditDataItem.config as any).activeText['en-US']"
              :title="languageValue === 'zh-CN' ? '英文文本' : 'English Text'"
              :titleWidth="languageValue === 'zh-CN' ? '70px' : '110px'"
              :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
            ></sa-input>
          </div>
        </div>
        <div class="m-playground-dialog-table-row">
          <div class="m-playground-dialog-table-cell" style="flex: 0 0 180px">
            {{ languageValue === "zh-CN" ? "生效值" : "Active Value" }}
          </div>
          <div class="m-playground-dialog-table-cell">
            <sa-input
              v-model="(inEditDataItem.config as SaOptionType.Switch).activeValue"
              :title="languageValue === 'zh-CN' ? '生效值' : 'Active Value'"
              :titleWidth="languageValue === 'zh-CN' ? '70px' : '110px'"
              :placeholder="languageValue === 'zh-CN' ? '请输入生效值' : 'Active Value'"
            ></sa-input>
          </div>
        </div>
        <div class="m-playground-dialog-table-row">
          <div class="m-playground-dialog-table-cell" style="flex: 0 0 180px">
            {{ languageValue === "zh-CN" ? "未生效标签" : "Inactive Text" }}
          </div>
          <div class="m-playground-dialog-table-cell">
            <sa-input
              v-if="(inEditDataItem.config as SaOptionType.Switch).inActiveText"
              v-model="(inEditDataItem.config as any).inActiveText['zh-CN']"
              :title="languageValue === 'zh-CN' ? '中文文本' : 'Chinese Text'"
              :titleWidth="languageValue === 'zh-CN' ? '70px' : '110px'"
              :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
            ></sa-input>
            <sa-input
              class="mt-size"
              v-if="(inEditDataItem.config as SaOptionType.Switch).inActiveText"
              v-model="(inEditDataItem.config as any).inActiveText['en-US']"
              :title="languageValue === 'zh-CN' ? '英文文本' : 'English Text'"
              :titleWidth="languageValue === 'zh-CN' ? '70px' : '110px'"
              :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
            ></sa-input>
          </div>
        </div>
        <div class="m-playground-dialog-table-row">
          <div class="m-playground-dialog-table-cell" style="flex: 0 0 180px">
            {{ languageValue === "zh-CN" ? "未生效值" : "Inactive Value" }}
          </div>
          <div class="m-playground-dialog-table-cell">
            <sa-input
              v-model="(inEditDataItem.config as SaOptionType.Switch).inActiveValue"
              :title="languageValue === 'zh-CN' ? '未生效值' : 'Inactive Value'"
              :titleWidth="languageValue === 'zh-CN' ? '70px' : '110px'"
              :placeholder="languageValue === 'zh-CN' ? '请输入未生效值' : 'Inactive Value'"
            ></sa-input>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <sa-button is="save" @click="handleSubmit" :text="{ 'zh-CN': '保存选项', 'en-US': 'Save Options' }" />
    </template>
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef, watch } from "vue";
import { MOptionsType } from "../type";
import { SaOptionType, SaStructureType } from "M_Types";
import { M_Message, M_MessageBox } from "../../feedback";
import { PancakeGlobalConfigType } from "../../sa-content/type";
import MQuickTable from "./quick-table.vue";

import _ from "lodash";
const { cloneDeep } = _;

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const props = withDefaults(
  defineProps<{
    editBaseData: Array<MOptionsType>;
  }>(),
  {}
);

const inEditData = ref<MOptionsType[]>([]);
const inEditDataItem = ref<MOptionsType>({} as MOptionsType);
const tableRef = useTemplateRef("tableRef");
const selectTableRef = useTemplateRef("selectTableRef");

const selectType = ref("");
const dictionaryType = ref("");

const formConfig = computed(() => {
  const dictionaryTypeTable: SaStructureType.FormV2[] = [
    { label: { "zh-CN": "表格名", "en-US": "Table Name" }, prop: "tableName", type: "input" },
    { label: { "zh-CN": "列名", "en-US": "Column Name" }, prop: "columnName", type: "input" }
  ];

  const dictionaryTypeSystem: SaStructureType.FormV2[] = [
    { label: { "zh-CN": "字典Key", "en-US": "Dictionary Key" }, prop: "dictionaryKey", type: "input" }
  ];

  const interfaceConfig: SaStructureType.FormV2[] = [
    { label: { "zh-CN": "字典类型", "en-US": "Dictionary Type" }, prop: "dictionaryType", type: "select" },
    ...(dictionaryType.value == "table" ? dictionaryTypeTable : dictionaryTypeSystem)
  ];

  const baseConfig: SaStructureType.FormV2[] = [
    { label: { "zh-CN": "扩展选项描述", "en-US": "Extension Option Description" }, prop: "description", type: "input" },
    {
      label: { "zh-CN": "扩展选项类型", "en-US": "Extension Option Type" },
      prop: "OptionsType",
      type: "select"
    }
  ];
  if (selectType.value == "interface") {
    return [...baseConfig, ...interfaceConfig];
  }
  return [...baseConfig];
});

const tableConfig = ref<SaStructureType.TableV2[]>([
  { label: { "zh-CN": "扩展选项ID", "en-US": "Extension Option ID" }, prop: "id" },
  { label: { "zh-CN": "扩展选项描述", "en-US": "Extension Option Description" }, prop: "description" },
  { label: { "zh-CN": "扩展选项类型", "en-US": "Extension Option Type" }, prop: "OptionsType", filterType: "select" },
  { label: { "zh-CN": "操作", "en-US": "Operation" }, prop: "operation", width: "200px" }
]);

const editTableConfig = ref<(SaStructureType.TableV2 & { class?: string })[]>([
  { label: { "zh-CN": "选项名", "en-US": "Option Label" }, prop: "label" },
  { label: { "zh-CN": "选项值", "en-US": "Option Value" }, prop: "value" },
  { label: { "zh-CN": "操作", "en-US": "Operation" }, prop: "operation", width: "120px" }
]);

const exOptions = ref<SaOptionType.Default>({
  OptionsType: [
    { label: { "en-US": "Select Type", "zh-CN": "选择类型" }, value: "select" },
    { label: { "en-US": "Switch Type", "zh-CN": "开关类型" }, value: "switch" },
    { label: { "en-US": "Remote Dictionary Type", "zh-CN": "远端字典" }, value: "interface" }
  ],
  dictionaryType: [
    { label: { "en-US": "System Dictionary Type", "zh-CN": "系统字典" }, value: "system" },
    { label: { "en-US": "Table Dictionary Type", "zh-CN": "表格字典" }, value: "table" }
  ]
});

const handleCellChange = ({ prop, value }) => {
  console.log("++++++++++> prop, value:", prop, value);
  if (prop === "OptionsType") {
    selectType.value = value;
    if (value == "switch") {
      inEditDataItem.value.config = {
        activeText: { "zh-CN": "", "en-US": "" },
        inActiveText: { "zh-CN": "", "en-US": "" },
        activeValue: 1,
        inActiveValue: 0
      } as SaOptionType.Switch;
    } else if (value == "select") {
      inEditDataItem.value.config = [] as SaOptionType.SelectList;
    }
  } else if (prop === "dictionaryType") {
    dictionaryType.value = value;
  }
};

const formRef = useTemplateRef("formRef");
const emits = defineEmits(["submit"]);

const visible = ref(false);
const editVisible = ref(false);

// # 打开新建接口弹窗
const handleAdd = () => {
  inEditDataItem.value = {
    id: "",
    description: "",
    OptionsType: "select",
    config: []
  } as MOptionsType;
  editVisible.value = true;
};

// # 编辑接口
const handleEdit = (item: MOptionsType) => {
  inEditDataItem.value = cloneDeep(item);
  selectType.value = inEditDataItem.value.OptionsType;
  editVisible.value = true;
};

// # 删除接口
const handleDelete = (item: MOptionsType) => {
  M_MessageBox.delete({
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

// # 新增属性
const handleAddProp = () => {
  (inEditDataItem.value.config as SaOptionType.SelectList).push({ label: { "zh-CN": "", "en-US": "" }, value: "" });
  selectTableRef.value?.setWidth();
};

// # 删除属性
const handleDeleteProp = (item: SaOptionType.Select) => {
  M_MessageBox.delete({
    onConfirm: async () => {
      try {
        inEditDataItem.value.config = (inEditDataItem.value.config as SaOptionType.SelectList).filter(
          i => i.value !== item.value
        );
        M_Message.success(languageValue.value === "zh-CN" ? "属性删除成功" : "Property deleted successfully");
      } catch (error) {
        M_Message.danger(languageValue.value === "zh-CN" ? "属性删除失败" + error : "Property deletion failed" + error);
      }
    }
  });
};

// # 打开编辑表格列弹窗
const openEditTableColDialog = () => {
  visible.value = true;
};

// 提交表单
async function handleSubmit() {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    if (formData.OptionsType === "select") {
      formData.config = (inEditDataItem.value.config as SaOptionType.SelectList).filter(i => i.label && i.value);
    } else {
      formData.config = inEditDataItem.value.config;
    }

    if (formData.id) {
      const findIndex = inEditData.value.findIndex(i => i.id === formData.id);
      if (findIndex !== -1) {
        inEditData.value[findIndex] = formData as MOptionsType;
      }
    } else {
      if (!formData.id) {
        formData.id = Date.now().toString();
      }
      inEditData.value.push(formData as MOptionsType);
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

<style lang="scss" scoped>
@use "./style.scss";
</style>
