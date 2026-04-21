<template>
  <pa-dialog
    v-model="OperationVisible"
    :title="{ 'zh-CN': '按钮配置', 'en-US': 'Button Configuration' }"
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
      <template #Header>
        <pa-button is="add" @click="addOperation" :debounced="false" :text="{ 'zh-CN': '新增按钮', 'en-US': 'Add Button' }" />
      </template>

      <template #Index>
        <div class="m-playground-dialog-table-cell flex-center" style="flex: 0 0 50px; cursor: move">
          <pa-icon name="transfer_vertical_line" />
        </div>
      </template>

      <template #buttonVisible="{ data }">
        <!-- 按钮展示 -->
        <pa-button v-if="data.styleType === 'Built'" :is="data.is" :text="data.isText" style="width: stretch" />
        <pa-button v-else :type="data.type" :iconName="data.icon" :text="data.text" style="width: stretch" />
      </template>

      <template #useType="{ data }">
        <pa-select
          v-model="data.useType"
          :exOptions="
            positionOptions || [
              { label: { 'en-US': 'Header Left', 'zh-CN': '表头左' }, value: 'HeaderLeft' },
              { label: { 'en-US': 'Header Center', 'zh-CN': '表头中' }, value: 'HeaderCenter' },
              { label: { 'en-US': 'Header Right', 'zh-CN': '表头右' }, value: 'ToolButtonInline' },
              { label: { 'en-US': 'Operation Column', 'zh-CN': '操作列' }, value: 'operation' }
            ]
          "
        ></pa-select>
      </template>

      <template #styleType="{ data }">
        <!-- 样式选择 -->
        <pa-select
          v-model="data.styleType"
          :exOptions="[
            { label: { 'en-US': 'Built-in Style', 'zh-CN': '内置样式' }, value: 'Built' },
            { label: { 'en-US': 'Custom Style', 'zh-CN': '自定义样式' }, value: 'Custom' }
          ]"
        ></pa-select>
      </template>

      <template #is="{ data, index }">
        <!-- 样式配置 -->
        <template v-if="data.styleType === 'Built'">
          <pa-select
            v-model="data.is"
            :exOptions="isOptions"
            @change="({ value }) => isChange(value, index)"
            createUseChange
          ></pa-select>
        </template>
        <template v-if="data.styleType === 'Custom'">
          <pa-select-icon v-model="data.icon"></pa-select-icon>
          <pa-input
            class="mt-size"
            v-model="data.text['zh-CN']"
            :title="language === 'zh-CN' ? '中文文本' : 'Chinese Text'"
            :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
          ></pa-input>
          <pa-input
            class="mt-size"
            v-model="data.text['en-US']"
            :title="language === 'zh-CN' ? '英文文本' : 'English Text'"
            :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
          ></pa-input>
          <pa-select
            class="mt-size"
            v-model="data.type"
            :title="language === 'zh-CN' ? '按钮类型' : 'Button Type'"
            :exOptions="typeOptions"
          ></pa-select>
        </template>
      </template>

      <template #actionType="{ data }">
        <!-- 按钮功能 -->
        <div class="flex-col">
          <pa-cascader
            v-model="data.actionType"
            :exOptions="[...actionOptions, ...(actionFunction as any)]"
            :title="language === 'zh-CN' ? '按钮功能' : 'Button Function'"
          />

          <pa-select
            v-if="data.actionType === 'delete' || data.actionType === 'dialog'"
            class="mt-size"
            type="multiple-select"
            v-model="data.transmitData"
            :title="language === 'zh-CN' ? '传递字段' : 'Transmit Data'"
            :exOptions="actionKeyOptions"
            :placeholder="{ 'zh-CN': '请选择传递字段', 'en-US': 'Please select transmit field' }"
          />

          <!-- 跳转 -->
          <pa-input
            v-if="data.actionType === 'jump'"
            class="mt-size"
            v-model="data.jumpTarget"
            :title="language === 'zh-CN' ? '跳转目标' : 'Jump Target'"
            :placeholder="{ 'zh-CN': '请输入跳转目标', 'en-US': 'Please input jump target' }"
          ></pa-input>

          <!-- 弹窗 -->
          <pa-select
            v-if="data.actionType === 'dialog'"
            class="mt-size"
            :exOptions="itemOptions"
            v-model="data.dialogContentId"
            :title="language === 'zh-CN' ? '弹窗页面' : 'Dialog Page'"
            :placeholder="{ 'zh-CN': '请选择弹窗页面', 'en-US': 'Please select dialog page' }"
          />
          <template v-if="data.actionType === 'dialog'">
            <pa-input
              class="mt-size"
              v-model="data.dialogTitle['zh-CN']"
              :title="language === 'zh-CN' ? '中文弹窗标题' : 'Chinese Dialog Title'"
              :placeholder="{ 'zh-CN': '请输入中文弹窗标题', 'en-US': 'Please input Chinese dialog title' }"
            />
            <pa-input
              class="mt-size"
              v-model="data.dialogTitle['en-US']"
              :title="language === 'zh-CN' ? '英文弹窗标题' : 'English Dialog Title'"
              :placeholder="{ 'zh-CN': '请输入英文弹窗标题', 'en-US': 'Please input English dialog title' }"
            />
            <pa-select
              class="mt-size"
              v-model="data.dialogSubTitle"
              :title="language === 'zh-CN' ? '弹窗副标题' : 'Dialog Sub Title'"
              :exOptions="actionKeyOptions"
              :placeholder="{ 'zh-CN': '请选择弹窗副标题', 'en-US': 'Please select dialog sub title' }"
            />
            <div class="flex mt-size">
              <pa-select
                :exOptions="dialogSizeOptions"
                v-model="data.dialogSize"
                :title="language === 'zh-CN' ? '弹窗尺寸' : 'Dialog Size'"
                :placeholder="{ 'zh-CN': '请选择弹窗尺寸', 'en-US': 'Please select dialog size' }"
              />
              <pa-select
                class="ml-size"
                v-model="data.dialogScroll"
                :title="language === 'zh-CN' ? '滚动条' : 'Add Scrollbar'"
                :exOptions="yesNoOptions"
                :placeholder="{ 'zh-CN': '是否添加滚动条', 'en-US': 'Is add scrollbar' }"
              />
            </div>
            <div class="flex mt-size">
              <pa-select
                v-model="data.closeBySave"
                :title="language === 'zh-CN' ? '提交自动关闭' : 'Submit Close Save'"
                :exOptions="yesNoOptions"
                :placeholder="{ 'zh-CN': '是否提交自动关闭', 'en-US': 'Is submit auto close' }"
              />
              <pa-select
                class="ml-size"
                v-model="data.refreshByDialogClose"
                :title="language === 'zh-CN' ? '关闭后刷新上级' : 'Close Dialog Refresh'"
                :exOptions="yesNoOptions"
                :placeholder="{ 'zh-CN': '是否关闭后刷新上级页面', 'en-US': 'Is close dialog refresh' }"
              />
            </div>
          </template>

          <pa-button
            class="mt-size"
            style="width: 100%"
            v-if="data.actionType === 'dialog' && data.dialogContentId"
            is="view"
            iconName="share_forward_line"
            @click="editOperationDialogRef?.openEditOperationDialog(data.buttonId, data.dialogContentButtons || [])"
          >
            {{ language === "zh-CN" ? "弹窗按钮设置" : "Dialog Button Settings" }}({{ data.dialogContentButtons?.length || 0 }})
          </pa-button>

          <template v-if="data.actionType === 'delete' || data.actionType === 'save'">
            <pa-select
              class="mt-size"
              v-model="data.actionApiId"
              :title="language === 'zh-CN' ? '调用接口' : 'Call API'"
              :exOptions="actionApiOptions"
              :placeholder="{ 'zh-CN': '请选择调用接口', 'en-US': 'Please select call API' }"
            />
            <pa-select
              class="mt-size"
              v-model="data.refreshByDialogClose"
              :title="language === 'zh-CN' ? '自动刷新' : 'Auto Refresh'"
              :exOptions="yesNoOptions"
              :placeholder="{ 'zh-CN': '是否自动刷新', 'en-US': 'Is auto refresh' }"
            />
          </template>

          <template v-if="actionFunction?.find?.(i => i.value === data.actionType)">
            <template
              v-for="dependency in actionFunction?.find?.(i => i.value === data.actionType)?.executionDependencies || []"
              :key="dependency.key"
            >
              <template
                v-if="!dependency.showByKey || (dependency.showByKey && dependency.showByValue === data[dependency.showByKey])"
              >
                <pa-input
                  v-if="dependency.type === 'input'"
                  class="mt-size"
                  v-model="data[dependency.key]"
                  :title="dependency.label"
                  :placeholder="{
                    'zh-CN': '请输入' + dependency.label['zh-CN'],
                    'en-US': 'Please input' + dependency.label['en-US']
                  }"
                />
                <pa-select
                  v-if="dependency.type === 'select'"
                  class="mt-size"
                  :exOptions="dependency.exOptions"
                  v-model="data[dependency.key]"
                  :title="dependency.label"
                  :placeholder="{
                    'zh-CN': '请选择' + dependency.label['zh-CN'],
                    'en-US': 'Please select' + dependency.label['en-US']
                  }"
                />
              </template>
            </template>
          </template>
        </div>
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

  <DialogEditButton
    v-if="admin"
    ref="editOperationDialogRef"
    @handle-edit-operation-submit="handleEditOperationSubmit"
    :playgroundItems="props.playgroundItems"
    :dataStructures="props.dataStructures"
    :interfaceConfigs="props.interfaceConfigs"
    :positionOptions="[{ label: { 'en-US': 'Dialog Bottom', 'zh-CN': '弹窗底部' }, value: 'dialog' }]"
  />
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef } from "vue";
import { PaPlaygroundPageButtonType } from "../type";
import { MStructureType, PaPlaygroundPagesType, MInterfaceConfig, PaPlaygroundActionFunctionType } from "../../type";
import MQuickTable from "../quick-table.vue";
import { PancakeGlobalConfigType } from "../../../pa-manager/type";
import { PaOptionType, PaStructureType } from "M_Types";
import { ButtonTypeV2Is } from "../../../pa-button/type";
import DialogEditButton from "./dialog-edit-button.vue";
import { M_MessageBox } from "../../../feedback";

