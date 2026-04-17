<template>
  <div class="sa-playground" :class="[props.class]" :style="{ ...props.style }">
    <!-- 固定的创建表格按钮 -->
    <div class="fixed-button">
      <sa-button-group :type="'primary' as const" class="mr-size">
        <sa-button
          icon-name="star_line"
          @click="editBaseDialogRef?.open"
          :text="{ 'zh-CN': '基础信息', 'en-US': 'Base Config' }"
        />
        <sa-button
          icon-name="grid_adaptive_line"
          @click="dataStructureManagementDialogRef?.open"
          :text="{ 'zh-CN': '表结构管理', 'en-US': 'Data Structure Config' }"
        />
        <sa-button
          icon-name="route_line"
          @click="interfaceManagementDialogRef?.open"
          :text="{ 'zh-CN': '接口管理', 'en-US': 'Interface Config' }"
        />
        <sa-button
          icon-name="category_list_line"
          @click="optionManagementDialogRef?.open"
          :text="{ 'zh-CN': '选项管理', 'en-US': 'Option Config' }"
        />
      </sa-button-group>

      <sa-button
        class="mr-size"
        is="add"
        type="success"
        @click="handleCreatePage"
        :text="{ 'zh-CN': '创建页面', 'en-US': 'Create Page' }"
      />

      <sa-button-group type="warning" class="mr-size">
        <!-- <sa-button
          type="warning"
          icon-name="setting_line"
          @click="handlePlayground"
          :text="{ 'zh-CN': '模拟场配置', 'en-US': 'Playground Config' }"
        /> -->
        <sa-button
          type="warning"
          icon-name="report_data_line"
          @click="handleEnablePlayground"
          :text="{ 'zh-CN': '模拟场', 'en-US': 'Enable Playground' }"
        />
        <sa-button
          type="warning"
          icon-name="report_data_line"
          @click="handleEnableTraining"
          :text="{ 'zh-CN': '训练场', 'en-US': 'Enable Trainingground' }"
        />
        <sa-button is="save" type="warning" @click="saveBaseConfig" :text="{ 'zh-CN': '保存', 'en-US': 'Save' }" />
      </sa-button-group>
    </div>

    <div
      class="svg-container"
      @wheel="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <div class="svg-background" :style="backgroundStyle"></div>
      <svg ref="svgRef" class="svg-content" id="SvgContent" style="overflow: visible">
        <g :transform="transform as string">
          <!-- 表格和表单组件 -->
          <m-svg-draggable
            v-for="(page, index) in inValue.pagesConfigs"
            :key="page.pageId"
            v-model:x="page.x"
            v-model:y="page.y"
            :scale="scale"
            :index="index"
            :contentStyle="{ scale, translateX, translateY }"
            :ref="el => setDraggableRef(el, page.pageId)"
            @click="handleClickItem(index)"
          >
            <foreignObject
              x="0"
              y="calc(0px - (var(--sa-size-height) + var(--sa-size-padding) / 2) * 2)"
              :width="200"
              :height="30"
              @mousedown="handleClickItem(index)"
            >
              <sa-button is="add" icon-name="setting_line" @click="editPageBaseDialogRef?.open(index)">
                {{ page.name }}
              </sa-button>
            </foreignObject>

            <!-- 创建表格/创建表单/创建选项卡按钮 -->
            <foreignObject
              x="0"
              y="calc(0px - (var(--sa-size-height) + var(--sa-size-padding) / 2) * 1)"
              :width="320"
              :height="30"
              @mousedown="handleClickItem(index)"
            >
              <sa-button-group type="success">
                <sa-button
                  is="add"
                  type="success"
                  @click="handleCreateTable(index)"
                  :text="{ 'zh-CN': '创建表格', 'en-US': 'Create Table' }"
                />
                <sa-button
                  is="add"
                  type="success"
                  @click="handleCreateForm(index)"
                  :text="{ 'zh-CN': '创建表单', 'en-US': 'Create Form' }"
                />
                <sa-button
                  is="add"
                  type="success"
                  @click="handleCreateTabs(index)"
                  :text="{ 'zh-CN': '创建选项卡', 'en-US': 'Create Tabs' }"
                />
              </sa-button-group>
            </foreignObject>

            <!-- 删除按钮 -->
            <foreignObject
              :x="320"
              y="calc(0px - (var(--sa-size-height) + var(--sa-size-padding) / 2) * 1)"
              :width="200"
              :height="40"
            >
              <sa-button
                class="draggable-btn"
                type="warning"
                iconName="map_pin_line"
                :debounced="false"
                :text="{ 'zh-CN': '拖拽', 'en-US': 'Drag' }"
                @click="handleClickItem(index)"
                @mousedown="draggableRefs[page.pageId]?.handleMouseDown"
              />
              <sa-button
                class="draggable-btn _del"
                type="default"
                iconName="recycle_line"
                :debounced="false"
                :text="{ 'zh-CN': '删除', 'en-US': 'Delete' }"
                @click="handleDeletePage(index)"
              />
            </foreignObject>

            <template v-if="page.itemConfigs.length">
              <template v-for="(item, itemIndex) in page.itemConfigs" :key="item.itemId">
                <m-item-svg
                  :ref="
                    el =>
                      item.type === 'form'
                        ? setFormRef(el, item.itemId)
                        : item.type === 'table'
                        ? setTableRef(el, item.itemId)
                        : setTabsItemRef(el, item.itemId)
                  "
                  @lock-scroll="lockScroll = $event"
                  @delete-form="handleDeleteItem"
                  @handle-click-item="handleClickItem(index)"
                  :position="{ x: page.x, y: page.y }"
                  :pageY="
                    itemIndex != 0
                      ? page.itemConfigs
                          .filter((item, index) => index < itemIndex)
                          .reduce((acc, cur) => acc + (cur.height || 0), 0)
                      : 0
                  "
                  :pageId="page.pageId"
                  :pageIndex="index"
                  :itemId="item.itemId"
                  :width="page.itemConfigs.map(item => item.width || 0).reduce((acc, cur) => Math.max(acc, cur), 0)"
                  :itemIndex="itemIndex"
                  :playground-items="page.itemConfigs"
                  :exOptionsMaps="inValue.exOptions"
                  :dataStructures="inValue.dataStructures"
                  @update-form-config="data => (inValue.pagesConfigs[index].itemConfigs[itemIndex].structure = data)"
                  @update-button-config="data => (inValue.pagesConfigs[index].itemConfigs[itemIndex].actionButtons = data)"
                  @update-ex-options-config="data => (inValue.pagesConfigs[index].itemConfigs[itemIndex].exOptions = data)"
                  @update-page-size="
                    data => (
                      (page.itemConfigs[itemIndex].width = data.width), (page.itemConfigs[itemIndex].height = data.height + 20)
                    )
                  "
                  @handle-drag-start="handleDragStart"
                  @handle-drag-over="handleDragOver"
                  @handle-drag-enter="handleDragEnter"
                  @handle-drag-leave="handleDragLeave"
                  @handle-drag-end="handleDragEnd"
                  @handle-drop="handleDrop"
                />
              </template>
            </template>
            <g v-else>
              <foreignObject :x="0" :y="5" :width="520" :height="58">
                <div class="glass-container flex-center">{{ language === "zh-CN" ? "暂无组件" : "No components" }}</div>
              </foreignObject>
            </g>
          </m-svg-draggable>
        </g>
      </svg>
    </div>

    <!-- 编辑表格列弹窗 -->
    <dialog-edit-table-col
      ref="editTableColDialogRef"
      @handle-edit-table-col-submit="handleEditTableColSubmit"
      :exOptionsMaps="[...inValue.exOptions, ...TableUseOptions]"
      :edit-col="editTableColData"
    />
    <!-- 编辑表格列快捷弹窗 -->
    <dialog-edit-table-col-quick
      ref="editTableColQuickDialogRef"
      :exOptionsMaps="[...inValue.exOptions, ...TableUseOptions]"
      :authorizationFunction="props.authorizationFunction"
      @handle-edit-table-col-quick-submit="handleEditTableColQuickSubmit"
    >
      <template
        v-for="item in props.authorizationFunction"
        :key="'dialog-edit-table-col-quick_' + item.prop"
        #[item.prop]="{ data }"
      >
        <slot :name="item.prop" :data="data"></slot>
      </template>
    </dialog-edit-table-col-quick>

    <!-- 编辑按钮弹窗 -->
    <dialog-edit-button
      ref="editOperationDialogRef"
      admin
      @handle-edit-operation-submit="handleEditOperationSubmit"
      :playgroundItems="inValue.pagesConfigs"
      :dataStructures="inValue.dataStructures"
      :interfaceConfigs="inValue.interfaceConfigs"
      :actionFunction="props.actionFunction"
      :authorizationFunction="props.authorizationFunction"
    >
      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-button_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>
    </dialog-edit-button>

    <!-- 编辑表单项弹窗 -->
    <dialog-edit-form-item
      ref="editFormItemDialogRef"
      @handle-edit-form-item-submit="handleEditFormItemSubmit"
      :exOptionsMaps="inValue.exOptions"
      :edit-item="editFormItemData"
    />
    <!-- 编辑表单项快捷弹窗 -->
    <dialog-edit-form-item-quick
      ref="editFormItemQuickDialogRef"
      :authorizationFunction="props.authorizationFunction"
      @handle-edit-form-item-quick-submit="handleEditFormItemQuickSubmit"
      :exOptionsMaps="inValue.exOptions"
    >
      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-form-item_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>
    </dialog-edit-form-item-quick>

    <!-- 编辑选项卡项快捷弹窗 -->
    <dialog-edit-tabs-item-quick
      ref="editTabsItemQuickDialogRef"
      :authorizationFunction="props.authorizationFunction"
      @handle-edit-tabs-item-quick-submit="handleEditTabsItemQuickSubmit"
      :playgroundItems="inValue.pagesConfigs"
      :exOptionsMaps="[...inValue.exOptions, ...TableUseOptions]"
    >
      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-form-item_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>
    </dialog-edit-tabs-item-quick>

    <!-- 预览弹窗 -->
    <m-visible-dialog ref="visibleDialogRef" />

    <!-- 项目页面信息配置 -->
    <dialog-edit-page-config
      ref="editItemBaseDialogRef"
      @handle-edit-item-base-submit="handleEditItemBaseSubmit"
      :data-structures="inValue.dataStructures"
      :interfaceConfigs="inValue.interfaceConfigs"
    />

    <dialog-edit-page-base-config
      ref="editPageBaseDialogRef"
      @submit="data => (inValue.pagesConfigs[data.index].name = data.name)"
      :playground-items="inValue.pagesConfigs"
    />

    <!-- 模拟场配置弹窗（未显示） -->
    <m-simulated-field
      ref="simulatedFieldRef"
      :id="inValue.id"
      :playground-items="inValue.pagesConfigs"
      :interfaceConfigs="inValue.interfaceConfigs"
      :data-structures="inValue.dataStructures"
    />

    <!-- 模拟场弹窗 -->
    <sa-playground-visible
      ref="simulatedFieldVisibleRef"
      :id="inValue.id"
      :base-config="inValue"
      :playground-items="inValue.pagesConfigs"
      :interfaceConfigs="inValue.interfaceConfigs"
      :data-structures="inValue.dataStructures"
      :exOptionsMaps="inValue.exOptions"
      :useMock="useMock"
      :actionFunction="props.actionFunction"
      :authorizationFunction="props.authorizationFunction"
      :requestFunction="props.requestFunction"
      :action-before="props.actionBefore"
      :visible-before="props.visibleBefore"
    />

    <!-- 项目信息配置 -->
    <dialog-edit-base-config
      ref="editBaseDialogRef"
      :edit-base-data="inValue"
      @submit="data => (inValue = data)"
      :playground-items="inValue.pagesConfigs"
    />

    <dialog-interface-management
      ref="interfaceManagementDialogRef"
      :data-structures="inValue.dataStructures"
      :edit-base-data="inValue.interfaceConfigs"
      @submit="data => (inValue.interfaceConfigs = data)"
    />

    <dialog-data-structure-management
      ref="dataStructureManagementDialogRef"
      :edit-base-data="inValue.dataStructures"
      :authorizationFunction="props.authorizationFunction"
      @submit="data => (inValue.dataStructures = data)"
    >
      <template
        v-for="item in props.authorizationFunction"
        :key="'dialog-data-structure-management_' + item.prop"
        #[item.prop]="{ data }"
      >
        <slot :name="item.prop" :data="data"></slot>
      </template>
    </dialog-data-structure-management>

    <dialog-option-management
      ref="optionManagementDialogRef"
      :edit-base-data="inValue.exOptions"
      @submit="data => (inValue.exOptions = data)"
    />
  </div>
