<template>
  <sa-dialog
    v-model="OperationVisible"
    :title="{ 'zh-CN': '快捷编辑选项卡项', 'en-US': 'Quick Edit Tabs Item' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="l"
  >
    <sa-button is="add" @click="handleAddTabsItem" :debounced="false">
      {{ language === "zh-CN" ? "保存选项卡项" : "Save Tabs Item" }}
    </sa-button>

    <m-quick-table
      ref="visibleTableRef"
      :tableConfig="tableConfig"
      :tableData="formData"
      :exOptions="{}"
      @update="data => (formData = data)"
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
        <sa-input v-model="data.prop" :placeholder="{ 'zh-CN': '请输入列Key', 'en-US': 'Please input column key' }"></sa-input
      ></template>

      <template #page="{ data }">
        <sa-select
          v-model="data.page"
          :placeholder="{ 'zh-CN': '请选择选项卡页面', 'en-US': 'Please select tabs page' }"
          :exOptions="exOptionsComputed?.['page']"
        ></sa-select
      ></template>

      <template #padding="{ data }">
        <sa-select
          v-model="data.padding"
          type="multiple-select"
          :placeholder="{ 'zh-CN': '请选择内边距', 'en-US': 'Please select padding' }"
          :exOptions="exOptionsComputed?.['padding']"
        ></sa-select
      ></template>

      <template #scroll="{ data }">
        <sa-select v-model="data.scroll" :exOptions="exOptionsComputed?.['scroll']" />
      </template>

      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-button_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>

      <template #operation="{ index }">
        <sa-button type="danger" is="delete" @click="removeOperation(index)" :text="{ 'zh-CN': '删除', 'en-US': 'Delete' }" />
      </template>
    </m-quick-table>

    <template #footer>
      <sa-button type="primary" @click="handleOperationSubmit" :text="{ 'zh-CN': '保存设置', 'en-US': 'Save Settings' }" />
    </template>
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef, nextTick } from "vue";
import { SaltedGlobalConfigType } from "../../../sa-content/type";
import { SaStructureType } from "M_Types";
import { MOptionsType, SaPlaygroundPagesType } from "../../type";
import MQuickTable from "../quick-table.vue";

import _ from "lodash";
const { cloneDeep } = _;

const props = defineProps<{
  playgroundItems: SaPlaygroundPagesType[];
  exOptionsMaps: MOptionsType[];
  authorizationFunction?: Array<SaStructureType.TableV2>;
}>();

const useOptions = { scroll: "use-yes-no", padding: "use-padding" };
const exOptionsComputed = computed(() => {
  const exOptionsData = {};
  for (const item in useOptions) {
    exOptionsData[item] = props.exOptionsMaps.find(i => i.id === useOptions[item])?.config;
  }
  exOptionsData["page"] = props.playgroundItems.map(page => {
    return { value: page.pageId, label: page.name };
  });
  return exOptionsData;
});

const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const language = SaltedGlobalConfig.value?.language?.value || "zh-CN";
const visibleTableRef = useTemplateRef("visibleTableRef");

const tableConfig = ref<SaStructureType.TableV2[]>([
  { prop: "label", label: { "en-US": "Tabs Item Name", "zh-CN": "选项卡项名称" } },
  { prop: "prop", label: { "en-US": "Tabs Item Key", "zh-CN": "选项卡项Key" }, width: "180px" },
  { prop: "page", label: { "en-US": "Tabs Page", "zh-CN": "选项卡页面" }, width: "180px" },
  { prop: "scroll", label: { "en-US": "Scroll", "zh-CN": "使用滚动" }, width: "150px" },
  { prop: "padding", label: { "en-US": "Padding", "zh-CN": "内边距" }, width: "180px" },
  ...(props.authorizationFunction || []),
  { prop: "operation", label: { "en-US": "Operation", "zh-CN": "操作" } }
]);

// @ options
const exOptions = ref<Record<string, string>>({});
// const props = defineProps<{}>();
// # Var
const editId = ref("");
const formData = ref<Array<SaStructureType.FormV2 & { scroll: number; padding: string[] }>>([]);

const OperationVisible = ref(false);

// # 添加选项卡项
const handleAddTabsItem = () => {
  formData.value.push({
    label: { "en-US": "Tabs Item Name", "zh-CN": "选项卡项名称" },
    prop: "",
    type: "text",
    scroll: 0,
    padding: []
  });
  nextTick(() => {
    visibleTableRef.value?.setWidth();
  });
};

// # 删除选项
const removeOperation = (index: number) => {
  formData.value.splice(index, 1);
};

// # 保存选项
const handleOperationSubmit = () => {
  emit("handleEditTabsItemQuickSubmit", editId.value, formData.value);
  OperationVisible.value = false;
};

function openEditDialog(
  formId: string,
  config: Array<SaStructureType.FormV2 & { scroll: number; padding: string[] }>,
  options: Record<string, string>
) {
  editId.value = formId;
  formData.value = cloneDeep(config);
  exOptions.value = { ...exOptions.value, ...cloneDeep(options) };
  OperationVisible.value = true;
}

const emit = defineEmits<{
  handleEditTabsItemQuickSubmit: [formId: string, data: SaStructureType.FormV2[]];
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
