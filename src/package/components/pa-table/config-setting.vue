<template>
  <!-- 表配置 -->
  <pa-drawer :title="languagePackage?.['colSetting'] || ''" v-model="drawerVisible" @closed="handleCloseDrawer" width="680px">
    <section :id="'table-col-' + id" class="p-all-size" style="height: calc(100% - var(--pa-size-padding, 10px) * 2)">
      <pa-table
        :id="id + '-table-col-setting'"
        ref="SettingTableRef"
        :structure="tableConfig"
        :request-api="getTableList"
        :ex-options="exOptions"
        :usePagination="false"
        :useTableIndex="false"
        :useToolButton="false"
      >
        <template #searchCriteria="scope">
          <!-- 筛选 -->
          <pa-select
            v-if="isSelectType(scope.row, display)"
            v-model="scope.row.searchCriteria"
            type="multiple-select"
            :exOptions="_exOptions[scope.row.prop] as PaOptionType.SelectList"
            :placeholder="languagePackage?.['selectPlaceholder']"
          ></pa-select>

          <div v-else-if="isTimeType(scope.row, display)" class="flex-center">
            <pa-time
              v-model="scope.row.searchCriteria[0]"
              type="date-picker"
              :placeholder="languagePackage['startTime']"
              :disabledDateFn="time => disabledStart(time)"
              teleport-in-container
            />
            <div class="ml5 mr5">/</div>
            <pa-time
              v-model="scope.row.searchCriteria[1]"
              type="date-picker"
              :placeholder="languagePackage['endTime']"
              :disabledDateFn="time => disabledEnd(time)"
              teleport-in-container
            />
          </div>

          <!-- 数字/文本 -->
          <template v-else-if="isNumberType(scope.row, display) || isTextType(scope.row, display)">
            <pa-number
              v-if="isNumberType(scope.row, display)"
              v-model="scope.row.searchCriteria"
              :placeholder="scope.row?.cellConfig.placeholder"
              :disabled="scope.row?.cellConfig.disabled"
              :min="scope.row?.cellConfig.min"
              :max="scope.row?.cellConfig.max"
              :precision="scope.row?.cellConfig.precision"
              :step="scope.row?.cellConfig.step"
            ></pa-number>
            <template v-else>
              <pa-input v-model="scope.row.searchCriteria" :placeholder="languagePackage?.['inputPlaceholder']" />
              <!-- !scope.row.useSenior -->
              <pa-button v-if="false" style="width: 100%" is="edit" @click="openSeniorFilter(scope.row)">
                {{ languagePackage?.["editAdvancedSearch"] }}
              </pa-button>
            </template>
          </template>

          <template v-else> {{ languagePackage?.["noFilter"] }} </template>
        </template>

        <!-- 固定 -->
        <template #fixed="scope">
          <div
            :class="['change_btn', scope.row.fixed == undefined ? '' : 'icon_highlight']"
            @click="changeFixed(scope.row)"
            :title="languagePackage?.['clickChangeFixedState']"
          >
            <pa-icon name="pin_line" :class="['mr5']" />
            <span>{{ setFixed(scope.row) }}</span>
          </div></template
        >

        <!-- 显示状态 -->
        <template #isShow="scope">
          <div
            :class="['change_btn', scope.row.isShow ? '' : 'icon_highlight--hide']"
            @click="setView(scope.row)"
            :title="languagePackage?.['clickChangeVisibleState']"
          >
            <pa-icon class="mr5" :name="scope.row.isShow ? 'eye_line' : 'eye_close_line'"></pa-icon>
            <span>{{ scope.row.isShow ? languagePackage?.["visible"] : languagePackage?.["hide"] }}</span>
          </div>
        </template>
      </pa-table>
    </section>
    <template #footer>
      <div class="flex-center">
        <pa-button plain type="primary" font="save_line" @click="FetchSaveAndFilter">
          {{ languagePackage?.["save"] }}
        </pa-button>
      </div>
    </template>
  </pa-drawer>
</template>

<script setup lang="ts" name="ColSetting">
// # Import
import { ref, computed, inject, nextTick, ComputedRef } from "vue";
import { isSelectType, isTimeType, isTextType, isNumberType } from "./hooks/isType";

import { ComponentUseItemProps, PaTableUseType } from "./types";
import { convertValue } from "../pa-time/utils";
import { PaOptionType, PaStructureType } from "../manager-type";
import { M_Message } from "../feedback";