import _ from "lodash";
const { cloneDeep } = _;

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";
const editOperationDialogRef = useTemplateRef("editOperationDialogRef");

type EditButtonType = {
  admin?: boolean;
  playgroundItems: PaPlaygroundPagesType[];
  dataStructures: MStructureType[];
  interfaceConfigs: MInterfaceConfig[];
  positionOptions?: PaOptionType.SelectList;
  actionFunction?: Array<PaOptionType.Select & PaPlaygroundActionFunctionType>;
  authorizationFunction?: Array<PaStructureType.TableV2>;
};
const props = withDefaults(defineProps<EditButtonType>(), {
  actionFunction: () => [],
  authorizationFunction: () => []
});

// # Var
const editId = ref("");
const tableData = ref<PaPlaygroundPageButtonType[]>([]);
const visibleTableRef = useTemplateRef("visibleTableRef");

const OperationVisible = ref(false);

const actionApiOptions = computed(() => {
  return props.interfaceConfigs.map(item => {
    return { label: item.name, value: item.id };
  });
});

const tableConfig = ref<PaStructureType.TableV2[]>([
  { prop: "Index", label: { "en-US": "#", "zh-CN": "#" }, width: "50px" },
  { prop: "buttonVisible", label: { "en-US": "Button Display", "zh-CN": "按钮展示" }, width: "130px" },
  { prop: "useType", label: { "en-US": "Button Position", "zh-CN": "按钮位置" }, width: "120px" },
  { prop: "styleType", label: { "en-US": "Style Select", "zh-CN": "样式选择" }, width: "150px" },
  { prop: "is", label: { "en-US": "Style Configuration", "zh-CN": "样式配置" }, width: "230px" },
  { prop: "actionType", label: { "en-US": "Button Function", "zh-CN": "按钮功能" } },
  ...props.authorizationFunction,
  { prop: "operation", label: { "en-US": "Operation", "zh-CN": "操作" } }
]);

