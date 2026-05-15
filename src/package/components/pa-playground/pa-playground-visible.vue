<template>
  <template v-if="useToPage">
    <template v-for="page in homeIndexConfig?.itemConfigs" :key="page.itemId">
      <m-title v-if="page.title?.[language]" class="mb-size">{{ page.title[language] }}</m-title>

      <pa-form
        id="visibleForm"
        v-if="page.type === 'form'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure)  as PaStructureType.Form[])"
        :exOptions="exOptionsComputed"
        :ex-span="page.otherProps?.exSpan"
        :display="page.otherProps?.display"
      />

      <pa-table
        id="visibleTable"
        v-if="page.type === 'table'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure) as PaStructureType.Table[])"
        :request-api="query => getTableList((page.actionApi as string), query)"
        :exOptions="exOptionsComputed"
        class="flex1"
        :request-auto="!dialogConfig"
      >
        <template v-for="slotName in findSlotName(page.actionButtons)" :key="slotName" #[`${slotName}`]="{ row }">
          <template v-for="(item, index) in page.actionButtons" :key="'btn_' + index">
            <template v-if="item.useType == slotName">
              <template v-if="!item?.authorization?.length || visibleBefore?.(item)">
                <pa-button
                  v-if="item.styleType == 'Built'"
                  :is="item.is"
                  :text="item.isText"
                  @click="handleButtonSubmit(item, { row, page })"
                />
                <pa-button
                  v-else
                  :type="item.type"
                  :iconName="item.icon"
                  :text="item.text"
                  @click="handleButtonSubmit(item, { row, page })"
                />
              </template>
            </template>
          </template>
        </template>
      </pa-table>

      <pa-tabs id="visibleTabs" v-if="page.type === 'tabs'" align="edge">
        <pa-tabs-item
          v-for="tab in setStructure(page.structure) as any"
          :key="tab.prop"
          :label="tab.label as string"
          :name="tab.prop as string"
          :scroll="!!tab.scroll"
          :padding="tab.padding"
        >
          <pa-playground-visible
            :id="tab.itemId"
            :ex-transmit-data="tab.transmitData"
            :ex-home-index-config="tab.homeIndexConfig"
            :ex-click-button-config="tab.clickButtonConfig"
            :base-config="props.baseConfig"
            :playground-items="props.playgroundItems"
            :interfaceConfigs="props.interfaceConfigs"
            :data-structures="props.dataStructures"
            :ex-options-maps="props.exOptionsMaps"
            :request-function="props.requestFunction"
            :action-function="props.actionFunction"
            :use-mock="props.useMock"
            useToPage
          />
        </pa-tabs-item>
      </pa-tabs>
    </template>
  </template>

  <pa-dialog
    v-else
    v-model="visible"
    :title="
      dialogConfig?.dialogTitle?.['zh-CN'] && dialogConfig?.dialogTitle?.['en-US']
        ? dialogConfig?.dialogTitle
        : { 'en-US': 'Simulated Field', 'zh-CN': '模拟场' }
    "
    :sub-title="dialogConfig?.dialogSubTitle ? transmitData?.[dialogConfig?.dialogSubTitle] : ''"
    :padding="['all']"
    :size="dialogConfig?.dialogSize || 'full'"
    :use-full="false"
    :scroll="!!dialogConfig?.dialogScroll || false"
    @closed="emits('closed')"
  >
    <template v-for="page in homeIndexConfig?.itemConfigs" :key="page.itemId">
      <m-title v-if="page.title?.[language]" class="mb-size">{{ page.title[language] }}</m-title>

      <pa-form
        id="visibleForm"
        v-if="page.type === 'form'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure)  as PaStructureType.Form[])"
        :exOptions="exOptionsComputed"
        :ex-span="page.otherProps?.exSpan"
        :display="page.otherProps?.display"
      />

      <pa-table
        id="visibleTable"
        v-if="page.type === 'table'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure) as PaStructureType.Table[])"
        :request-api="query => getTableList((page.actionApi as string), query)"
        :exOptions="exOptionsComputed"
        class="flex1"
        :request-auto="!dialogConfig"
      >
        <template v-for="slotName in findSlotName(page.actionButtons)" :key="slotName" #[`${slotName}`]="{ row }">
          <template v-for="(item, index) in page.actionButtons" :key="'btn_' + index">
            <template v-if="item.useType == slotName">
              <template v-if="!item?.authorization?.length || visibleBefore?.(item)">
                <pa-button
                  v-if="item.styleType == 'Built'"
                  :is="item.is"
                  :text="item.isText"
                  @click="handleButtonSubmit(item, { row, page })"
                />
                <pa-button
                  v-else
                  :type="item.type"
                  :iconName="item.icon"
                  :text="item.text"
                  @click="handleButtonSubmit(item, { row, page })"
                />
              </template>
            </template>
          </template>
        </template>
      </pa-table>

      <pa-tabs id="visibleTabs" v-if="page.type === 'tabs'" align="edge">
        <pa-tabs-item
          v-for="tab in setStructure(page.structure) as any"
          :key="tab.prop"
          :label="tab.label as string"
          :name="tab.prop as string"
          :scroll="!!tab.scroll"
          :padding="tab.padding"
        >
          <pa-playground-visible
            :id="tab.itemId"
            :ex-transmit-data="tab.transmitData"
            :ex-home-index-config="tab.homeIndexConfig"
            :ex-click-button-config="tab.clickButtonConfig"
            :base-config="props.baseConfig"
            :playground-items="props.playgroundItems"
            :interfaceConfigs="props.interfaceConfigs"
            :data-structures="props.dataStructures"
            :ex-options-maps="props.exOptionsMaps"
            :request-function="props.requestFunction"
            :action-function="props.actionFunction"
            :use-mock="props.useMock"
            useToPage
          />
        </pa-tabs-item>
      </pa-tabs>
    </template>

    <template #footer v-if="dialogConfig?.dialogContentButtons">
      <template v-for="item in dialogConfig?.dialogContentButtons" :key="'btn_' + item.text">
        <template v-if="!item?.authorization?.length || visibleBefore?.(item)">
          <pa-button v-if="item.styleType == 'Built'" :is="item.is" :text="item.isText" @click="handleButtonSubmit(item, {})" />
          <pa-button v-else :type="item.type" :iconName="item.icon" :text="item.text" @click="handleButtonSubmit(item, {})"
        /></template>
      </template>
    </template>
  </pa-dialog>

  <pa-playground-visible
    v-if="findNextPage"
    ref="visibleDialogRef"
    :id="props.id"
    :base-config="props.baseConfig"
    :playground-items="props.playgroundItems"
    :interfaceConfigs="props.interfaceConfigs"
    :data-structures="props.dataStructures"
    :ex-options-maps="props.exOptionsMaps"
    :request-function="props.requestFunction"
    :action-function="props.actionFunction"
    :use-mock="props.useMock"
    @closed="handleClose"
  />