</template>

<script lang="tsx" setup>
// # Import
import { ref, watch, computed, provide, useTemplateRef, onMounted, inject, Ref } from "vue";
import { SaPlaygroundProps, SaPlaygroundType, SaPlaygroundItem } from "./type";
import { useSvgHooks } from "./hooks/use-svg-hooks";
import { useAutoSave } from "./hooks/use-auto-save";

import MItemSvg from "./components/item-svg.vue";

import MSvgDraggable from "./components/svg-draggable.vue";

import DialogEditTableCol from "./components/table-components/dialog-edit-table-col.vue";
import DialogEditTableColQuick from "./components/table-components/dialog-edit-table-col-quick.vue";
import DialogEditFormItem from "./components/form-components/dialog-edit-form-item.vue";
import DialogEditFormItemQuick from "./components/form-components/dialog-edit-form-item-quick.vue";
import DialogEditTabsItemQuick from "./components/tabs-components/dialog-edit-tabs-item-quick.vue";

import MVisibleDialog from "./components/visible-dialog.vue";
import DialogEditButton from "./components/table-components/dialog-edit-button.vue";
import DialogEditBaseConfig from "./components/dialog-edit-base-config.vue";
import DialogEditPageConfig from "./components/dialog-edit-page-config.vue";

import DialogInterfaceManagement from "./components/dialog-interface-management.vue";
import DialogDataStructureManagement from "./components/dialog-data-structure-management.vue";
import DialogEditPageBaseConfig from "./components/dialog-edit-page-base-config.vue";
import DialogOptionManagement from "./components/dialog-option-management.vue";

