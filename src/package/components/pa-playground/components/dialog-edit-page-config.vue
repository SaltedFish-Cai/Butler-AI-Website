<template>
  <pa-dialog
    v-model="visible"
    :title="{ 'zh-CN': '组件配置', 'en-US': 'Component Config' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="s"
  >
    <pa-form
      id="pa-playground_base"
      ref="formRef"
      :structure="itemBaseConfig"
      :data="editItemData"
      :ex-span="1"
      :ex-options="exOptions"
      @form-data-change="data => (editItemData = data)"
    >
      <template #title="{ data }">
        <pa-input
          v-model="data.title['zh-CN']"
          :title="language === 'zh-CN' ? '中文文本' : 'Chinese Text'"
          :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
        ></pa-input>
        <pa-input
          class="mt-size"
          v-model="data.title['en-US']"
          :title="language === 'zh-CN' ? '英文文本' : 'English Text'"
          :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
        ></pa-input>
      </template>
    </pa-form>

    <template #footer>
      <pa-button is="save" @click="handleSubmit" :text="{ 'zh-CN': '保存配置', 'en-US': 'Save Config' }" />
    </template>
  </pa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef } from "vue";
import { MInterfaceConfig, PaPlaygroundItem, MStructureType } from "../types";
import { PaOptionType, PaStructureType } from "M_Types";
import { PancakeGlobalConfigType } from "../../pa-manager/type";

const formRef = useTemplateRef("formRef");

const props = defineProps<{ dataStructures: MStructureType[]; interfaceConfigs: MInterfaceConfig[] }>();
const emit = defineEmits(["handleEditItemBaseSubmit"]);

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

const visible = ref(false);
const editItemData = ref<PaPlaygroundItem>({} as PaPlaygroundItem);
const exOptions = ref<PaOptionType.Default>({
  exSpan: [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 }
  ],
  display: [
    { label: { "en-US": "Normal", "zh-CN": "正常模式" }, value: false },
    { label: { "en-US": "Pure", "zh-CN": "纯模式" }, value: true }
  ]
});

// # 基础配置
const itemBaseConfig = computed<PaStructureType.FormV2[]>(() => {
  const baseConfig: PaStructureType.FormV2[] =
    editItemData.value.type == "tabs"
      ? []
      : [
          { label: { "en-US": "Source Table", "zh-CN": "来源表配置" }, prop: "sourceTable", type: "select" },
          { label: { "en-US": "Action Api", "zh-CN": "数据接口" }, prop: "actionApi", type: "select" }
        ];

  const formConfig: PaStructureType.FormV2[] =
    editItemData.value.type == "form"
      ? [
          {
            label: { "en-US": "Form Column", "zh-CN": "单元列数字" },
            prop: "exSpan",
            type: "select",
            rules: [{ required: false }]
          },
          {
            label: { "en-US": "Display Mode", "zh-CN": "纯展示模式" },
            prop: "display",
            type: "select",
            rules: [{ required: false }]
          }
        ]
      : [];
  const tableConfig: PaStructureType.FormV2[] = editItemData.value.type == "table" ? [] : [];
  return [
    ...baseConfig,
    { label: { "en-US": "Title", "zh-CN": "标题" }, prop: "title", type: "slot", rules: [{ required: false }] },
    ...formConfig,
    ...tableConfig
  ];
});

// # 打开编辑表格列弹窗
const openEditTableColDialog = (itemConfig: PaPlaygroundItem) => {
  exOptions.value["actionApi"] = props.interfaceConfigs.map(item => ({
    label: `${item.name} ( ${item.apiUrl || "--"} )`,
    value: item.id
  }));
  exOptions.value["actionApi"].push({ label: { "en-US": "Upstream Data", "zh-CN": "上层透传数据" }, value: "Upstream" });

  exOptions.value["sourceTable"] = props.dataStructures.map(item => ({
    label: item.description || item.id,
    value: item.id
  }));

  const _editItemData = { ...itemConfig, title: itemConfig.title || {}, ...itemConfig.otherProps };
  delete _editItemData.otherProps;
  editItemData.value = _editItemData;
  visible.value = true;
};

// 提交表单
async function handleSubmit() {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    formData.otherProps = {
      exSpan: formData.exSpan,
      display: formData.display
    };
    delete formData.exSpan;
    delete formData.display;
    emit("handleEditItemBaseSubmit", formData);
    visible.value = false;
  }
}

defineExpose({
  open: openEditTableColDialog
});
</script>

<style scoped></style>
