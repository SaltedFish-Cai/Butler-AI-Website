<template>
  <div class="pa-playground" :class="[props.class]" :style="{ ...props.style }">
    <!-- 固定的创建表格按钮 -->
    <div class="fixed-button">
      <pa-button-group :type="'primary' as const" class="mr-size">
        <pa-button icon-name="star_line" @click="editBaseDialogRef?.open" :text="{ 'zh-CN': '基础信息', 'en-US': 'Base Config' }" />
        <pa-button icon-name="grid_adaptive_line" @click="dataStructureManagementDialogRef?.open" :text="{ 'zh-CN': '表结构管理', 'en-US': 'Data Structure Config' }" />
        <pa-button icon-name="route_line" @click="interfaceManagementDialogRef?.open" :text="{ 'zh-CN': '接口管理', 'en-US': 'Interface Config' }" />
        <pa-button icon-name="category_list_line" @click="optionManagementDialogRef?.open" :text="{ 'zh-CN': '选项管理', 'en-US': 'Option Config' }" />
      </pa-button-group>

      <pa-button class="mr-size" is="add" type="success" @click="handleCreatePage" :text="{ 'zh-CN': '创建页面', 'en-US': 'Create Page' }" />

      <pa-button-group type="warning" class="mr-size">
        <pa-button type="warning" icon-name="report_data_line" @click="handleEnablePlayground" :text="{ 'zh-CN': '模拟场', 'en-US': 'Enable Playground' }" />
        <pa-button type="warning" icon-name="report_data_line" @click="handleEnableTraining" :text="{ 'zh-CN': '训练场', 'en-US': 'Enable Trainingground' }" />
        <pa-button is="save" type="warning" @click="saveBaseConfig" :text="{ 'zh-CN': '保存', 'en-US': 'Save' }" />
      </pa-button-group>
    </div>

    <div class="svg-container" @wheel="handleWheel" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
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
            <foreignObject x="0" y="calc(0px - (var(--pa-size-height) + var(--pa-size-padding) / 2) * 2)" :width="200" :height="30" @mousedown="handleClickItem(index)">
              <pa-button is="add" icon-name="setting_line" @click="editPageBaseDialogRef?.open(index)">
                {{ page.name }}
              </pa-button>
            </foreignObject>

            <!-- 创建表格/创建表单/创建选项卡按钮 -->
            <foreignObject x="0" y="calc(0px - (var(--pa-size-height) + var(--pa-size-padding) / 2) * 1)" :width="320" :height="30" @mousedown="handleClickItem(index)">
              <pa-button-group type="success">
                <pa-button is="add" type="success" @click="handleCreateTable(index)" :text="{ 'zh-CN': '创建表格', 'en-US': 'Create Table' }" />
                <pa-button is="add" type="success" @click="handleCreateForm(index)" :text="{ 'zh-CN': '创建表单', 'en-US': 'Create Form' }" />
                <pa-button is="add" type="success" @click="handleCreateTabs(index)" :text="{ 'zh-CN': '创建选项卡', 'en-US': 'Create Tabs' }" />
              </pa-button-group>
            </foreignObject>

            <!-- 删除按钮 -->
            <foreignObject :x="320" y="calc(0px - (var(--pa-size-height) + var(--pa-size-padding) / 2) * 1)" :width="200" :height="40">
              <pa-button
                class="draggable-btn"
                type="warning"
                iconName="map_pin_line"
                :debounced="false"
                :text="{ 'zh-CN': '拖拽', 'en-US': 'Drag' }"
                @click="handleClickItem(index)"
                @mousedown="draggableRefs[page.pageId]?.handleMouseDown"
              />
              <pa-button class="draggable-btn _del" type="default" iconName="recycle_line" :debounced="false" :text="{ 'zh-CN': '删除', 'en-US': 'Delete' }" @click="handleDeletePage(index)" />
            </foreignObject>

            <template v-if="page.itemConfigs.length">
              <template v-for="(item, itemIndex) in page.itemConfigs" :key="item.itemId">
                <m-item-svg
                  :ref="el => (item.type === 'form' ? setFormRef(el, item.itemId) : item.type === 'table' ? setTableRef(el, item.itemId) : setTabsItemRef(el, item.itemId))"
                  @lock-scroll="lockScroll = $event"
                  @delete-form="handleDeleteItem"
                  @handle-click-item="handleClickItem(index)"
                  :position="{ x: page.x, y: page.y }"
                  :pageY="itemIndex != 0 ? page.itemConfigs.filter((item, index) => index < itemIndex).reduce((acc, cur) => acc + (cur.height || 0), 0) : 0"
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
                  @update-page-size="data => ((page.itemConfigs[itemIndex].width = data.width), (page.itemConfigs[itemIndex].height = data.height + 20))"
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
      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-table-col-quick_' + item.prop" #[item.prop]="{ data }">
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
    <dialog-edit-form-item ref="editFormItemDialogRef" @handle-edit-form-item-submit="handleEditFormItemSubmit" :exOptionsMaps="inValue.exOptions" :edit-item="editFormItemData" />
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

    <dialog-edit-page-base-config ref="editPageBaseDialogRef" @submit="data => (inValue.pagesConfigs[data.index].name = data.name)" :playground-items="inValue.pagesConfigs" />

    <!-- 模拟场配置弹窗（未显示） -->
    <m-simulated-field ref="simulatedFieldRef" :id="inValue.id" :playground-items="inValue.pagesConfigs" :interfaceConfigs="inValue.interfaceConfigs" :data-structures="inValue.dataStructures" />

    <!-- 模拟场弹窗 -->
    <pa-playground-visible
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
    <dialog-edit-base-config ref="editBaseDialogRef" :edit-base-data="inValue" @submit="data => (inValue = data)" :playground-items="inValue.pagesConfigs" />

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
      <template v-for="item in props.authorizationFunction" :key="'dialog-data-structure-management_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>
    </dialog-data-structure-management>

    <dialog-option-management ref="optionManagementDialogRef" :edit-base-data="inValue.exOptions" @submit="data => (inValue.exOptions = data)" />
  </div>