import MSimulatedField from "./components/simulated-field.vue";
import SaPlaygroundVisible from "./sa-playground-visible.vue";

import { SaStructureType } from "M_Types";
import { SaPlaygroundPageButtonType } from "./components/type";
import { openDB } from "../indexDB/indexDB";
import { TableUseOptions } from "./configs/options";

// # Var
const props = withDefaults(defineProps<SaPlaygroundProps>(), {
  data: () => ({
    id: new Date().getTime().toString(),
    name: "",
    description: "",
    adminIndex: "",
    adminX: 0,
    adminY: 0,
    adminScale: 1,
    pagesConfigs: [],
    interfaceConfigs: [],
    dataStructures: [],
    exOptions: []
  })
});

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as Ref<any>;
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");

// 表格组件引用
const tableRefs = ref<Record<string, any>>({});
// 表单组件引用
const formRefs = ref<Record<string, any>>({});
// 选项卡组件引用
const tabsItemRefs = ref<Record<string, any>>({});

const draggableRefs = ref<Record<string, any>>({});

const editBaseDialogRef = useTemplateRef("editBaseDialogRef");
const dataStructureManagementDialogRef = useTemplateRef("dataStructureManagementDialogRef");
const interfaceManagementDialogRef = useTemplateRef("interfaceManagementDialogRef");
const optionManagementDialogRef = useTemplateRef("optionManagementDialogRef");
const editItemBaseDialogRef = useTemplateRef("editItemBaseDialogRef");
const editPageBaseDialogRef = useTemplateRef("editPageBaseDialogRef");
const editTableColDialogRef = useTemplateRef("editTableColDialogRef");
const editFormItemDialogRef = useTemplateRef("editFormItemDialogRef");
const editFormItemQuickDialogRef = useTemplateRef("editFormItemQuickDialogRef");
const editTabsItemQuickDialogRef = useTemplateRef("editTabsItemQuickDialogRef");