const yesNoOptions = [
  { label: { "zh-CN": "是", "en-US": "Yes" }, value: 1 },
  { label: { "zh-CN": "否", "en-US": "No" }, value: 0 }
];

const typeOptions = [
  { label: { "zh-CN": "默认", "en-US": "Default" }, value: "default" },
  { label: { "zh-CN": "主要", "en-US": "Primary" }, value: "primary" },
  { label: { "zh-CN": "成功", "en-US": "Success" }, value: "success" },
  { label: { "zh-CN": "信息", "en-US": "Info" }, value: "info" },
  { label: { "zh-CN": "警告", "en-US": "Warning" }, value: "warning" },
  { label: { "zh-CN": "危险", "en-US": "Danger" }, value: "danger" }
];

const actionOptions = [
  { label: { "zh-CN": "无操作", "en-US": "No Operation" }, value: "null" },
  {
    label: { "zh-CN": "动作", "en-US": "Action" },
    value: "action",
    children: [
      { label: { "zh-CN": "删除", "en-US": "Delete" }, value: "delete" },
      { label: { "zh-CN": "更新/保存", "en-US": "Update/Save" }, value: "save" },
      { label: { "zh-CN": "弹窗", "en-US": "Dialog" }, value: "dialog" }
    ]
  },
  { label: { "zh-CN": "跳转", "en-US": "Jump" }, value: "jump" }
];