</template>

<script lang="tsx" setup>
/**
 * 模块导入
 * @description 导入 Vue 相关模块
 */
import { ref, watch, computed, provide, useTemplateRef, onMounted, inject, Ref } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, PaPlaygroundType, PaPlaygroundItem } from "./types";
/**
 * 模块导入
 * @description 导入 SVG 钩子
 */
import { useSvgHooks } from "./hooks/use-svg-hooks";
/**
 * 模块导入
 * @description 导入自动保存钩子
 */
import { useAutoSave } from "./hooks/use-auto-save";
/**
 * 模块导入
 * @description 导入项目 SVG 子组件
 */
import MItemSvg from "./components/item-svg.vue";
/**
 * 模块导入
 * @description 导入 SVG 拖拽子组件
 */
import MSvgDraggable from "./components/svg-draggable.vue";
/**
 * 模块导入
 * @description 导入表格列编辑弹窗子组件
 */
import DialogEditTableCol from "./components/table-components/dialog-edit-table-col.vue";
/**
 * 模块导入
 * @description 导入表格列快捷编辑弹窗子组件
 */
import DialogEditTableColQuick from "./components/table-components/dialog-edit-table-col-quick.vue";
/**
 * 模块导入
 * @description 导入表单项编辑弹窗子组件
 */
import DialogEditFormItem from "./components/form-components/dialog-edit-form-item.vue";
/**
 * 模块导入
 * @description 导入表单项快捷编辑弹窗子组件
 */
import DialogEditFormItemQuick from "./components/form-components/dialog-edit-form-item-quick.vue";
/**
 * 模块导入
 * @description 导入选项卡项快捷编辑弹窗子组件
 */
import DialogEditTabsItemQuick from "./components/tabs-components/dialog-edit-tabs-item-quick.vue";
/**
 * 模块导入
 * @description 导入可见性弹窗子组件
 */
import MVisibleDialog from "./components/visible-dialog.vue";
/**
 * 模块导入
 * @description 导入按钮编辑弹窗子组件
 */
import DialogEditButton from "./components/table-components/dialog-edit-button.vue";
/**
 * 模块导入
 * @description 导入基础配置编辑弹窗子组件
 */
import DialogEditBaseConfig from "./components/dialog-edit-base-config.vue";
/**
 * 模块导入
 * @description 导入页面配置编辑弹窗子组件
 */
import DialogEditPageConfig from "./components/dialog-edit-page-config.vue";
/**
 * 模块导入
 * @description 导入接口管理弹窗子组件
 */