const visibleDialogRef = useTemplateRef("visibleDialogRef");
const editOperationDialogRef = useTemplateRef("editOperationDialogRef");
const editTableColQuickDialogRef = useTemplateRef("editTableColQuickDialogRef");
const simulatedFieldRef = useTemplateRef("simulatedFieldRef");
const simulatedFieldVisibleRef = useTemplateRef("simulatedFieldVisibleRef");

const editTableColData = ref<SaStructureType.TableV2 | undefined>();

const editFormItemData = ref<SaStructureType.FormV2 | undefined>();

const inValue = ref<SaPlaygroundType>(props.data);
const useMock = ref(true);

const svgRef = ref<SVGSVGElement>();
const lockScroll = ref(false);

const { start, stop, getSavedValue } = useAutoSave(inValue, "sa-playground-data");

const setTableRef = (el: any, id: string) => el && (tableRefs.value[id] = el);
const setFormRef = (el: any, id: string) => el && (formRefs.value[id] = el);
const setTabsItemRef = (el: any, id: string) => el && (tabsItemRefs.value[id] = el);
const setDraggableRef = (el: any, id: string) => el && (draggableRefs.value[id] = el);

// 生成随机ID
const generateRandomId = (prefix: string = "page") => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

provide(
  "openEditTableColDialog",
  computed(() => editTableColDialogRef?.value?.openEditTableColDialog)
);
provide(
  "openEditFormItemDialog",
  computed(() => editFormItemDialogRef?.value?.openEditFormItemDialog)
);
provide(
  "openVisibleDialog",
  computed(() => visibleDialogRef?.value?.openVisibleDialog)
);
provide(
  "openEditOperationDialog",
  computed(() => editOperationDialogRef?.value?.openEditOperationDialog)
);
provide("openEditItemBaseDialog", (config: SaPlaygroundItem) => {
  editItemBaseDialogRef.value?.open(config);
});
provide("openEditTableColQuickDialog", (tableId: string, config: SaStructureType.TableV2[], options: Record<string, string>) => {
  editTableColQuickDialogRef.value?.openEditDialog(
    tableId,
    config.map(item => ({ ...item, cellConfig: item.cellConfig || {} })),
    options
  );
});
provide("openEditFormItemQuickDialog", (formId: string, config: SaStructureType.FormV2[], options: Record<string, string>) => {
  editFormItemQuickDialogRef.value?.openEditDialog(
    formId,
    config.map(item => ({ ...item })),
    options
  );
});
provide(
  "openEditTabsItemQuickDialog",
  (
    tableId: string,
    config: Array<SaStructureType.FormV2 & { scroll: number; padding: string[] }>,
    options: Record<string, string>
  ) => {
    editTabsItemQuickDialogRef.value?.openEditDialog(
      tableId,
      config.map(item => ({ ...item })),
      options
    );
  }
);