</template>

<script lang="tsx" setup>
/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { ComputedRef, computed, inject, nextTick, ref, useTemplateRef } from "vue";
/**
 * 模块导入
 * @description 导入 Playground 类型定义
 */
import {
  MInterfaceConfig,
  PaPlaygroundType,
  PaPlaygroundPagesType,
  MStructureType,
  PaPlaygroundItem,
  MOptionsType,
  PaPlaygroundActionFunctionType
} from "./types";
/**
 * 模块导入
 * @description 导入反馈组件
 */
import { M_Message, M_MessageBox } from "../feedback";
/**
 * 模块导入
 * @description 导入 Playground 可见性组件
 */
import PaPlaygroundVisible from "./pa-playground-visible.vue";
/**
 * 模块导入
 * @description 导入字典查询工具
 */
import useDictionariesAll from "../tools/dictionaries-all";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入 Pancake 类型定义
 */
import { PaOptionType, PaStructureType } from "PancakeType";
/**
 * 模块导入
 * @description 导入 IndexDB 数据操作方法
 */
import { deleteDataByKey, getAllData, queryData, storeData, updateData } from "../indexDB/indexDB";
/**
 * 模块导入
 * @description 导入页面按钮类型
 */
import { PaPlaygroundPageButtonType } from "./components/types";
/**
 * 模块导入
 * @description 导入字典类型
 */
import { dictType } from "../tools/type";
/**
 * 模块导入
 * @description 导入空值判断工具
 */
import isNil from "../tools/is-nil";