import DialogInterfaceManagement from "./components/dialog-interface-management.vue";
/**
 * 模块导入
 * @description 导入数据结构管理弹窗子组件
 */
import DialogDataStructureManagement from "./components/dialog-data-structure-management.vue";
/**
 * 模块导入
 * @description 导入页面基础配置编辑弹窗子组件
 */
import DialogEditPageBaseConfig from "./components/dialog-edit-page-base-config.vue";
/**
 * 模块导入
 * @description 导入选项管理弹窗子组件
 */
import DialogOptionManagement from "./components/dialog-option-management.vue";
/**
 * 模块导入
 * @description 导入模拟场子组件
 */
import MSimulatedField from "./components/simulated-field.vue";
/**
 * 模块导入
 * @description 导入模拟场可见性子组件
 */
import PaPlaygroundVisible from "./pa-playground-visible.vue";
/**
 * 模块导入
 * @description 导入 Pancake 类型定义
 */
import { PaStructureType } from "PancakeType";
/**
 * 模块导入
 * @description 导入页面按钮类型
 */
import { PaPlaygroundPageButtonType } from "./components/types";
/**
 * 模块导入
 * @description 导入 IndexDB 工具
 */
import { openDB } from "../indexDB/indexDB";
/**
 * 模块导入
 * @description 导入表格选项配置
 */
import { TableUseOptions } from "./configs/options";

/**
 * 组件属性
 * @type ComponentProps
 * @description 组件属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
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

/**
 * 全局配置
 * @type Ref
 * @description 注入全局配置
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as Ref<any>;
/**
 * 语言设置
 * @type ComputedRef
 * @description 当前语言设置
 */
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");

/**
 * 表格组件引用
 * @type Ref
 * @description 表格组件引用映射
 */
const tableRefs = ref<Record<string, any>>({});
/**
 * 表单组件引用
 * @type Ref
 * @description 表单组件引用映射
 */
const formRefs = ref<Record<string, any>>({});
/**
 * 选项卡组件引用
 * @type Ref
 * @description 选项卡组件引用映射
 */
const tabsItemRefs = ref<Record<string, any>>({});
/**
 * 拖拽组件引用
 * @type Ref
 * @description SVG 拖拽组件引用映射
 */
const draggableRefs = ref<Record<string, any>>({});
/**
 * 编辑基础信息弹窗引用
 * @type TemplateRef
 */
const editBaseDialogRef = useTemplateRef("editBaseDialogRef");
/**
 * 数据结构管理弹窗引用
 * @type TemplateRef
 */
const dataStructureManagementDialogRef = useTemplateRef("dataStructureManagementDialogRef");
/**
 * 接口管理弹窗引用
 * @type TemplateRef
 */
const interfaceManagementDialogRef = useTemplateRef("interfaceManagementDialogRef");
/**
 * 选项管理弹窗引用
 * @type TemplateRef
 */
const optionManagementDialogRef = useTemplateRef("optionManagementDialogRef");
/**
 * 编辑项目基础信息弹窗引用
 * @type TemplateRef
 */
const editItemBaseDialogRef = useTemplateRef("editItemBaseDialogRef");
/**
 * 编辑页面基础信息弹窗引用
 * @type TemplateRef
 */
const editPageBaseDialogRef = useTemplateRef("editPageBaseDialogRef");
/**
 * 编辑表格列弹窗引用
 * @type TemplateRef
 */
const editTableColDialogRef = useTemplateRef("editTableColDialogRef");
/**
 * 编辑表单项弹窗引用
 * @type TemplateRef
 */
const editFormItemDialogRef = useTemplateRef("editFormItemDialogRef");
/**
 * 编辑表单项快捷弹窗引用
 * @type TemplateRef
 */
const editFormItemQuickDialogRef = useTemplateRef("editFormItemQuickDialogRef");
/**
 * 编辑选项卡项快捷弹窗引用
 * @type TemplateRef
 */
const editTabsItemQuickDialogRef = useTemplateRef("editTabsItemQuickDialogRef");
/**
 * 可见性弹窗引用
 * @type TemplateRef
 */
const visibleDialogRef = useTemplateRef("visibleDialogRef");
/**
 * 编辑操作弹窗引用
 * @type TemplateRef
 */
const editOperationDialogRef = useTemplateRef("editOperationDialogRef");
/**
 * 编辑表格列快捷弹窗引用
 * @type TemplateRef
 */