const isOptions = [
  { label: { "en-US": "Add", "zh-CN": "新增" }, value: "add" },
  { label: { "en-US": "Cancel", "zh-CN": "取消" }, value: "cancel" },
  { label: { "en-US": "Check", "zh-CN": "检查" }, value: "check" },
  { label: { "en-US": "Download", "zh-CN": "下载" }, value: "download" },
  { label: { "en-US": "Edit", "zh-CN": "编辑" }, value: "edit" },
  { label: { "en-US": "Export", "zh-CN": "导出" }, value: "export" },
  { label: { "en-US": "File", "zh-CN": "文件" }, value: "file" },
  { label: { "en-US": "Go", "zh-CN": "跳转" }, value: "go" },
  { label: { "en-US": "Import", "zh-CN": "导入" }, value: "import" },
  { label: { "en-US": "Ok", "zh-CN": "确定" }, value: "ok" },
  { label: { "en-US": "Refresh", "zh-CN": "刷新" }, value: "refresh" },
  { label: { "en-US": "Remove", "zh-CN": "删除" }, value: "remove" },
  { label: { "en-US": "Save", "zh-CN": "保存" }, value: "save" },
  { label: { "en-US": "Search", "zh-CN": "搜索" }, value: "search" },
  { label: { "en-US": "Submit", "zh-CN": "提交" }, value: "submit" },
  { label: { "en-US": "Switch", "zh-CN": "切换" }, value: "switch" },
  { label: { "en-US": "Sync", "zh-CN": "同步" }, value: "sync" },
  { label: { "en-US": "Check", "zh-CN": "检查" }, value: "check" }
];

const actionKeyOptions = ref<PaOptionType.SelectList>([]);

const itemOptions = computed(() => {
  return props.playgroundItems
    .filter(item => item.pageId !== editId.value)
    .map(item => ({ label: item.name, value: item.pageId }));
});

const dialogSizeOptions = [
  { label: { "zh-CN": "小", "en-US": "Small" }, value: "s" },
  { label: { "zh-CN": "中", "en-US": "Medium" }, value: "m" },
  { label: { "zh-CN": "大", "en-US": "Large" }, value: "l" },
  { label: { "zh-CN": "最大", "en-US": "Max" }, value: "max" }
];

const isChange = (val: ButtonTypeV2Is, index: number) => {
  tableData.value[index].isText = isOptions.find(item => item.value === val)?.label || undefined;
};

// # 新增选项
const addOperation = () => {
  // 确保Operation是数组类型
  tableData.value.push({
    buttonId: new Date().getTime().toString(),
    text: { "zh-CN": "按钮", "en-US": "Button" },
    type: "primary",
    icon: "finger_press_line",
    actionType: "null",
    is: "add",
    dialogTitle: { "zh-CN": "", "en-US": "" },
    closeBySave: 1,
    refreshByDialogClose: 1,
    styleType: "Built"
  });
  visibleTableRef.value?.setWidth();
};

// # 删除选项
const removeOperation = (index: number) => {
  M_MessageBox.delete({
    onConfirm: async () => {
      tableData.value.splice(index, 1);
    }
  });
};

// # 保存选项
const handleOperationSubmit = () => {
  emit("handleEditOperationSubmit", editId.value, tableData.value);
  OperationVisible.value = false;
};

function openEditOperationDialog(edit_id: string, config: PaPlaygroundPageButtonType[]) {
  OperationVisible.value = true;
  editId.value = edit_id;
  tableData.value = cloneDeep(config);
  props.playgroundItems.map(item => {
    item.itemConfigs.forEach(config => {
      if (config.itemId === edit_id) {
        const StructuresData = props.dataStructures.find(Structures => Structures.id === config.sourceTable);
        actionKeyOptions.value =
          StructuresData?.config.map(item => ({ label: `${item.description || "--"} ( ${item.prop} )`, value: item.prop })) || [];
      }
    });
  });
}

// # 保存选项
const handleEditOperationSubmit = (editId: string, data: PaPlaygroundPageButtonType[]) => {
  tableData.value.forEach(item => {
    if (item.buttonId == editId) {
      item.dialogContentButtons = data;
    }
  });
};

const emit = defineEmits<{
  handleEditOperationSubmit: [editId: string, data: PaPlaygroundPageButtonType[]];
}>();

defineExpose({
  openEditOperationDialog
});
</script>

<style lang="scss" scoped>
@use "../style.scss";

.m-playground-dialog-table-row {
  &[draggable="true"]:hover {
    cursor: grab;
  }

  // 拖拽悬停时的目标位置样式
  &.dragover {
    border: 2px dashed var(--pa-color-primary);
    background-color: var(--pa-color-primary-light-8);
  }

  // 拖拽中的元素样式
  &.dragging {
    opacity: 0.5;
    transform: scale(1.02);
    background-color: var(--pa-color-primary-light-8);
  }
}
</style>
