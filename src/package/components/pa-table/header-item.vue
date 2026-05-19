<template>
  <div class="pa-table-cell_header flex-center-between" :class="[item.width && !setCellWidthIng ? '' : `find_cell_${item.prop}`]">
    <span class="pa-table-cell_header-span">
      <slot :name="item.prop + 'Header'">
        <span class="cell_text drag-el" :style="{ cursor: !item.fixed ? 'move' : 'default' }">
          <span :class="['find-class-' + item.prop, item?.cellConfig?.required && !item?.cellConfig?.display ? 'is_required' : '']">{{ item.label }}</span>
        </span>
      </slot>
      <span class="cell_text_after"></span>
    </span>

    <!-- 排序 -->
    <div v-if="item.useSort != false" class="flex-center-between flex1 pa-table-sort-box">
      <div
        class="m-hand"
        :class="[props.useOrderPropName == item.prop && orderString != null ? 'flex-col light-table-order-box light-order-box-act' : 'flex-col light-table-order-box']"
        @click="handleTableOrder(item)"
      >
        <pa-icon :class="[props.useOrderPropName == item.prop && orderString == 'ascending' ? 'order-icon flex-center order-act' : 'order-icon flex-center']" name="up_small_fill" />
        <pa-icon :class="[props.useOrderPropName == item.prop && orderString == 'descending' ? 'order-icon flex-center order-act' : 'order-icon flex-center']" name="down_small" />
      </div>
    </div>

    <!-- @handle-remove-query="handleRemoveQ" -->
    <Filter v-if="item.useFilter != false" :id="props.id" ref="columnFilter" :item="item" :data="filterValue" @open-senior-filter="openSeniorFilter" @save-and-filter="saveAndFilter">
      <div class="pa-table-filter-box" :class="[setIconAction(item.prop) ? 'pa-table-filter-box-act' : '']">
        <pa-icon :class="[setIconAction(item.prop) ? 'filter-icon flex-center filter-act' : 'filter-icon flex-center']" name="Filter" />
      </div>
      <template v-for="slot in Object.keys($slots).filter(item => item != 'default')" #[slot]="scope">
        <template v-if="slot.indexOf('header-option-') > -1 || slot.indexOf('header-tag-') > -1">
          <slot :name="slot" :row="scope"></slot>
        </template>
      </template>

      <template #exBtn v-if="isUseCellConfig(item) && item.useSeniorFilter != false && useGlobalSeniorFilter">
        <div class="flex-center mt-size">
          <pa-button font="mortarboard_line" @click="openSeniorFilter(item)">{{ languagePackage["useAdvancedSearch"] }} </pa-button>
        </div>
      </template>
    </Filter>
  </div>
</template>

<script setup lang="ts" name="headerItem">
/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { ref, Ref, watch, inject } from "vue";
/**
 * 模块导入
 * @description 导入表头筛选子组件
 */
import Filter from "./header-item-filter.vue";
/**
 * 模块导入
 * @description 导入类型判断工具
 */
import { isSelectType, isUseCellConfig, isTimeType } from "./hooks/isType";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentItemProps, ComponentUseItemProps, PaTableUseType } from "./types";

/**
 * 表头组件属性类型
 */
type HeaderItemType = {
  id: string;
  item: ComponentItemProps & ComponentUseItemProps;
  useOrderPropName: string;
  listeners: any;
  setCellWidthIng?: boolean;
  tableQuery: PaTableUseType.TableQueryType;
};
/**
 * 组件属性
 * @type HeaderItemType
 * @description 表头组件的属性对象
 */
const props = withDefaults(defineProps<HeaderItemType>(), {});
/**
 * 组件事件
 * @description 表头组件的事件定义
 */
const emits = defineEmits(["handleSortChange", "saveAndFilter", "openSeniorFilter"]);
/**
 * 排序方向
 * @type Ref
 * @description 当前列的排序方向
 */
const orderString: Ref<"ascending" | "descending" | null> = ref(null);
/**
 * 筛选值
 * @type Ref<PaTableUseType.FilterType>
 * @description 当前列的筛选条件
 */
const filterValue = ref({} as PaTableUseType.FilterType);
/**
 * 列筛选组件引用
 * @type Ref
 * @description 列筛选弹出框组件引用
 */
const columnFilter = ref();
/**
 * 筛选数据存储
 * @description 缓存筛选数据列表
 */
let filterData = [] as Array<PaTableUseType.FilterType>;
/**
 * 语言包
 * @type Record<string, string>
 * @description 注入当前语言包
 */
const languagePackage = inject("languagePackage") as Record<string, string>;
/**
 * 全局高级搜索
 * @type Ref<boolean>
 * @description 注入是否启用全局高级搜索
 */
const useGlobalSeniorFilter = inject("useGlobalSeniorFilter") as Ref<boolean>;
/**
 * 点击表格排序
 * @param state - 列配置对象
 * @description 切换当前列的排序状态并触发排序事件
 */
