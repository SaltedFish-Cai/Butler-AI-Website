<template>
  <sa-dialog
    v-model="visible"
    :title="{ 'zh-CN': '编辑表单列', 'en-US': 'Edit Table Column' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="s"
  >
    <sa-form
      id="sa-playground-form_base"
      ref="formRef"
      :structure="config"
      :ex-span="1"
      :ex-options="exOptionsComputed"
      @form-data-change="data => (formData = data)"
    >
      <template #label="scope">
        <template v-if="scope.data.label">
          <sa-input
            v-model="(scope.data.label as object)['zh-CN']"
            :title="language === 'zh-CN' ? '中文文本' : 'Chinese Text'"
            :titleWidth="language === 'zh-CN' ? '70px' : '100px'"
            :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
          />
          <sa-input
            class="mt-size"
            v-model="(scope.data.label as object)['en-US']"
            :title="language === 'zh-CN' ? '英文文本' : 'English Text'"
            :titleWidth="language === 'zh-CN' ? '70px' : '100px'"
            :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
          />
        </template>
      </template>
    </sa-form>

    <template #footer>
      <sa-button type="primary" @click="handleSubmit" :text="{ 'zh-CN': '保存配置', 'en-US': 'Save Config' }" />
    </template>
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef } from "vue";
import { SaStructureType } from "M_Types";

import { editFormColConfig, editOtherFormItemConfig } from "../../configs/form-config";
import {
  inputConfig,
  numberConfig,
  selectConfig,
  cascaderConfig,
  radioConfig,
  checkboxConfig,
  switchConfig
} from "../../configs/cell-config";
import { PancakeGlobalConfigType } from "../../../sa-content/type";
import { MOptionsType } from "../../type";

import _ from "lodash";
const { cloneDeep } = _;

const props = defineProps<{
  exOptionsMaps: MOptionsType[];
  editItem?: SaStructureType.FormV2;
}>();

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

// @ options
const exOptions = ref<Record<string, string>>({});
const exOptionsMap = computed(() => props.exOptionsMaps.map(item => ({ label: item.description, value: item.id })));
const exOptionsComputed = computed(() => {
  const exOptionsData = {};
  exOptionsData["exOptionsById"] = exOptionsMap.value;
  return exOptionsData;
});

const formRef = useTemplateRef("formRef");
const formData = ref<SaStructureType.FormV2>({});
const editId = ref("");
const visible = ref(false);

const CellConfigMap = {
  input: inputConfig,
  number: numberConfig,
  select: selectConfig,
  "multiple-online-select": selectConfig,
  "multiple-request-select": selectConfig,
  "multiple-select": selectConfig,
  "online-select": selectConfig,
  "request-select": selectConfig,
  "cascader-check": cascaderConfig,
  cascader: cascaderConfig,
  "multiple-cascader-check": cascaderConfig,
  "multiple-cascader": cascaderConfig,
  radio: radioConfig,
  checkbox: checkboxConfig,
  switch: switchConfig
};

const config = computed(() => {
  const type: string = formData?.value?.type || "input";
  const outData = [...editFormColConfig, ...(CellConfigMap[type] || []), ...editOtherFormItemConfig];
  return outData;
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  handleEditFormItemSubmit: [tableId: string, data: SaStructureType.FormV2, options: Record<string, string>];
}>();

// # 打开编辑表格列弹窗
const openEditFormItemDialog = (tableId: string, editItem: SaStructureType.FormV2, options: Record<string, string>) => {
  visible.value = true;
  editId.value = tableId;
  exOptions.value = { ...exOptions.value, ...cloneDeep(options) };
  setTimeout(() => {
    formRef.value?.changeData_All(editItem);
  }, 100);
};

// 提交表单
async function handleSubmit() {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    exOptions.value[formData.prop] = formData["exOptionsById"];
    emit("handleEditFormItemSubmit", editId.value, formData as SaStructureType.FormV2, exOptions.value);
    visible.value = false;
  }
}

defineExpose({
  openEditFormItemDialog
});
</script>

<style scoped>
.options-container {
  width: 100%;
}

.options-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.options-table {
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 8px 12px;
    border: 1px solid var(--sa-color-border);
    text-align: left;
  }

  th {
    background-color: var(--sa-color-bg);
    font-weight: bold;
  }
}

.option-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid var(--sa-color-border);
  border-radius: 4px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: var(--sa-color-primary);
  }
}
</style>