type SettingPropsType = {
  id: string;
  tableStructure: Array<ComponentUseItemProps>;
  display?: boolean;
  tableQuery: PaTableUseType.TableQueryType;
};

// # Var
const injectSetTableConfig = inject("setTableConfig") as (config: Array<ComponentUseItemProps>) => void;
const injectGetTableList = inject("getTableList") as (
  exQuery?: PaTableUseType.TableQueryType,
  _Observer?: {
    createObserver?: () => void;
    closeObserver?: () => void;
  }
) => Promise<void>;

//  inject
const injectCleanTableData = inject("cleanTableData") as () => void;
const languagePackage = inject("languagePackage") as Record<string, string>;

const exOptions = inject("exOptions") as PaOptionType.Default;

const SettingTableRef = ref();
const drawerVisible = ref<boolean>(false);
const emit = defineEmits(["saveAndFilter", "closeDrawer", "openSeniorFilter", "handleChangeDragEl", "handleChangeDragSort"]);
const props = withDefaults(defineProps<SettingPropsType>(), {});

const settingColumnsData = computed(() => {
  const arr = props.tableStructure.filter(
    item => item.type != "index" && item.type != "selection" && item.type != "row" && item.prop != "operation"
  );
  const dataObject: any = {};
  props.tableQuery.Filter &&
    props.tableQuery.Filter.forEach(item => {
      if (item.fieldName) {
        if (item.conditionalType == 6) {
          const value = item.fieldValue as string;
          dataObject[item.fieldName] = value?.split(",");
        }
        if (item.conditionalType == 3 || item.conditionalType == 5) {
          if (!dataObject[item.fieldName]) dataObject[item.fieldName] = [] as string[];
          if (item.conditionalType == 3) dataObject[item.fieldName][0] = item.fieldValue as string;
          if (item.conditionalType == 5) dataObject[item.fieldName][1] = item.fieldValue as string;
        } else {
          dataObject[item.fieldName] = item.fieldValue;
        }
      }
    });
  arr.forEach(item => {
    item.isShow = item.isShow != false;
    if (item.prop) {
      item.searchCriteria = dataObject[item.prop];
      if (isTimeType(item, true)) {
        if (!dataObject[item.prop]) {
          item.searchCriteria = [];
        } else {
          item.searchCriteria = dataObject[item.prop]?.map(item => convertValue(item.type, item)) || [];
        }
      }
    }
  });
  return arr;
});

const tableConfig: PaStructureType.TableV2[] = [
  { label: "列名", prop: "label", useFilter: false, useSort: false },
  { label: "筛选", prop: "searchCriteria", width: 210, useFilter: false, useSort: false },
  { label: "固定", prop: "fixed", width: 100, useFilter: false, useSort: false },
  { label: "显示状态", prop: "isShow", width: 100, useFilter: false, useSort: false }
];

async function getTableList() {
  return { Data: settingColumnsData.value, Code: 200 };
}

// const shortcuts = [
//   {
//     text: languagePackage.value?.["today"],
//     value: new Date()
//   },
//   {
//     text: languagePackage.value?.["yesterday"],
//     value: () => {
//       const date = new Date();
//       date.setTime(date.getTime() - 3600 * 1000 * 24);
//       return date;
//     }
//   },
//   {
//     text: languagePackage.value?.["aWeekAgo"],
//     value: () => {
//       const date = new Date();
//       date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
//       return date;
//     }
//   }
// ];

// #Computed
const _exOptions: ComputedRef<PaOptionType.Default> = computed(() => {
  const _outData: PaOptionType.Default = {};
  for (const key in exOptions.value) {
    if (Array.isArray(exOptions.value[key])) {
      _outData[key] = exOptions.value[key].map(item => {
        return {
          ...item,
          value: String(item.value)
        };
      });
    } else {
      const item = exOptions.value[key];
      _outData[key] = [];
      _outData[key].push({
        label: item.activeText || "on",
        value: item.activeValue || "true"
      });
      _outData[key].push({
        label: item.inActiveText || "off",
        value: item.inActiveValue || "false"
      });
    }
  }
  return _outData;
});

// #Function 配置初始化开始时间
function disabledStart(time: Date) {
  return time > new Date();
}

// #Function 配置初始化结束时间
function disabledEnd(time: Date) {
  return time < new Date();
}

// #Function Dialog关闭
function handleCloseDrawer() {
  emit("handleChangeDragEl", "table");
  emit("closeDrawer", { Col: settingColumnsData.value });
}

