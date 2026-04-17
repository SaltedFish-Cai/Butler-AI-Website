<template>
  <!-- 表单标题和操作按钮 -->
  <g>
    <foreignObject :x="0" :y="pageY + 1" :width="props.width" :height="80">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        class="glass-container"
        :class="[baseConfig?.type || '']"
        :style="{
          '--sa-color-primary': baseConfig?.type === 'table' ? '#6244cf' : baseConfig?.type === 'form' ? '#b344cf' : '#d76c09',
          '--sa-color-primary-light-9':
            baseConfig?.type === 'table' ? '#e8e2ff' : baseConfig?.type === 'form' ? '#f0e0f4' : '#fce8d6',
          '--sa-color-page_bg': baseConfig?.type === 'table' ? '#e8e2ff' : baseConfig?.type === 'form' ? '#f0e0f4' : '#fce8d6'
        }"
        :id="itemId + '_glass'"
        draggable="true"
        @dragstart="event => emit('handleDragStart', event, itemIndex)"
        @dragover.prevent="event => emit('handleDragOver', event, itemIndex)"
        @dragenter.prevent="event => emit('handleDragEnter', event, itemIndex)"
        @dragleave="event => emit('handleDragLeave', event, itemIndex)"
        @dragend="event => emit('handleDragEnd', event, pageIndex, itemIndex)"
        @drop.prevent="event => emit('handleDrop', event, pageIndex, itemIndex)"
        @mouseover="e => emit('lock-scroll', true)"
        @mouseout="e => emit('lock-scroll', false)"
      >
        <div xmlns="http://www.w3.org/1999/xhtml" class="flex-center-between">
          <div v-if="baseConfig" class="flex-center-start">
            <m-title
              v-if="baseConfig.title?.[language]"
              class="mr-size"
              :line="false"
              style="display: inline-block; padding-top: 0"
            >
              {{ baseConfig.title[language] }}
            </m-title>
            <sa-button
              v-if="baseConfig.type === 'table'"
              is="view"
              iconName="setting_line"
              type="warning"
              @click="openEditItemBaseDialog(baseConfig)"
              :debounced="false"
              style="--sa-button-color: #6244cf; --sa-button-color2: #e8e2ff"
            >
              {{ language === "zh-CN" ? "表格设置" : "Table Settings" }}
            </sa-button>
            <sa-button
              v-else-if="baseConfig.type === 'form'"
              is="view"
              iconName="setting_line"
              type="warning"
              @click="openEditItemBaseDialog(baseConfig)"
              :debounced="false"
              style="--sa-button-color: #b344cf; --sa-button-color2: #f0e0f4"
            >
              {{ language === "zh-CN" ? "表单设置" : "Form Settings" }}
            </sa-button>
            <sa-button
              v-else-if="baseConfig.type === 'tabs'"
              is="view"
              iconName="setting_line"
              type="warning"
              @click="openEditItemBaseDialog(baseConfig)"
              :debounced="false"
              style="--sa-button-color: #d76c09; --sa-button-color2: #fce8d6"
            >
              {{ language === "zh-CN" ? "选项卡设置" : "Tabs Settings" }}
            </sa-button>

            <sa-button
              v-if="baseConfig.type === 'table' || baseConfig.type === 'form'"
              :disabled="!baseConfig.sourceTable"
              type="warning"
              iconName="refresh_arrows_line"
              @click="handleRefresh"
              :debounced="false"
            />

            <!-- <sa-button
            is="view"
            iconName="video_play_line"
            @click="visibleForm"
            :debounced="false"
            :text="{ 'zh-CN': '预览', 'en-US': 'Preview' }"
          /> -->
          </div>

          <sa-button is="delete" :confirm-config="deleteConfirmConfig" :text="{ 'zh-CN': '删除', 'en-US': 'Delete' }" />
        </div>
        <!-- 按钮 -->
        <sa-button
          v-if="baseConfig?.type === 'form'"
          class="mt-size"
          style="width: 100%"
          is="edit"
          iconName="version_line"
          @click="openEditFormItemQuickDialog(itemId, formData as SaStructureType.FormV2[], formExOptions)"
          :text="{ 'zh-CN': '表单 快捷设置', 'en-US': 'Form Quick Settings' }"
        />

        <template v-if="baseConfig?.type === 'table'">
          <div class="flex" style="width: 100%">
            <sa-button
              class="mt-size"
              is="edit"
              iconName="version_line"
              style="width: 50%"
              @click="openEditTableColQuickDialog(itemId, formData as SaStructureType.TableV2[], formExOptions)"
              :text="{ 'zh-CN': '表格 快捷设置', 'en-US': 'Table Quick Settings' }"
            />
            <sa-button
              class="mt-size"
              is="edit"
              iconName="setting_line"
              style="width: 50%"
              @click="handleEditHeadersSubmit"
              :text="{
                'zh-CN': '按钮功能设置 (' + actionButtons.length + ')',
                'en-US': 'Button Function Settings (' + actionButtons.length + ')'
              }"
            />
          </div>
        </template>

        <sa-button
          v-if="baseConfig?.type === 'tabs'"
          class="mt-size"
          style="width: 100%"
          is="edit"
          iconName="version_line"
          @click="openEditTabsItemQuickDialog(itemId, formData as SaStructureType.FormV2[], formExOptions)"
          :text="{ 'zh-CN': '选项卡 快捷设置', 'en-US': 'Tabs Quick Settings' }"
        />
      </div>
    </foreignObject>
  </g>

  <!-- 右键菜单 -->
  <!-- <g :transform="`translate(10, 10)`">
    <foreignObject v-if="contextMenuVisible" :x="contextMenuX" :y="contextMenuY" width="120" height="90">
      <div xmlns="http://www.w3.org/1999/xhtml" class="context-menu">
        <div class="context-menu-item" @click="handleEditFormItem">编辑</div>
        <div class="context-menu-item" @click="handleDeleteFormItem">{{ language === "zh-CN" ? "删除" : "Delete" }}</div>
      </div>
    </foreignObject>
  </g> -->
