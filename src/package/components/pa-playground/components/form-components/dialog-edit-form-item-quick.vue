<template>
  <pa-dialog
    v-model="OperationVisible"
    :title="{ 'zh-CN': '快捷编辑表单列', 'en-US': 'Quick Edit Form Item Column' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="l"
  >
    <m-quick-table
      ref="visibleTableRef"
      :tableConfig="tableConfig"
      :tableData="formData"
      :exOptions="{}"
      @update="data => (formData = data)"
    >
      <template #label="{ data }">
        <pa-input
          v-model="(data.label as object)['zh-CN']"
          :title="language === 'zh-CN' ? '中文文本' : 'Chinese Text'"
          :titleWidth="language === 'zh-CN' ? '70px' : '100px'"
          :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
        ></pa-input>
        <pa-input
          class="mt-size"
          v-model="(data.label as object)['en-US']"
          :title="language === 'zh-CN' ? '英文文本' : 'English Text'"
          :titleWidth="language === 'zh-CN' ? '70px' : '100px'"
          :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
        ></pa-input>
      </template>

      <template #prop="{ data }">
        <pa-input
          display
          v-model="data.prop"
          :placeholder="{ 'zh-CN': '请输入列Key', 'en-US': 'Please input column key' }"
        ></pa-input
      ></template>

      <template #cellConfig="{ data }">
        <pa-cascader
          v-model="data.type"
          :exOptions="cellMapConfig"
          :title="{ 'zh-CN': '类型', 'en-US': 'Type' }"
        ></pa-cascader>

        <pa-select
          class="mt-size"
          v-if="
            exOptionsMap &&
            data.prop &&
            data.type &&
            (data.type.includes('select') ||
              data.type.includes('cascader') ||
              data.type.includes('switch') ||
              data.type.includes('radio') ||
              data.type.includes('checkbox'))
          "
          :title="{ 'zh-CN': '来源', 'en-US': 'Source' }"
          v-model="data['exOptionsById']"
          :exOptions="exOptionsComputed['exOptionsById']"
        />
      </template>

      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-button_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>

      <template #operation="{ index }">
        <pa-button type="danger" is="delete" @click="removeOperation(index)" :text="{ 'zh-CN': '删除', 'en-US': 'Delete' }" />
      </template>
    </m-quick-table>

    <template #footer>
      <pa-button type="primary" @click="handleOperationSubmit" :text="{ 'zh-CN': '保存设置', 'en-US': 'Save Settings' }" />
    </template>
  </pa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref } from "vue";
import { PancakeGlobalConfigType } from "../../../pa-manager/type";
import { PaStructureType } from "M_Types";
import { cellMapConfig } from "../../configs/cell-config";
import { MOptionsType } from "../../type";
import MQuickTable from "../quick-table.vue";

import _ from "lodash";
const { cloneDeep } = _;

const props = defineProps<{
  exOptionsMaps: MOptionsType[];
  authorizationFunction?: Array<PaStructureType.TableV2>;
}>();

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

const tableConfig = ref<PaStructureType.TableV2[]>([
  { prop: "label", label: { "en-US": "Column Name", "zh-CN": "列名" }, width: "300px" },
  { prop: "prop", label: { "en-US": "Column Key", "zh-CN": "列Key" }, width: "180px" },
  { prop: "cellConfig", label: { "en-US": "Cell Type", "zh-CN": "单元格类型" } },
  ...(props.authorizationFunction || []),
  { prop: "operation", label: { "en-US": "Operation", "zh-CN": "操作" } }
]);

// @ options
const exOptions = ref<Record<string, string>>({});
const exOptionsMap = computed(() => props.exOptionsMaps.map(item => ({ label: item.description, value: item.id })));
const tableUseOptions = { useFilter: "use-yes-no", filterType: "use-filter-type", fixed: "use-fixed" };
const exOptionsComputed = computed(() => {
  const exOptionsData = {};
  for (const item in tableUseOptions) {
    exOptionsData[item] = props.exOptionsMaps.find(i => i.id === tableUseOptions[item])?.config;
  }
  exOptionsData["exOptionsById"] = exOptionsMap.value;
  return exOptionsData;
});
// const props = defineProps<{}>();
// # Var
const editId = ref("");
const formData = ref<PaStructureType.FormV2[]>([]);

const OperationVisible = ref(false);

// # 删除选项
const removeOperation = (index: number) => {
  formData.value.splice(index, 1);
};

// # 保存选项
const handleOperationSubmit = () => {
  for (const item of formData.value) {
    if (item.prop && item["exOptionsById"]) {
      exOptions.value[item.prop] = item["exOptionsById"];
    }
  }
  emit("handleEditFormItemQuickSubmit", editId.value, formData.value, exOptions.value);
  OperationVisible.value = false;
};

function openEditDialog(formId: string, config: PaStructureType.FormV2[], options: Record<string, string>) {
  editId.value = formId;
  formData.value = cloneDeep(config);
  exOptions.value = { ...exOptions.value, ...cloneDeep(options) };
  OperationVisible.value = true;
}

const emit = defineEmits<{
  handleEditFormItemQuickSubmit: [formId: string, data: PaStructureType.FormV2[], options: Record<string, string>];
}>();

defineExpose({ openEditDialog });
</script>

<style lang="scss" scoped>
@use "../style.scss";

.click-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--pa-size-font, 16px);
  color: var(--pa-color-font);
  line-height: calc(var(--pa-size-height) - (var(--pa-size-height) / 4));
  width: 100%;
  border-radius: var(--pa-size-radius, 3px);
  border: 1px solid var(--pa-color-border);
  box-sizing: border-box;
  transition: var(--pa-animation-time, 0.2s);
  padding: calc(var(--pa-size-padding, 10px) / 3) calc(var(--pa-size-padding, 10px) / 1.2);
  background-color: var(--pa-color-bg);
  .click-tag-icon {
    color: var(--pa-color-primary);
  }
  &:hover {
    cursor: pointer;
    color: var(--pa-color-primary);
    border-color: var(--pa-color-primary);
    box-shadow: 0 0 0 2px var(--pa-color-primary-light-8);
  }
}
</style>