/**
 * 全局配置
 * @type ComputedRef
 * @description 注入全局配置
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 语言设置
 * @type ComputedRef
 * @description 当前语言设置
 */
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
/**
 * 页面点击按钮配置
 * @type Ref
 * @description 当前页面点击的按钮配置
 */
const pageClickButtonConfig = ref<PaPlaygroundPageButtonType>();
/**
 * 查找下一页标识
 * @type Ref
 * @description 是否查找下一页
 */
const findNextPage = ref<boolean>(false);

/**
 * 组件属性
 * @description 模拟场可见性组件属性
 */
const props = withDefaults(
  defineProps<{
    id?: string;
    baseConfig: PaPlaygroundType;
    playgroundItems: PaPlaygroundPagesType[];
    interfaceConfigs: MInterfaceConfig[];
    dataStructures: MStructureType[];
    exOptionsMaps: MOptionsType[];
    useMock: boolean;
    requestFunction?: any;
    actionFunction?: Array<PaOptionType.Select & PaPlaygroundActionFunctionType>;
    authorizationFunction?: Array<PaStructureType.Table>;
    actionBefore?: (data: any) => boolean;
    visibleBefore?: (data: any) => boolean;
    useToPage?: boolean;

    exTransmitData?: Record<string, any>;
    exHomeIndexConfig?: PaPlaygroundPagesType;
    exClickButtonConfig?: PaPlaygroundPageButtonType;
  }>(),
  { useMock: true, useToPage: false }
);

/**
 * 扩展选项计算值
 * @type Ref
 * @description 计算后的扩展选项数据
 */
const exOptionsComputed = ref<PaOptionType.Default>({});

/**
 * 组件事件
 * @description 模拟场可见性组件事件定义
 */
const emits = defineEmits<{
  closed: [];
  "action-before": [data: { buttonInfo: any; data: any }];
  "visible-before": [data: any];
}>();

/**
 * 设置结构
 * @param structure 结构配置数组
 * @returns 过滤后的结构配置数组
 * @description 根据可见性条件过滤结构配置
 */
function setStructure(
  structure: PaStructureType.Form[] | PaStructureType.Table[]
): PaStructureType.Form[] | PaStructureType.Table[] {
  return structure.filter(item => (props.visibleBefore ? props.visibleBefore?.(item) : item)) as
    | PaStructureType.Form[]
    | PaStructureType.Table[];
}

/**
 * 可见性状态
 * @type Ref
 * @description 弹窗可见性
 */
const visible = ref(false);
/**
 * 首页索引配置
 * @type Ref
 * @description 当前首页索引配置
 */
const homeIndexConfig = ref<PaPlaygroundPagesType>();
/**
 * 可见性弹窗引用
 * @type TemplateRef
 */
const visibleDialogRef = useTemplateRef("visibleDialogRef");
/**
 * 弹窗配置
 * @type Ref
 * @description 弹窗配置数据
 */
const dialogConfig = ref<PaPlaygroundPageButtonType>();

/**
 * 项目引用映射
 * @type Ref
 * @description 存储组件实例与页面配置的映射关系
 */
const ItemRefs = ref<Record<string, { el: any; page: PaPlaygroundItem }>>({});
/**
 * 设置组件引用
 * @param el 组件实例
 * @param page 页面配置项
 */
const setRef = (el: any, page: PaPlaygroundItem) => el && (ItemRefs.value[page.itemId] = { el, page });
/**
 * 传输数据
 * @type Ref
 * @description 跨页面传输的数据
 */
const transmitData = ref<Record<string, any>>({});

/**
 * 查找插槽名称
 * @param actionButtons 操作按钮列表
 * @returns 不重复的插槽名称列表
 * @description 获取所有操作按钮的不重复插槽名称
 */
function findSlotName(actionButtons) {
  const slotNameList: string[] = [];
  for (const item of actionButtons || []) {
    if (slotNameList.indexOf(item.useType) < 0) {
      slotNameList.push(item.useType);
    }
  }
  return slotNameList;
}

/**
 * 打开模拟字段可见性弹窗
 * @param _transmitData 传输数据
 * @param _homeIndexConfig 首页索引配置
 * @param _clickButtonConfig 点击按钮配置
 * @description 打开模拟字段可见性弹窗
 */