const editTableColQuickDialogRef = useTemplateRef("editTableColQuickDialogRef");
/**
 * 模拟场配置弹窗引用
 * @type TemplateRef
 */
const simulatedFieldRef = useTemplateRef("simulatedFieldRef");
/**
 * 模拟场可见性弹窗引用
 * @type TemplateRef
 */
const simulatedFieldVisibleRef = useTemplateRef("simulatedFieldVisibleRef");
/**
 * 编辑表格列数据
 * @type Ref
 * @description 当前编辑的表格列数据
 */
const editTableColData = ref<PaStructureType.Table | undefined>();
/**
 * 编辑表单项数据
 * @type Ref
 * @description 当前编辑的表单项数据
 */
const editFormItemData = ref<PaStructureType.Form | undefined>();
/**
 * 内部数据
 * @type Ref
 * @description 组件内部数据
 */
const inValue = ref<PaPlaygroundType>(props.data);
/**
 * 是否使用模拟数据
 * @type Ref
 * @description 是否使用 IndexDB 模拟数据
 */
const useMock = ref(true);
/**
 * SVG 引用
 * @type Ref
 * @description SVG 元素引用
 */
const svgRef = ref<SVGSVGElement>();
/**
 * 锁定滚动状态
 * @type Ref
 * @description 是否锁定画布滚动
 */
const lockScroll = ref(false);
/**
 * 自动保存方法
 * @description 自动保存相关方法
 */
const { start, stop, getSavedValue } = useAutoSave(inValue, "pa-playground-data");

/**
 * 设置表格组件引用
 * @param el 组件实例
 * @param id 组件标识
 */
function setTableRef(el: any, id: string) {
  el && (tableRefs.value[id] = el);
}
/**
 * 设置表单组件引用
 * @param el 组件实例
 * @param id 组件标识
 */
function setFormRef(el: any, id: string) {
  el && (formRefs.value[id] = el);
}
/**
 * 设置选项卡组件引用
 * @param el 组件实例
 * @param id 组件标识
 */
function setTabsItemRef(el: any, id: string) {
  el && (tabsItemRefs.value[id] = el);
}
/**
 * 设置拖拽组件引用
 * @param el 组件实例
 * @param id 组件标识
 */
function setDraggableRef(el: any, id: string) {
  el && (draggableRefs.value[id] = el);
}

/**
 * 生成随机ID
 * @param prefix ID前缀
 * @returns 随机ID字符串
 * @description 生成带前缀的随机ID
 */
function generateRandomId(prefix: string = "page") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * 提供编辑表格列弹窗方法
 * @description 注入编辑表格列弹窗打开方法
 */
provide(
  "openEditTableColDialog",
  computed(() => editTableColDialogRef?.value?.openEditTableColDialog)
);
/**
 * 提供编辑表单项弹窗方法
 * @description 注入编辑表单项弹窗打开方法
 */
provide(
  "openEditFormItemDialog",
  computed(() => editFormItemDialogRef?.value?.openEditFormItemDialog)
);
/**
 * 提供可见性弹窗方法
 * @description 注入可见性弹窗打开方法
 */
provide(
  "openVisibleDialog",
  computed(() => visibleDialogRef?.value?.openVisibleDialog)
);
/**
 * 提供编辑操作弹窗方法
 * @description 注入编辑操作弹窗打开方法
 */
provide(
  "openEditOperationDialog",
  computed(() => editOperationDialogRef?.value?.openEditOperationDialog)
);
/**
 * 提供编辑项目基础信息方法
 * @description 注入编辑项目基础信息弹窗打开方法
 */
provide("openEditItemBaseDialog", (config: PaPlaygroundItem) => {
  editItemBaseDialogRef.value?.open(config);
});
/**
 * 提供表格列快捷编辑方法
 * @description 注入表格列快捷编辑弹窗打开方法
 */
provide("openEditTableColQuickDialog", (tableId: string, config: PaStructureType.Table[], options: Record<string, string>) => {
  editTableColQuickDialogRef.value?.openEditDialog(
    tableId,
    config.map(item => ({ ...item, cellConfig: item.cellConfig || {} })),
    options
  );
});
/**
 * 提供表单项快捷编辑方法
 * @description 注入表单项快捷编辑弹窗打开方法
 */