</template>

<script lang="tsx" setup>
import { computed, inject, Ref, ref, watch } from "vue";
import { MOptionsType, SaPlaygroundItem, MStructureType } from "../type";
import { SaOptionType, SaStructureType } from "M_Types";
import { SaPlaygroundPageButtonType } from "./type";
import { M_Message } from "../../feedback";
import _ from "lodash";
// import { SaPlaygroundPageButtonType } from "./type";

const { isNil, isArray } = _;
const SaltedGlobalConfig = inject("SaltedGlobalConfig") as Ref<any>;
const language = computed(() => SaltedGlobalConfig.value?.language?.value || "zh-CN");

// 接收props
const props = defineProps<{
  pageId: string;
  pageY: number;
  width: number;
  itemId: string;
  pageIndex: number;
  itemIndex: number;
  position: { x: number; y: number };
  playgroundItems: SaPlaygroundItem[];
  exOptionsMaps: MOptionsType[];
  dataStructures: MStructureType[];
}>();

const emit = defineEmits([
  "lock-scroll",
  "delete-form",
  "handleClickItem",
  "updateFormConfig",
  "updateButtonConfig",
  "updateExOptionsConfig",
  "updatePageSize",
  "handleDragStart",
  "handleDragOver",
  "handleDragEnter",
  "handleDragLeave",
  "handleDragEnd",
  "handleDrop"
]);

const baseConfig = ref<SaPlaygroundItem>();

const formData = ref<(SaStructureType.FormV2 & { value?: any })[]>([]);
const formExOptions = ref<Record<string, string>>({});
const actionButtons = ref<SaPlaygroundPageButtonType[]>([]);
const dataStructures = computed(() => props.dataStructures);

