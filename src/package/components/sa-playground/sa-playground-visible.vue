<template>
  <template v-if="useToPage">
    <template v-for="page in homeIndexConfig?.itemConfigs" :key="page.itemId">
      <m-title v-if="page.title?.[language]" class="mb-size">{{ page.title[language] }}</m-title>

      <sa-form
        id="visibleForm"
        v-if="page.type === 'form'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure)  as SaStructureType.FormV2[])"
        :exOptions="exOptionsComputed"
        :ex-span="page.otherProps?.exSpan"
        :display="page.otherProps?.display"
      />

      <sa-table
        id="visibleTable"
        v-if="page.type === 'table'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure) as SaStructureType.TableV2[])"
        :request-api="query => getTableList((page.actionApi as string), query)"
        :exOptions="exOptionsComputed"
        class="flex1"
        :request-auto="!dialogConfig"
      >
        <template v-for="slotName in findSlotName(page.actionButtons)" :key="slotName" #[`${slotName}`]="{ row }">
          <template v-for="(item, index) in page.actionButtons" :key="'btn_' + index">
            <template v-if="item.useType == slotName">
              <template v-if="!item?.authorization?.length || visibleBefore?.(item)">
                <sa-button
                  v-if="item.styleType == 'Built'"
                  :is="item.is"
                  :text="item.isText"
                  @click="handleButtonSubmit(item, { row, page })"
                />
                <sa-button
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
      </sa-table>

      <sa-tabs id="visibleTabs" v-if="page.type === 'tabs'" align="edge">
        <sa-tabs-item
          v-for="tab in setStructure(page.structure) as any"
          :key="tab.prop"
          :label="tab.label as string"
          :name="tab.prop as string"
          :scroll="!!tab.scroll"
          :padding="tab.padding"
        >
          <sa-playground-visible
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
        </sa-tabs-item>
      </sa-tabs>
    </template>
  </template>

  <sa-dialog
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

      <sa-form
        id="visibleForm"
        v-if="page.type === 'form'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure)  as SaStructureType.FormV2[])"
        :exOptions="exOptionsComputed"
        :ex-span="page.otherProps?.exSpan"
        :display="page.otherProps?.display"
      />

      <sa-table
        id="visibleTable"
        v-if="page.type === 'table'"
        :ref="el => setRef(el, page)"
        :structure="(setStructure(page.structure) as SaStructureType.TableV2[])"
        :request-api="query => getTableList((page.actionApi as string), query)"
        :exOptions="exOptionsComputed"
        class="flex1"
        :request-auto="!dialogConfig"
      >
        <template v-for="slotName in findSlotName(page.actionButtons)" :key="slotName" #[`${slotName}`]="{ row }">
          <template v-for="(item, index) in page.actionButtons" :key="'btn_' + index">
            <template v-if="item.useType == slotName">
              <template v-if="!item?.authorization?.length || visibleBefore?.(item)">
                <sa-button
                  v-if="item.styleType == 'Built'"
                  :is="item.is"
                  :text="item.isText"
                  @click="handleButtonSubmit(item, { row, page })"
                />
                <sa-button
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
      </sa-table>

      <sa-tabs id="visibleTabs" v-if="page.type === 'tabs'" align="edge">
        <sa-tabs-item
          v-for="tab in setStructure(page.structure) as any"
          :key="tab.prop"
          :label="tab.label as string"
          :name="tab.prop as string"
          :scroll="!!tab.scroll"
          :padding="tab.padding"
        >
          <sa-playground-visible
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
        </sa-tabs-item>
      </sa-tabs>
    </template>

    <template #footer v-if="dialogConfig?.dialogContentButtons">
      <template v-for="item in dialogConfig?.dialogContentButtons" :key="'btn_' + item.text">
        <template v-if="!item?.authorization?.length || visibleBefore?.(item)">
          <sa-button v-if="item.styleType == 'Built'" :is="item.is" :text="item.isText" @click="handleButtonSubmit(item, {})" />
          <sa-button v-else :type="item.type" :iconName="item.icon" :text="item.text" @click="handleButtonSubmit(item, {})"
        /></template>
      </template>
    </template>
  </sa-dialog>

  <sa-playground-visible
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
import { ComputedRef, inject, nextTick, ref, useTemplateRef } from "vue";
import {
  MInterfaceConfig,
  SaPlaygroundType,
  SaPlaygroundPagesType,
  MStructureType,
  SaPlaygroundItem,
  MOptionsType,
  SaPlaygroundActionFunctionType
} from "./type";
import { M_Message, M_MessageBox } from "../feedback";
import SaPlaygroundVisible from "./sa-playground-visible.vue";
import useDictionariesAll from "../tools/dictionaries-all";
import { SaltedGlobalConfigType } from "../sa-content/type";
import { SaOptionType, SaStructureType } from "M_Types";
import { deleteDataByKey, getAllData, queryData, storeData, updateData } from "../indexDB/indexDB";
import { SaPlaygroundPageButtonType } from "./components/type";
import { dictType } from "../tools/type";
import _ from "lodash";