// #Function 保存并搜索
async function FetchSaveAndFilter() {
  const array = await SettingTableRef.value.getTableData();

  const Filter: { fieldLabel?: string; fieldName: string; conditionalType: 0 | 1 | 3 | 5 | 6; fieldValue: string }[] = [];
  for (let index = 0; index < array.length; index++) {
    const element: ComponentUseItemProps = array[index];
    if (element.isShow && isTimeType(element, true) && element.prop && element.searchCriteria && !!element.searchCriteria[0]) {
      Filter.push({
        fieldLabel: element.label + `-${languagePackage.value?.["start"]}`,
        fieldName: element.prop,
        conditionalType: 3,
        fieldValue: element.searchCriteria[0] + " 00:00:00"
      });
    }
    if (element.isShow && isTimeType(element, true) && element.prop && element.searchCriteria && !!element.searchCriteria[1]) {
      Filter.push({
        fieldLabel: element.label + `-${languagePackage.value?.["end"]}`,
        fieldName: element.prop,
        conditionalType: 5,
        fieldValue: element.searchCriteria[1] + " 23:59:59"
      });
    }

    if (
      element.isShow &&
      element?.filterType == "time" &&
      element.searchCriteria &&
      element.searchCriteria[0] &&
      element.searchCriteria[1] &&
      element.searchCriteria[0] > element.searchCriteria[1]
    ) {
      return M_Message.danger(element.label + ` ${languagePackage.value?.["errorMessage"]}`);
    }

    if (!isTimeType(element, true)) {
      const fieldValue = Array.isArray(element.searchCriteria)
        ? element.searchCriteria?.join?.(",")
        : isNumberType(element, true)
        ? element.searchCriteria
        : element.searchCriteria
        ? String(element.searchCriteria)?.trim?.()
        : "";

      if (element.isShow != false && element.prop && !!fieldValue) {
        Filter.push({
          fieldLabel: element.label,
          fieldName: element.prop,
          conditionalType: isSelectType(element, true) ? 6 : isNumberType(element, true) ? 0 : 1,
          fieldValue
        });
      }
    }
  }

  const useOperation = props.tableStructure?.find?.(item => item.prop == "operation") as ComponentUseItemProps;
  if (useOperation) {
    delete useOperation?.cellConfig;
    delete useOperation?.filterType;
    array.push(useOperation);
  }

  const newArray = array.map(item => {
    // delete item?.minWidth;
    // delete item?.width;
    // delete item?.fixedValue;
    return { ...item };
  });
  typeof window !== "undefined" && window.developLog.json({ Filter }, "保存并搜索", "info");

  injectCleanTableData();
  injectSetTableConfig(newArray);
  nextTick(() => {
    injectGetTableList({ Filter });
  });
  drawerVisible.value = false;
  // emit("saveAndFilter", { Filter, Col: settingColumnsData.value });
  // changeColSetting(false);
}

// #Function 设置固定状态显示值
function setFixed(row: { fixed: "left" | "right" | undefined }) {
  let text = languagePackage.value?.["fixedNone"];
  switch (row.fixed) {
    case "left":
      text = languagePackage.value?.["fixedLeft"];
      break;
    case "right":
      text = languagePackage.value?.["fixedRight"];
      break;
  }
  return text;
}

// #Function 设置固定状态
function changeFixed(row: { fixed: "left" | "right" | undefined }) {
  row.fixed = row.fixed == "left" ? "right" : row.fixed == "right" ? undefined : "left";
}

// #Function 设置是否显示
function setView(row: { isShow: boolean }) {
  row.isShow = !row.isShow;
}

// #Function 打开高级搜索
function openSeniorFilter(item: Record<string, string>) {
  emit("openSeniorFilter", item);
}

// # Expose 打开表配置
function changeColSetting(value: boolean) {
  emit("handleChangeDragEl", "col");
  drawerVisible.value = value;
}

defineExpose({
  changeColSetting
});
</script>

<style scoped lang="scss">
.empty-icon {
  font-size: 30px;
}
.cursor-move {
  cursor: move;
}
.change_btn {
  cursor: pointer;
  width: max-content;
  &:hover {
    font-weight: bold;
    color: var(--pa-color-primary);
    cursor: pointer;
  }
}
.icon_highlight {
  font-weight: bold;
  color: var(--pa-color-primary);
}
.icon_highlight--show {
  color: var(--pa-color-primary);
}
.icon_highlight--hide {
  color: var(--pa-color-warning);
}
</style>

<style lang="scss"></style>