function handleTableOrder(state: ComponentItemProps & ComponentUseItemProps) {
  switch (orderString.value) {
    case null:
      orderString.value = "ascending";
      break;
    case "ascending":
      orderString.value = "descending";
      break;
    default:
      orderString.value = null;
      break;
  }
  const upData = { prop: state.prop, order: orderString.value };
  emits("handleSortChange", upData);
}
/**
 * 设置筛选图标状态
 * @param prop - 列标识
 * @returns 是否激活筛选状态
 * @description 根据查询参数判断筛选图标是否高亮
 */
function setIconAction(prop) {
  const { AdvancedFilter } = props.tableQuery;
  let index = -1;
  const _index = AdvancedFilter && AdvancedFilter.findIndex(item => item.fieldName == prop);
  index = _index != undefined ? _index : -1;
  if (index > -1) {
    return true;
  } else {
    return filterValue.value?.fieldName == prop && String(filterValue.value.fieldValue)?.length;
  }
}
/**
 * 打开高级搜索
 * @param item - 列配置对象
 * @description 打开当前列的高级搜索弹窗
 */
function openSeniorFilter(item: ComponentItemProps & ComponentUseItemProps) {
  columnFilter.value?.closePopover();
  emits("openSeniorFilter", item);
}
/**
 * 提交筛选
 * @param data - 筛选数据
 * @description 提交当前列的筛选条件
 */
function saveAndFilter(data) {
  const prop = props.item.prop;
  let _filterData = filterData?.filter(item => item.fieldName != prop);
  _filterData = [..._filterData, ...data];
  emits("saveAndFilter", { Filter: _filterData });
}
/**
 * 监听排序名称变化
 * @description 当其他列排序时重置当前列排序状态
 */
watch(
  () => props.useOrderPropName,
  (value: string) => {
    if (props.item.prop != value && orderString.value != null) orderString.value = null;
  },
  { immediate: true }
);
/**
 * 监听筛选条件变化
 * @description 同步外部筛选条件到当前列的状态
 */
watch(
  () => props.tableQuery.Filter,
  value => {
    if (!value) return;
    filterData = value;
    const prop = props.item.prop;
    if (isTimeType(props.item, true)) {
      const findItemArr = value?.filter(item => item.fieldName == prop);
      const arr = [] as string[];
      for (let index = 0; index < findItemArr.length; index++) {
        const item = findItemArr[index];
        const fieldValue = item.fieldValue as string;
        arr[item.conditionalType == 3 ? 0 : 1] = fieldValue?.split?.(" ")[0] || "";
      }
      filterValue.value = { ...findItemArr[0], fieldValue: arr };
    } else {
      const findItem = value?.find(item => item.fieldName == prop);
      if (findItem && findItem.fieldValue && String(findItem.fieldValue)?.length) {
        const fieldValue = findItem.fieldValue as string;
        filterValue.value = {
          ...findItem,
          fieldValue: isSelectType(props.item, true) ? fieldValue.split(",") : fieldValue
        };
      } else {
        filterValue.value = {};
      }
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
%light-table-order-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 100%;
  padding: 2px 0;
  transition: var(--pa-animation-time, 0.2s);

  .order-icon {
    display: flex !important;
    width: 18px;
    height: 7px;
    font-size: calc(var(--pa-size-font, 16px) + 8px);
    color: var(--pa-color-hover);
  }
  .order-act {
    color: var(--pa-color-primary);
  }
}
.light-order-box-act {
  // background-color: var(--pa-color-primary-light-9);
}
.light-table-order-box {
  @extend %light-table-order-box;
}
.pa-table-filter-box {
  @extend %light-table-order-box;
  .filter-icon {
    display: flex !important;
    width: inherit;
    height: 100%;
    font-size: calc(var(--pa-size-font, 16px) + 1px);
    color: var(--pa-color-hover);
  }

  .filter-act {
    color: var(--pa-color-primary);
  }
}
.pa-table-filter-box-act {
  // background-color: var(--pa-color-primary-light-9);
}
.pa-table-cell_header-span {
  overflow: hidden;
  color: var(--pa-color-font);
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.6em;
  display: flex;
  align-items: center;
}
.pa-table-cell_header {
  width: 100%;
  height: 100%;
  &:hover {
    cursor: move;
  }
  .pa-table-sort-box {
    height: 100%;
    &:hover {
      cursor: move;
    }
  }
  .is_required {
    &::before {
      margin-right: 4px;
      color: var(--pa-color-danger);
      content: "*";
    }
  }
}

.body_cell_text {
  width: 99.5% !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--pa-size-font) !important;
  .body_cell_text-rel {
    display: inline;
  }
}
.body_cell_text-copy {
  &:hover {
    color: var(--pa-color-primary);
    cursor: pointer;
  }
}
</style>