// 使用SVG相关的hooks
const {
  scale,
  translateX,
  translateY,
  transform,
  backgroundStyle,
  handleWheel,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  getSvgTransform,
  updateAdminConfig,
  handleDeletePage
} = useSvgHooks(lockScroll, inValue);

// 处理编辑表格列提交
const handleEditTableColSubmit = (tableId: string, data: SaStructureType.TableV2, options: Record<string, string>) =>
  tableRefs.value[tableId].updateCol(data, options);

// 处理编辑表单项提交
const handleEditFormItemSubmit = (formId: string, data: SaStructureType.FormV2, options: Record<string, string>) =>
  formRefs.value[formId].updateItem(data, options);

// 处理编辑表格列快速提交
const handleEditTableColQuickSubmit = (tableId: string, data: SaStructureType.TableV2[], options: Record<string, string>) =>
  tableRefs.value[tableId].updateItemAll(data, options);

// 处理编辑表单项快速提交
const handleEditFormItemQuickSubmit = (formId: string, data: SaStructureType.FormV2[], options: Record<string, string>) =>
  formRefs.value[formId].updateItemAll(data, options);

// 处理编辑选项卡项快速提交
const handleEditTabsItemQuickSubmit = (tableId: string, data: SaStructureType.FormV2[]) =>
  tabsItemRefs.value[tableId].updateItemAll(data);

// # 保存基础配置
function saveBaseConfig() {
  const position = getSvgTransform();
  const formData = inValue.value;
  const _exData = { ...formData, ...position };
  console.log("++++++++++> _exData:", JSON.stringify(_exData));
}

// # 创建页面
function handleCreatePage() {
  // 生成随机ID和名称
  const id = generateRandomId();
  const name = `页面`;

  // 计算新表格的位置（错开排列）
  const x = inValue.value.pagesConfigs.length * 200 + 10;
  const y = Math.floor(inValue.value.pagesConfigs.length + 1) * 200;

  // 添加到表格列表
  inValue.value.pagesConfigs.push({ pageId: id, name, x, y, itemConfigs: [] });
}