const { isNil } = _;
const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const language = SaltedGlobalConfig.value?.language?.value || "zh-CN";
const pageClickButtonConfig = ref<SaPlaygroundPageButtonType>();
const findNextPage = ref<boolean>(false);

const props = withDefaults(
  defineProps<{
    id?: string;
    baseConfig: SaPlaygroundType;
    playgroundItems: SaPlaygroundPagesType[];
    interfaceConfigs: MInterfaceConfig[];
    dataStructures: MStructureType[];
    exOptionsMaps: MOptionsType[];
    useMock: boolean;
    requestFunction?: any;
    actionFunction?: Array<SaOptionType.Select & SaPlaygroundActionFunctionType>;
    authorizationFunction?: Array<SaStructureType.TableV2>;
    actionBefore?: (data: any) => boolean;
    visibleBefore?: (data: any) => boolean;
    useToPage?: boolean;

    exTransmitData?: Record<string, any>;
    exHomeIndexConfig?: SaPlaygroundPagesType;
    exClickButtonConfig?: SaPlaygroundPageButtonType;
  }>(),
  { useMock: true, useToPage: false }
);

const exOptionsComputed = ref<SaOptionType.Default>({});

const emits = defineEmits(["closed", "action-before", "visible-before"]);

const setStructure = (
  structure: SaStructureType.FormV2[] | SaStructureType.TableV2[]
): SaStructureType.FormV2[] | SaStructureType.TableV2[] => {
  return structure.filter(item => (props.visibleBefore ? props.visibleBefore?.(item) : item)) as
    | SaStructureType.FormV2[]
    | SaStructureType.TableV2[];
};

const visible = ref(false);
const homeIndexConfig = ref<SaPlaygroundPagesType>();
const visibleDialogRef = useTemplateRef("visibleDialogRef");
const dialogConfig = ref<SaPlaygroundPageButtonType>();

const ItemRefs = ref<Record<string, { el: any; page: SaPlaygroundItem }>>({});
const setRef = (el: any, page: SaPlaygroundItem) => el && (ItemRefs.value[page.itemId] = { el, page });
const transmitData = ref<Record<string, any>>({});

function findSlotName(actionButtons) {
  const slotNameList: string[] = [];
  for (const item of actionButtons || []) {
    if (slotNameList.indexOf(item.useType) < 0) {
      slotNameList.push(item.useType);
    }
  }
  return slotNameList;
}

// @ description: 打开模拟字段可见性弹窗
function openVisibleDialog(_transmitData?: Record<string, any>, _homeIndexConfig?, _clickButtonConfig?) {
  if (Object.keys(_transmitData || {}).length > 0 || _homeIndexConfig) {
    transmitData.value = _transmitData || {};
    homeIndexConfig.value = _homeIndexConfig;
    dialogConfig.value = _clickButtonConfig;
    visible.value = true;
    setExOptionsMaps(_homeIndexConfig.value?.itemConfigs || []);
    nextTick(() => getDetailById());
    // if (id) nextTick(() => getDetailById(id, data));
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

// @ description: 设置模拟字段可见性选项
function setExOptionsMaps(itemConfigs: SaPlaygroundItem[]) {
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

function refreshData() {
  for (const key in ItemRefs.value) {
    if (ItemRefs.value[key].page.type == "table") {
      ItemRefs.value[key].el?.getTableList();
    }
  }
}

function handleClose() {
  if (pageClickButtonConfig.value && pageClickButtonConfig.value.refreshByDialogClose) refreshData();
}

// 按钮点击
async function handleButtonSubmit(item: SaPlaygroundPageButtonType, data: { row?: any; page?: SaPlaygroundItem }) {
  emits("action-before", { buttonInfo: item, data });

  // dialog
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
  }

  // save
  else if (item.actionType == "save") {
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
  }

  // delete
  else if (item.actionType == "delete") {
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
  }

  // actionFunction
  else if (props.actionFunction?.length) {
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

// @ 获取表格数据
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

// @ 获取 详情数据 存在id时调用
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

async function GetDetailByDBToId(findApi: MInterfaceConfig, query: Record<string, string>) {
  const DB_NAME = "DB_" + props.id;
  const STORE_NAME = "DB_" + props.id + "_API_" + findApi.dataStructure;
  const _data = await queryData(DB_NAME, STORE_NAME, query);
  const data = _data?.[0];
  return data.data;
}

// @ 保存数据到数据库
async function SaveDataToDB(findApi: MInterfaceConfig, formData: Record<string, string>, item: SaPlaygroundPageButtonType) {
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

// @ 删除数据到数据库
async function DeleteDataToDB(findApi: MInterfaceConfig, query: Record<string, string>, item: SaPlaygroundPageButtonType) {
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

defineExpose({
  openVisibleDialog
});
</script>

<style lang="scss" scoped></style>