provide("openEditFormItemQuickDialog", (formId: string, config: PaStructureType.Form[], options: Record<string, string>) => {
  editFormItemQuickDialogRef.value?.openEditDialog(
    formId,
    config.map(item => ({ ...item })),
    options
  );
});
/**
 * 提供选项卡项快捷编辑方法
 * @description 注入选项卡项快捷编辑弹窗打开方法
 */
provide("openEditTabsItemQuickDialog", (tableId: string, config: Array<PaStructureType.Form & { scroll: number; padding: string[] }>, options: Record<string, string>) => {
  editTabsItemQuickDialogRef.value?.openEditDialog(
    tableId,
    config.map(item => ({ ...item })),
    options
  );
});

/**
 * 使用SVG相关的hooks
 * @description 初始化 SVG 拖拽和缩放功能
 */
const { scale, translateX, translateY, transform, backgroundStyle, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, getSvgTransform, updateAdminConfig, handleDeletePage } = useSvgHooks(
  lockScroll,
  inValue
);

/**
 * 拖拽索引
 * @type Ref
 * @description 当前拖拽项的索引
 */
const draggedIndex = ref(-1);

/**
 * 处理编辑表格列提交
 * @param tableId 表格ID
 * @param data 表格列数据
 * @param options 选项配置
 */
const handleEditTableColSubmit = (tableId: string, data: PaStructureType.Table, options: Record<string, string>) => tableRefs.value[tableId].updateCol(data, options);

/**
 * 处理编辑表单项提交
 * @param formId 表单ID
 * @param data 表单项数据
 * @param options 选项配置
 */
const handleEditFormItemSubmit = (formId: string, data: PaStructureType.Form, options: Record<string, string>) => formRefs.value[formId].updateItem(data, options);

/**
 * 处理编辑表格列快速提交
 * @param tableId 表格ID
 * @param data 表格列数据数组
 * @param options 选项配置
 */
const handleEditTableColQuickSubmit = (tableId: string, data: PaStructureType.Table[], options: Record<string, string>) => tableRefs.value[tableId].updateItemAll(data, options);

/**
 * 处理编辑表单项快速提交
 * @param formId 表单ID
 * @param data 表单项数据数组
 * @param options 选项配置
 */
const handleEditFormItemQuickSubmit = (formId: string, data: PaStructureType.Form[], options: Record<string, string>) => formRefs.value[formId].updateItemAll(data, options);

/**
 * 处理编辑选项卡项快速提交
 * @param tableId 选项卡ID
 * @param data 选项卡项数据数组
 */
const handleEditTabsItemQuickSubmit = (tableId: string, data: PaStructureType.Form[]) => tabsItemRefs.value[tableId].updateItemAll(data);

/**
 * 保存基础配置
 * @description 获取当前 SVG 变换并输出配置数据
 */
function saveBaseConfig() {
  const position = getSvgTransform();
  const formData = inValue.value;
  const _exData = { ...formData, ...position };
  console.log("++++++++++> _exData:", JSON.stringify(_exData));
}

/**
 * 创建页面
 * @description 在画布中创建新页面
 */
function handleCreatePage() {
  const id = generateRandomId();
  const name = `页面`;
  const x = inValue.value.pagesConfigs.length * 200 + 10;
  const y = Math.floor(inValue.value.pagesConfigs.length + 1) * 200;
  inValue.value.pagesConfigs.push({ pageId: id, name, x, y, itemConfigs: [] });
}

/**
 * 创建表格
 * @param index 页面索引
 * @description 在指定页面中创建表格组件
 */
function handleCreateTable(index: number) {
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
  setTimeout(() => {
    const tableComponent = tableRefs.value[itemId];
    if (tableComponent) tableComponent.createTable();
  }, 100);
}

/**
 * 创建表单
 * @param index 页面索引
 * @description 在指定页面中创建表单组件
 */
