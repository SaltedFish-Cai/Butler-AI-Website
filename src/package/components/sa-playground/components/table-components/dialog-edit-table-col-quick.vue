<template>
  <sa-dialog
    v-model="OperationVisible"
    :title="{ 'zh-CN': '快捷编辑表格列', 'en-US': 'Quick Edit Table Column' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="max"
  >
    <m-quick-table
      ref="visibleTableRef"
      :tableConfig="tableConfig"
      :tableData="tableData"
      :exOptions="{}"
      @update="data => (tableData = data)"
    >
      <template #label="{ data }">
        <sa-input
          v-model="(data.label as object)['zh-CN']"
          :title="language === 'zh-CN' ? '中文文本' : 'Chinese Text'"
          :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
        ></sa-input>
        <sa-input
          class="mt-size"
          v-model="(data.label as object)['en-US']"
          :title="language === 'zh-CN' ? '英文文本' : 'English Text'"
          :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
        ></sa-input>
      </template>

      <template #prop="{ data }">
        <sa-input
          display
          v-model="data.prop"
          :placeholder="{ 'zh-CN': '请输入列Key', 'en-US': 'Please input column key' }"
        ></sa-input
      ></template>

      <template #cellConfig="{ data }">
        <sa-cascader
          v-model="(data.cellConfig || {}).type"
          :exOptions="cellMapConfig"
          :title="{ 'zh-CN': '类型', 'en-US': 'Type' }"
        ></sa-cascader>

        <sa-select
          class="mt-size"
          v-if="
            exOptionsMap &&
            data.prop &&
            data.cellConfig?.type &&
            (data.cellConfig.type.includes('select') ||
              data.cellConfig.type.includes('cascader') ||
              data.cellConfig.type.includes('switch') ||
              data.cellConfig.type.includes('radio') ||
              data.cellConfig.type.includes('checkbox'))
          "
          :title="{ 'zh-CN': '来源', 'en-US': 'Source' }"
          v-model="data['exOptionsById']"
          :exOptions="exOptionsComputed['exOptionsById']"
        />
      </template>

      <template #useFilter="{ data }">
        <sa-select
          v-model="data.useFilter"
          :exOptions="exOptionsComputed['useFilter']"
          :title="{ 'zh-CN': '使用筛选', 'en-US': 'Use Filter' }"
        ></sa-select>
        <sa-select
          class="mt-size"
          v-if="data.useFilter"
          v-model="data.filterType"
          :exOptions="exOptionsComputed['filterType']"
          :title="{ 'zh-CN': '筛选类型', 'en-US': 'Filter Type' }"
        ></sa-select>

        <sa-select
          class="mt-size"
          v-if="exOptionsMap && data.prop && data.filterType == 'select'"
          v-model="data['exOptionsById']"
          :exOptions="exOptionsComputed['exOptionsById']"
          :title="{ 'zh-CN': '选项来源', 'en-US': 'Options Source' }"
        />
      </template>

      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-button_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>

      <template #operation="{ data, index }">
        <div class="flex-col">
          <sa-button
            class="mb-size"
            is="edit"
            @click="handleMoreOperation(data, index)"
            :text="{ 'zh-CN': '更多', 'en-US': 'More' }"
          />
          <sa-button
            style="margin-left: 0"
            type="danger"
            is="delete"
            @click="removeOperation(index)"
            :text="{ 'zh-CN': '删除', 'en-US': 'Delete' }"
          />
        </div>
      </template>
    </m-quick-table>

    <template #footer>
      <sa-button type="primary" @click="handleOperationSubmit" :text="{ 'zh-CN': '保存设置', 'en-US': 'Save Settings' }" />
    </template>
  </sa-dialog>

  <sa-dialog
    v-model="OperationMoreVisible"
    :title="{ 'zh-CN': '编辑列详情', 'en-US': 'Edit Column Details' }"
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
      <sa-button is="save" @click="handleMoreOperationSubmit" :text="{ 'zh-CN': '保存设置', 'en-US': 'Save Settings' }" />
    </template>
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef } from "vue";
import { PancakeGlobalConfigType } from "../../../sa-content/type";
import { SaStructureType } from "M_Types";
import { cellMapConfig } from "../../configs/cell-config";
import { MOptionsType } from "../../type";
import MQuickTable from "../quick-table.vue";

import {
  inputConfig,
  numberConfig,
  selectConfig,
  cascaderConfig,
  radioConfig,
  checkboxConfig,
  switchConfig
} from "../../configs/cell-config";
import { editTableColConfig, editOtherTableColConfig, filterType, exOptionsById } from "../../configs/table-config";

import _ from "lodash";
const { cloneDeep } = _;