function openVisibleDialog(_transmitData?: Record<string, any>, _homeIndexConfig?, _clickButtonConfig?) {
  if (Object.keys(_transmitData || {}).length > 0 || _homeIndexConfig) {
    transmitData.value = _transmitData || {};
    homeIndexConfig.value = _homeIndexConfig;
    dialogConfig.value = _clickButtonConfig;
    visible.value = true;
    setExOptionsMaps(_homeIndexConfig.value?.itemConfigs || []);
    nextTick(() => getDetailById());
    return;
  }
  const adminIndex = props.baseConfig.adminIndex;
  if (!adminIndex || props.baseConfig.pagesConfigs.findIndex(item => item.pageId === adminIndex) < 0) {
    M_Message.danger(
      language === "en-US" ? "Home index is not set, please set it in the base information" : "首页索引未设置，请前往基础信息设置"
    );
    return;
  } else {
    homeIndexConfig.value = props.baseConfig.pagesConfigs.find(item => item.pageId === adminIndex);
    for (const item of homeIndexConfig.value?.itemConfigs || []) {
      if (item.type == "tabs") {
        for (const tab of item.structure || []) {
          const pageId = tab.page;
          const usePage = props.baseConfig.pagesConfigs.find(pg => pg.pageId === pageId);
          tab.homeIndexConfig = { ...usePage };
        }
      }
    }
    setExOptionsMaps(homeIndexConfig.value?.itemConfigs || []);
    visible.value = true;
  }
}

if (props.useToPage) {
  openVisibleDialog(props.exTransmitData, props.exHomeIndexConfig, props.exClickButtonConfig);
}

/**
 * 设置模拟字段可见性选项
 * @param itemConfigs 项目配置列表
 * @description 设置模拟字段可见性选项映射
 */
function setExOptionsMaps(itemConfigs: PaPlaygroundItem[]) {
  const exOptionsData = {};
  const dictionariesList: Record<string, MOptionsType> = {};
  for (const item of itemConfigs || []) {
    for (const exOption in item.exOptions || {}) {
      const findItem = props.exOptionsMaps.find(i => i.id === item.exOptions[exOption]);
      if (findItem?.OptionsType == "interface") {
        dictionariesList[exOption] = findItem;
      } else {
        exOptionsData[exOption] = findItem?.config || {};
      }
    }
  }
  exOptionsComputed.value = exOptionsData;

  if (Object.keys(dictionariesList).length > 0) {
    const params: dictType[] = [];
    for (const exOption in dictionariesList) {
      const findItem = dictionariesList[exOption];
      if (findItem.dictionaryType == "system") {
        params.push({
          key: exOption,
          dictionaryType: "system",
          dictionaryKey: findItem?.dictionaryKey || ""
        });
      } else {
        params.push({
          key: "DivisionValue",
          dictionaryType: "table",
          tableName: findItem?.tableName || "",
          columnName: findItem?.columnName || ""
        });
      }
      exOptionsComputed.value[exOption] = findItem?.config || {};
    }
    loadOptions(params);
  }
}

/**
 * 加载选项数据
 * @param params 字典查询参数列表
 * @description 根据字典参数异步加载选项数据
 */
async function loadOptions(params: dictType[]) {
  const options = await useDictionariesAll(params);

  for (const key in options) {
    options[key].map((item: any) => {
      if (isNaN(item.value)) return;
      item.value = Number(item.value);
    });
  }
  exOptionsComputed.value = { ...exOptionsComputed.value, ...options };
}

/**
 * 刷新数据
 * @description 刷新所有表格组件的数据
 */
function refreshData() {
  for (const key in ItemRefs.value) {
    if (ItemRefs.value[key].page.type == "table") {
      ItemRefs.value[key].el?.getTableList();
    }
  }
}

/**
 * 处理关闭
 * @description 关闭弹窗时刷新数据
 */
function handleClose() {
  if (pageClickButtonConfig.value && pageClickButtonConfig.value.refreshByDialogClose) refreshData();
}

/**
 * 按钮点击处理
 * @param item 按钮配置
 * @param data 行数据与页面配置
 * @description 处理按钮点击事件，支持弹窗、保存、删除和自定义操作
 */