// # 创建表格
function handleCreateTable(index: number) {
  // 添加到表格列表
  const itemId = generateRandomId("table");

  inValue.value.pagesConfigs[index].itemConfigs.push({
    itemId,
    width: 0,
    height: 0,
    type: "table",
    actionApi: "",
    structure: [],
    actionButtons: [],
    exOptions: {},
    sourceTable: ""
  });

  // 延迟创建表格，确保组件已经渲染
  setTimeout(() => {
    const tableComponent = tableRefs.value[itemId];
    if (tableComponent) tableComponent.createTable();
  }, 100);
}

// # 创建表单
function handleCreateForm(index: number) {
  // 生成随机ID和名称
  const itemId = generateRandomId("form");
  // 添加到表单列表
  inValue.value.pagesConfigs[index].itemConfigs.push({
    itemId,
    width: 0,
    height: 0,
    type: "form",
    actionApi: "",
    structure: [],
    actionButtons: [],
    exOptions: {},
    sourceTable: ""
  });
}

// # 创建选项卡
function handleCreateTabs(index: number) {
  // 生成随机ID和名称
  const itemId = generateRandomId("tabs");
  // 添加到选项卡列表
  inValue.value.pagesConfigs[index].itemConfigs.push({
    itemId,
    width: 0,
    height: 0,
    type: "tabs",
    actionApi: "",
    structure: [],
    actionButtons: [],
    exOptions: {},
    sourceTable: ""
  });
}

// @ 删除元素
function handleDeleteItem(itemId: string) {
  inValue.value.pagesConfigs.forEach(page => {
    page.itemConfigs = page.itemConfigs.filter(item => item.itemId !== itemId);
  });
  inValue.value.pagesConfigs = inValue.value.pagesConfigs;
}

// @ 处理<按钮>提交
function handleEditOperationSubmit(editId: string, data: SaPlaygroundPageButtonType[]) {
  inValue.value.pagesConfigs.forEach(page => {
    page.itemConfigs.forEach(item => {
      if (item.itemId === editId) {
        tableRefs.value[editId].updateOperation(data);
      }
    });
  });
}

// # 点击元素移动到数组最后面
function handleClickItem(index: number) {
  // 将点击的表格或表单移动到数组最后面
  if (index >= 0 && index < inValue.value.pagesConfigs.length) {
    const item = inValue.value.pagesConfigs.splice(index, 1)[0];
    inValue.value.pagesConfigs.push(item);
  }
}

const handleEditItemBaseSubmit = (data: SaPlaygroundItem) => {
  const page = inValue.value.pagesConfigs.find(item => item.itemConfigs.find(config => config.itemId === data.itemId));
  const item = page?.itemConfigs.find(config => config.itemId === data.itemId);

  if (item) {
    item.title = data.title;
    item.actionApi = data.actionApi;
    item.sourceTable = data.sourceTable;
    item.otherProps = data.otherProps;

    if (item.itemId && item.type == "table") {
      tableRefs.value[item.itemId].handleRefresh();
    } else if (item.itemId && item.type == "form") {
      formRefs.value[item.itemId].handleRefresh();
    }
  }
};

// 处理模拟场
// const handlePlayground = async () => {
//   simulatedFieldRef.value?.openVisibleDialog();
// };

const handleEnablePlayground = async () => {
  useMock.value = true;
  simulatedFieldVisibleRef.value?.openVisibleDialog();
};

const handleEnableTraining = async () => {
  useMock.value = false;
  simulatedFieldVisibleRef.value?.openVisibleDialog();
};

const draggedIndex = ref(-1);

// 拖拽开始
const handleDragStart = (event: DragEvent, index: number) => {
  event.stopPropagation();
  event.dataTransfer?.setData("text/plain", index.toString());
  (event.target as HTMLElement).style.opacity = "0.5";
  (event.target as HTMLElement).classList.add("dragging");
  draggedIndex.value = index;
};

// 拖拽悬停
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  const items = document.querySelectorAll(".glass-container");
  items.forEach(item => item.classList.remove("dragover"));
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.add("dragover");
  }
};

// 拖拽进入
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