// 注入方法
// const openVisibleDialog = inject("openVisibleDialog") as Ref<
//   (type: "form" | "table", config: SaStructureType.FormV2[] | SaStructureType.TableV2[]) => void
// >;

const openEditItemBaseDialog = inject("openEditItemBaseDialog") as Ref<(baseConfig: SaPlaygroundItem) => void>;

const openEditFormItemQuickDialog = inject("openEditFormItemQuickDialog") as Ref<
  (tableId: string, config: SaStructureType.FormV2[], options: Record<string, string>) => void
>;
const openEditTabsItemQuickDialog = inject("openEditTabsItemQuickDialog") as Ref<
  (tableId: string, config: SaStructureType.FormV2[], options: Record<string, string>) => void
>;
const openEditTableColQuickDialog = inject("openEditTableColQuickDialog") as Ref<
  (tableId: string, tableConfig: SaStructureType.TableV2[], exOptions: Record<string, string>) => void
>;
const openEditOperationDialog = inject("openEditOperationDialog") as Ref<(tableId: string, editOperation: any) => void>;

// 删除表单确认配置
const deleteConfirmConfig = {
  type: "danger" as const,
  title: language.value === "zh-CN" ? "确认删除" : "Confirm Delete",
  message: language.value === "zh-CN" ? "确定要删除这个表单吗？" : "Are you sure to delete this form?",
  onConfirm: () => {
    emit("delete-form", props.itemId);
  }
};

// 处理编辑表头提交
function handleEditHeadersSubmit() {
  openEditOperationDialog.value(props.itemId, actionButtons.value);
}

// 导出表单配置
function exportFormConfig() {
  const exOptions: SaOptionType.Default = {};
  const config: SaStructureType.FormV2[] = formData.value.map(item => {
    const outData = {
      ...item,
      rules: item.required ? [{ required: item.required }] : undefined
    };
    delete outData.required;
    delete outData.value;
    if (item.exOptions && item.prop) {
      exOptions[item.prop] = item.exOptions;
    }
    return outData;
  });

  return { config, exOptions };
}

// 预览表单
// const visibleForm = () => {
//   const { config } = exportFormConfig();
//   openVisibleDialog.value("form", config);
// };

// 更新所有列
function updateItemAll(items: any, exOptions?: Record<string, string>) {
  formData.value = items;
  if (exOptions) formExOptions.value = exOptions;
}

// 刷新表单数据
function handleRefresh() {
  const _baseConfig = baseConfig.value;
  if (!_baseConfig) return;
  const oldConfig = formData.value;
  const findConfig = dataStructures.value.find(config => config.id === _baseConfig.sourceTable);
  if (oldConfig && findConfig?.config) {
    const outData: Array<{ authorization?: string } & (SaStructureType.FormV2 | SaStructureType.TableV2)> = [];
    for (const col of findConfig.config) {
      const oldCol = oldConfig.find(oldCol => oldCol.prop === col.prop) as any;
      if (oldCol && false) {
        outData.push(oldCol);
      } else {
        if (findConfig.indexKey != col.id && col.visible == 1) {
          const newCol = { ...col };
          const extKeys = ["id", "description"];
          extKeys.forEach(key => delete newCol[key]);

          for (const key in oldCol) {
            if (isNil(oldCol[key]) || (isArray(oldCol[key]) && oldCol[key].length == 0)) delete oldCol[key];
          }
          if (_baseConfig.type == "form") {
            (outData as Array<SaStructureType.FormV2 & { authorization?: string }>).push({
              ...newCol,
              ...oldCol,

              label: { "en-US": newCol.label?.["en-US"] || newCol.prop, "zh-CN": newCol.label?.["zh-CN"] || newCol.prop },
              type: oldCol?.type || "input"
            });
          } else if (_baseConfig.type == "table") {
            (outData as Array<SaStructureType.TableV2 & { authorization?: string }>).push({
              ...newCol,
              ...oldCol,

              label: { "en-US": newCol.label?.["en-US"] || newCol.prop, "zh-CN": newCol.label?.["zh-CN"] || newCol.prop },
              useSort: oldCol?.useSort || true,
              useFilter: oldCol?.useFilter || true,
              filterType: oldCol?.filterType || "input",
              cellConfig: oldCol?.cellConfig || { type: "text" }
            });
          }
        }
      }
    }

    if (_baseConfig.type == "table" && actionButtons.value.find(item => item.useType == "operation")) {
      outData.push({ label: { "en-US": "Operation", "zh-CN": "操作" }, prop: "operation" });
    }

    updateItemAll(outData);
    M_Message.success(language.value === "zh-CN" ? "同步成功" : "Sync Success");
  }
}