const props = defineProps<{
  exOptionsMaps: MOptionsType[];
  authorizationFunction?: Array<SaStructureType.TableV2>;
}>();

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

// # Var
const editId = ref("");
const tableData = ref<SaStructureType.TableV2[]>([]);
const formData = ref<SaStructureType.TableV2 & { cellType?: string }>({});
const formRef = useTemplateRef("formRef");

// @ options
const exOptions = ref<Record<string, string>>({});
const exOptionsMap = computed(() =>
  props.exOptionsMaps.filter(item => !item.id.includes("use-")).map(item => ({ label: item.description, value: item.id }))
);
const tableUseOptions = { useFilter: "use-yes-no", filterType: "use-filter-type", fixed: "use-fixed" };
const exOptionsComputed = computed(() => {
  const exOptionsData = {};
  for (const item in tableUseOptions) {
    exOptionsData[item] = props.exOptionsMaps.find(i => i.id === tableUseOptions[item])?.config;
  }
  exOptionsData["exOptionsById"] = exOptionsMap.value;
  return exOptionsData;
});

const OperationVisible = ref(false);
const OperationMoreVisible = ref(false);
const OperationMoreIndex = ref(-1);

const tableConfig = ref<SaStructureType.TableV2[]>([
  { prop: "label", label: { "en-US": "Column Name", "zh-CN": "列名" }, width: "280px" },
  { prop: "prop", label: { "en-US": "Column Key", "zh-CN": "列Key" }, width: "150px" },
  { prop: "cellConfig", label: { "en-US": "Cell Type", "zh-CN": "单元格类型" }, width: "180px" },
  { prop: "useFilter", label: { "en-US": "Filter Type", "zh-CN": "是否筛选" } },
  ...(props.authorizationFunction || []),
  { prop: "operation", label: { "en-US": "Operation", "zh-CN": "操作" } }
]);

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
  const type: string = formData?.value?.cellType || "text";
  const outData = [
    ...editTableColConfig,
    ...(CellConfigMap[type] || []),
    ...editOtherTableColConfig,
    ...(formData?.value?.useFilter ? [filterType] : []),
    ...(formData?.value?.filterType === "select" ? [exOptionsById] : [])
  ];
  return outData;
});

// # 删除选项
const removeOperation = (index: number) => {
  tableData.value.splice(index, 1);
};

// # 保存选项
const handleOperationSubmit = () => {
  for (const item of tableData.value) {
    if (item.prop && item["exOptionsById"]) {
      exOptions.value[item.prop] = item["exOptionsById"];
    }
  }

  emit("handleEditTableColQuickSubmit", editId.value, tableData.value, exOptions.value);
  OperationVisible.value = false;
};

// # 保存更多操作
const handleMoreOperationSubmit = async () => {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    tableData.value[OperationMoreIndex.value] = { ...tableData.value[OperationMoreIndex.value], ...formData };
    OperationMoreVisible.value = false;
  }
};

function openEditDialog(tableId: string, config: SaStructureType.TableV2[], options: Record<string, string>) {
  editId.value = tableId;
  tableData.value = cloneDeep(config);
  exOptions.value = { ...exOptions.value, ...cloneDeep(options) };
  OperationVisible.value = true;
}

// # 更多操作
const handleMoreOperation = (row, index) => {
  OperationMoreVisible.value = true;
  OperationMoreIndex.value = index;
  const _editCol = { ...row, cellType: row.cellConfig?.type || "text" };
  setTimeout(() => {
    formRef.value?.changeData_All(_editCol);
  }, 100);
};

const emit = defineEmits<{
  handleEditTableColQuickSubmit: [tableId: string, data: SaStructureType.TableV2[], exOptions: Record<string, string>];
}>();

defineExpose({ openEditDialog });
</script>

<style lang="scss" scoped>
@use "../style.scss";

.click-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--sa-size-font, 16px);
  color: var(--sa-color-font);
  line-height: calc(var(--sa-size-height) - (var(--sa-size-height) / 4));
  width: 100%;
  border-radius: var(--sa-size-radius, 3px);
  border: 1px solid var(--sa-color-border);
  box-sizing: border-box;
  transition: var(--sa-animation-time, 0.2s);
  padding: calc(var(--sa-size-padding, 10px) / 3) calc(var(--sa-size-padding, 10px) / 1.2);
  background-color: var(--sa-color-bg);
  .click-tag-icon {
    color: var(--sa-color-primary);
  }
  &:hover {
    cursor: pointer;
    color: var(--sa-color-primary);
    border-color: var(--sa-color-primary);
    box-shadow: 0 0 0 2px var(--sa-color-primary-light-8);
  }
}
</style>