// 拖拽离开
const handleDragLeave = (event: DragEvent) => {
  event.stopPropagation();
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.remove("dragover");
  }
};

// 拖拽结束
const handleDragEnd = (event: DragEvent) => {
  event.stopPropagation();
  (event.target as HTMLElement).style.opacity = "1";
  (event.target as HTMLElement).classList.remove("dragging");
  const items = document.querySelectorAll(".glass-container");
  items.forEach(item => item.classList.remove("dragover"));
  draggedIndex.value = -1;
};

// 拖拽结束，处理排序
const handleDrop = (event: DragEvent, pageIndex: number, targetIndex: number) => {
  event.preventDefault();
  event.stopPropagation();

  const oldIndex = parseInt(event.dataTransfer!.getData("text/plain"));
  if (oldIndex !== -1 && oldIndex !== targetIndex) {
    const newArray = [...inValue.value.pagesConfigs[pageIndex].itemConfigs];
    const [draggedItem] = newArray.splice(oldIndex, 1);
    newArray.splice(targetIndex, 0, draggedItem);
    inValue.value.pagesConfigs[pageIndex].itemConfigs = newArray;
  }

  // 重置拖拽状态
  (event.target as HTMLElement).style.opacity = "1";
  (event.target as HTMLElement).classList.remove("dragging");
  const items = document.querySelectorAll(".glass-container");
  items.forEach(item => item.classList.remove("dragover"));
  draggedIndex.value = -1;
};

onMounted(() => {
  const DB_NAME = "DB_" + inValue.value.id;
  const DB_NAME1 = "DB_" + inValue.value.id + "_Api";
  const DB_NAME2 = "DB_" + inValue.value.id + "_DataMap";
  const dataStructures = inValue.value.dataStructures;

  const map_name = dataStructures.map(item => "DB_" + inValue.value.id + "_API_" + item.id);
  openDB(DB_NAME, [DB_NAME1, DB_NAME2, ...map_name]);
});

watch(
  () => props.data,
  data => {
    const savedData = getSavedValue();
    if (savedData && savedData?.id == data.id) {
      inValue.value = savedData as SaPlaygroundType;
      inValue.value.pagesConfigs = savedData.pagesConfigs;
      updateAdminConfig();
    } else {
      stop();
      inValue.value = data;
      updateAdminConfig();
      start();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
// @use "./index.scss";

.sa-playground {
  --el-border-color-light: var(--sa-color-border);
  width: 100%;
  height: 100%;
  position: relative;

  .fixed-button {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 100;
    display: flex;
    align-items: center;
  }

  .svg-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    .svg-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(
        var(--el-border-color-light) var(--svg-background-font),
        rgba(69, 69, 69, 0) var(--svg-background-font)
      );
      background-size: var(--svg-background-size) var(--svg-background-size);
      background-position: center;
      pointer-events: none;
    }

    .svg-content {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  }

  .glass-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border-radius: 8px;
    border: 1px solid var(--sa-color-primary);
  }

  .glass-container.table {
    border: 1px solid #6244cf;
  }

  .glass-container.form {
    border: 1px solid #b344cf;
  }

  .glass-container.tabs {
    border: 1px solid #d76c09;
  }

  .draggable-btn {
    width: calc(50% - 7px) !important;
    box-sizing: border-box;
    margin: 0 !important;
    text-align: center;
    font-size: var(--sa-size-font);
    cursor: move;
    color: var(--sa-button-color);
    border: 1px solid var(--sa-button-color3, var(--sa-button-color));
    border-radius: var(--sa-size-radius, 3px);
    transition: var(--sa-animation-time, 0.2s);
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    &:hover {
      background-color: var(--sa-color-warning-light-9) !important;
      color: var(--sa-color-warning) !important;
      border: 1px solid var(--sa-color-warning);
    }
  }

  .draggable-btn._del {
    margin-left: 7px !important;
    width: 50% !important;
    background-color: var(--sa-color-danger-light-9);
    color: var(--sa-color-danger);
    border: 1px solid var(--sa-color-danger);
    &:hover {
      background: rgba(223, 20, 20, 0.1) !important;
      color: var(--sa-color-danger) !important;
      border: 1px solid var(--sa-color-danger) !important;
    }
  }
}
</style>