// 更新操作列
function updateOperation(operation: SaPlaygroundPageButtonType[]) {
  const ope = operation.filter(item => item.useType == "operation");
  if (ope.length && formData.value.findIndex(item => item.prop === "operation") === -1) {
    formData.value.push({ label: { "en-US": "Operation", "zh-CN": "操作" }, prop: "operation" });
  } else if (!ope.length) {
    formData.value = formData.value.filter(item => item.prop !== "operation");
  }
  actionButtons.value = operation;
}

watch(
  () => props.playgroundItems,
  data => {
    baseConfig.value = data.find(item => item.itemId === props.itemId) as SaPlaygroundItem;
    if (!baseConfig.value) return;
    formData.value = baseConfig.value.structure as SaStructureType.FormV2[];
    actionButtons.value = baseConfig.value.actionButtons || [];

    updateOperation(actionButtons.value);

    emit("updatePageSize", { width: 520, height: 80 });
  },
  { immediate: true }
);

watch(
  () => formData.value,
  data => {
    emit("updateFormConfig", data);
  },
  { deep: true }
);

watch(
  () => formExOptions.value,
  data => emit("updateExOptionsConfig", data),
  { deep: true }
);

watch(
  () => actionButtons.value,
  data => emit("updateButtonConfig", data),
  { deep: true }
);

defineExpose({
  updateItemAll,
  exportFormConfig,
  handleRefresh,
  updateOperation
});
</script>

<style scoped lang="scss">
.glass-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--sa-size-padding) / 1.5);
  border: 1px solid var(--sa-color-border);
  transition: var(--sa-animation-time, 0.2s);
  background-color: var(--sa-color-page_bg);

  &[draggable="true"]:hover {
    cursor: grab;
  }

  // 拖拽悬停时的目标位置样式
  &.dragover {
    border: 2px dashed var(--sa-color-primary);
    background-color: var(--sa-color-primary-light-8);
  }

  // 拖拽中的元素样式
  &.dragging {
    opacity: 0.5;
    transform: scale(1.02);
    background-color: var(--sa-color-primary-light-8);
  }

  &-label {
    width: 100px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-control {
    flex: 1;
  }

  &-drag-handle {
    color: var(--sa-color-font-2);
  }
}

.context-menu {
  position: relative;
  background-color: var(--sa-color-bg);
  border: 1px solid var(--sa-color-border);
  border-radius: var(--sa-size-radius, 3px);
  box-shadow: 0 0 0 2px var(--sa-color-primary-light-8);
  overflow: hidden;
  z-index: 1000;
}

.context-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--sa-color-font);

  &:hover {
    background-color: var(--sa-color-primary-light-9);
    color: var(--sa-color-primary);
  }

  &:first-child {
    border-bottom: 1px solid var(--sa-color-border);
  }
}

.border-blink {
  animation: borderBlink 0.8s infinite;
}

@keyframes borderBlink {
  0%,
  100% {
    border: 1px solid var(--sa-color-danger-light-8);
  }
  50% {
    border: 1px solid var(--sa-color-danger);
  }
}

.flex-center-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