async function handleButtonSubmit(item: PaPlaygroundPageButtonType, data: { row?: any; page?: PaPlaygroundItem }) {
  emits("action-before", { buttonInfo: item, data });

  /**
   * @description dialog 类型处理
   */
  if (item.actionType == "dialog") {
    const homeIndexConfig = props.baseConfig.pagesConfigs.find(config => config.pageId === item.dialogContentId);
    findNextPage.value = !isNil(homeIndexConfig);
    pageClickButtonConfig.value = item;
    if (!findNextPage.value) {
      return M_Message.danger(language === "zh-CN" ? "页面不存在" : "Next page is not set please in the information");
    }
    nextTick(() => {
      const _transmitData = {};
      for (const key of item.transmitData || []) {
        _transmitData[key] = data.row?.[key] || transmitData.value[key];
      }
      visibleDialogRef?.value?.openVisibleDialog(_transmitData, homeIndexConfig, item);
    });
  } else if (item.actionType == "save") {

  /**
   * @description save 类型处理
   */
    for (const key in ItemRefs.value) {
      if (ItemRefs.value[key].page.type == "form") {
        const query = await ItemRefs.value[key].el?.getSubmitForm();
        if (query) {
          const findApi = props.interfaceConfigs.find(api => api.id === item.actionApiId);
          if (findApi) {
            if (findApi?.requestParameters?.length) {
              for (const item of findApi.requestParameters) {
                query[item] = transmitData.value[item];
              }
            }
            SaveDataToDB(findApi, query, item);
          }
        }
      }
    }
  } else if (item.actionType == "delete") {

  /**
   * @description delete 类型处理
   */
    const findApi = props.interfaceConfigs.find(api => api.id === item.actionApiId);
    const query = {};
    if (item.transmitData && findApi) {
      if (findApi?.requestParameters?.length) {
        for (const item of findApi.requestParameters) {
          query[item] = data.row[item] || transmitData.value[item];
        }
      }
      DeleteDataToDB(findApi, query, item);
    }
  } else if (props.actionFunction?.length) {

  /**
   * @description actionFunction 类型处理
   */
    const findItem = props.actionFunction.find(act => act.value === item.actionType);
    if (findItem) {
      const outData = {};
      findItem.executionDependencies?.map((dep: any) => {
        outData[dep.key] = item?.[dep.key] || "";
      });

      findItem?.executionMethod({ ...outData, page: data?.page?.itemId ? ItemRefs.value[data?.page?.itemId].el : {} });
    }
  }
}

/**
 * 获取表格数据
 * @param actionApi 接口标识
 * @param query 查询参数
 * @returns 表格数据
 * @description 根据接口配置获取表格数据
 */
async function getTableList(actionApi: string, query: Record<string, string>) {
  const findApi = props.interfaceConfigs.find(item => item.id === actionApi);
  if (findApi) {
    if (findApi?.requestParameters?.length) {
      for (const item of findApi.requestParameters) {
        query[item] = transmitData.value[item];
      }
    }
    return await GetDataByDB(findApi, query);
  }
  return { Data: { TotalCount: 0, List: [] }, Code: 200 };
}

/**
 * 获取详情数据
 * @description 获取详情数据，存在 ID 时调用
 */
async function getDetailById() {
  for (const key in ItemRefs.value) {
    if (ItemRefs.value[key].page.type == "form") {
      if (ItemRefs.value[key].page.actionApi == "Upstream" && transmitData.value) {
        ItemRefs.value[key].el?.changeData_All(transmitData.value);
        return;
      }
      const findApi = props.interfaceConfigs.find(item => item.id === ItemRefs.value[key].page.actionApi);
      const query = {};
      if (findApi) {
        if (findApi?.requestParameters?.length) {
          for (const item of findApi.requestParameters) {
            query[item] = transmitData.value[item];
          }
        }
        const data = await GetDetailByDBToId(findApi, query);
        ItemRefs.value[key].el?.changeData_All(data);
      }
    } else if (ItemRefs.value[key].page.type == "table") {
      nextTick(() => {
        ItemRefs.value[key].el?.getTableList();
      });
    }
  }
}

/**
 * 从数据库获取数据
 * @param findApi 接口配置
 * @param query 查询参数
 * @returns 查询结果
 * @description 从 IndexDB 或真实接口获取数据
 */