function handleCreateForm(index: number) {
  const itemId = generateRandomId("form");
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

/**
 * 创建选项卡
 * @param index 页面索引
 * @description 在指定页面中创建选项卡组件
 */
function handleCreateTabs(index: number) {
  const itemId = generateRandomId("tabs");
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

/**
 * 删除元素
 * @param itemId 元素ID
 * @description 删除指定元素
 */
function handleDeleteItem(itemId: string) {
  inValue.value.pagesConfigs.forEach(page => {
    page.itemConfigs = page.itemConfigs.filter(item => item.itemId !== itemId);
  });
  inValue.value.pagesConfigs = inValue.value.pagesConfigs;
}

/**
 * 处理按钮提交
 * @param editId 编辑ID
 * @param data 按钮配置数据
 * @description 处理编辑操作按钮提交
 */
function handleEditOperationSubmit(editId: string, data: PaPlaygroundPageButtonType[]) {
  inValue.value.pagesConfigs.forEach(page => {
    page.itemConfigs.forEach(item => {
      if (item.itemId === editId) {
        tableRefs.value[editId].updateOperation(data);
      }
    });
  });
}

/**
 * 点击元素移动到数组最后面
 * @param index 页面索引
 * @description 将点击的页面移动到数组最后面以显示在最上层
 */
function handleClickItem(index: number) {
  if (index >= 0 && index < inValue.value.pagesConfigs.length) {
    const item = inValue.value.pagesConfigs.splice(index, 1)[0];
    inValue.value.pagesConfigs.push(item);
  }
}

/**
 * 处理编辑项目基础信息提交
 * @param data 项目基础信息数据
 * @description 处理编辑项目基础信息弹窗提交
 */
function handleEditItemBaseSubmit(data: PaPlaygroundItem) {
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
}

/**
 * 处理模拟场
 * @description 打开模拟场（使用模拟数据）
 */
async function handleEnablePlayground() {
  useMock.value = true;
  simulatedFieldVisibleRef.value?.openVisibleDialog();
}

/**
 * 处理训练场
 * @description 打开训练场（使用真实接口）
 */
async function handleEnableTraining() {
  useMock.value = false;
  simulatedFieldVisibleRef.value?.openVisibleDialog();
}

/**
 * 拖拽开始
 * @param event 拖拽事件
 * @param index 拖拽项索引
 * @description 处理拖拽开始事件
 */
function handleDragStart(event: DragEvent, index: number) {
  event.stopPropagation();
  event.dataTransfer?.setData("text/plain", index.toString());
  (event.target as HTMLElement).style.opacity = "0.5";
  (event.target as HTMLElement).classList.add("dragging");
  draggedIndex.value = index;
}

/**
 * 拖拽悬停
 * @param event 拖拽事件
 * @description 处理拖拽悬停事件
 */
function handleDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  const items = document.querySelectorAll(".glass-container");
  items.forEach(item => item.classList.remove("dragover"));
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.add("dragover");
  }
}

/**
 * 拖拽进入
 * @param event 拖拽事件
 * @description 处理拖拽进入事件
 */
function handleDragEnter(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * 拖拽离开
 * @param event 拖拽事件
 * @description 处理拖拽离开事件
 */
function handleDragLeave(event: DragEvent) {
  event.stopPropagation();
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.remove("dragover");
  }
}

/**
 * 拖拽结束
 * @param event 拖拽事件
 * @description 处理拖拽结束事件
 */
function handleDragEnd(event: DragEvent) {
  event.stopPropagation();
  (event.target as HTMLElement).style.opacity = "1";
  (event.target as HTMLElement).classList.remove("dragging");
  const items = document.querySelectorAll(".glass-container");
  items.forEach(item => item.classList.remove("dragover"));
  draggedIndex.value = -1;
}

/**
 * 拖拽放置
 * @param event 拖拽事件
 * @param pageIndex 页面索引
 * @param targetIndex 目标位置索引
 * @description 处理拖拽放置事件，重新排序元素
 */
function handleDrop(event: DragEvent, pageIndex: number, targetIndex: number) {
  event.preventDefault();
  event.stopPropagation();

  const oldIndex = parseInt(event.dataTransfer!.getData("text/plain"));
  if (oldIndex !== -1 && oldIndex !== targetIndex) {
    const newArray = [...inValue.value.pagesConfigs[pageIndex].itemConfigs];
    const [draggedItem] = newArray.splice(oldIndex, 1);
    newArray.splice(targetIndex, 0, draggedItem);
    inValue.value.pagesConfigs[pageIndex].itemConfigs = newArray;
  }

  (event.target as HTMLElement).style.opacity = "1";
  (event.target as HTMLElement).classList.remove("dragging");
  const items = document.querySelectorAll(".glass-container");
  items.forEach(item => item.classList.remove("dragover"));
  draggedIndex.value = -1;
}

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
      inValue.value = savedData as PaPlaygroundType;
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
@use "./index.scss";
</style>