async function GetDataByDB(findApi: MInterfaceConfig, query: Record<string, string>) {
  if (!props.useMock && props.requestFunction) {
    return props.requestFunction(findApi, query);
  }
  const DB_NAME = "DB_" + props.id;
  const STORE_NAME = "DB_" + props.id + "_API_" + findApi.dataStructure;
  const data = await getAllData(DB_NAME, STORE_NAME);
  const dataArray = data.map(item => ({ ...item, ...item.data }));
  return { Data: { TotalCount: dataArray.length, List: dataArray }, Code: 200 };
}

/**
 * 从数据库获取详情
 * @param findApi 接口配置
 * @param query 查询参数
 * @returns 详情数据
 * @description 根据 ID 从 IndexDB 获取详情数据
 */
async function GetDetailByDBToId(findApi: MInterfaceConfig, query: Record<string, string>) {
  const DB_NAME = "DB_" + props.id;
  const STORE_NAME = "DB_" + props.id + "_API_" + findApi.dataStructure;
  const _data = await queryData(DB_NAME, STORE_NAME, query);
  const data = _data?.[0];
  return data.data;
}

/**
 * 保存数据到数据库
 * @param findApi 接口配置
 * @param formData 表单数据
 * @param item 按钮配置
 * @description 保存数据到 IndexDB 或调用真实接口
 */
async function SaveDataToDB(findApi: MInterfaceConfig, formData: Record<string, string>, item: PaPlaygroundPageButtonType) {
  if (!props.useMock && props.requestFunction) {
    const { Code } = await props.requestFunction(findApi, formData);
    if (Code == 200 && item.closeBySave) {
      visible.value = false;
      if (item.refreshByDialogClose) emits("closed");
    }
  }

  const DB_NAME = "DB_" + props.id;
  const STORE_NAME = "DB_" + props.id + "_API_" + findApi.dataStructure;
  const dataStructure = props.dataStructures.find(item => item.id === findApi.dataStructure);
  const indexKeyObj = dataStructure?.config.find(item => item.id === dataStructure.indexKey);
  if (!indexKeyObj) return M_Message.danger(language === "en-US" ? "Save data to DB failed" : "保存数据到数据库失败(1)");
  try {
    if (transmitData.value && dataStructure?.indexKey && formData[dataStructure.indexKey]) {
      await updateData(DB_NAME, STORE_NAME, indexKeyObj.prop, formData[dataStructure.indexKey], { ...formData });
      M_Message.success(language === "en-US" ? "Update data to DB success" : "更新数据到数据库成功");
    } else {
      await storeData(DB_NAME, STORE_NAME, { ...formData, [indexKeyObj.prop]: new Date().getTime() });
      M_Message.success(language === "en-US" ? "Save data to DB success" : "保存数据到数据库成功");
    }

    if (item.closeBySave) {
      visible.value = false;
      if (item.refreshByDialogClose) emits("closed");
    }
  } catch (error) {
    M_Message.danger(language === "en-US" ? "Save data to DB failed" : "保存数据到数据库失败(2)");
  }
}

/**
 * 删除数据到数据库
 * @param findApi 接口配置
 * @param query 查询参数
 * @param item 按钮配置
 * @description 从 IndexDB 删除数据或调用真实接口
 */
async function DeleteDataToDB(findApi: MInterfaceConfig, query: Record<string, string>, item: PaPlaygroundPageButtonType) {
  M_MessageBox.delete({
    onConfirm: async () => {
      const DB_NAME = "DB_" + props.id;
      const STORE_NAME = "DB_" + props.id + "_API_" + findApi.dataStructure;
      try {
        if (!props.useMock && props.requestFunction) {
          const { Code } = await props.requestFunction(findApi, query || {});
          if (Code == 200 && item.closeBySave) {
            if (item.refreshByDialogClose) refreshData();
          }
          return;
        }
        const key = Object.keys(query)[0];
        const value = query[key];
        await deleteDataByKey(DB_NAME, STORE_NAME, key, value);
        M_Message.success(language === "en-US" ? "Delete data success" : "删除数据成功");
        if (item.refreshByDialogClose) refreshData();
      } catch (error) {
        M_Message.danger(language === "en-US" ? "Delete data failed" : "删除数据失败");
      }
    }
  });
}

/**
 * 暴露方法
 * @description 暴露打开可见性弹窗方法
 */
defineExpose({
  openVisibleDialog
});
</script>

