<template>
  <div class="pa-table-cell_header flex-center-between" :class="[item.width && !setCellWidthIng ? '' : `find_cell_${item.prop}`]">
    <span class="pa-table-cell_header-span">
      <slot :name="item.prop + 'Header'">
        <span class="cell_text drag-el" :style="{ cursor: !item.fixed ? 'move' : 'default' }">
          <span
            :class="['find-class-' + item.prop, item?.cellConfig?.required && !item?.cellConfig?.display ? 'is_required' : '']"
            >{{ item.label }}</span
          >
        </span>
      </slot>
      <span class="cell_text_after"></span>
    </span>

    <!-- 排序 -->
    <div v-if="item.useSort != false" class="flex-center-between flex1 pa-table-sort-box">
      <div
        class="m-hand"
        :class="[
          props.useOrderPropName == item.prop && orderString != null
            ? 'flex-col light-table-order-box light-order-box-act'
            : 'flex-col light-table-order-box'
        ]"
        @click="handleTableOrder(item)"
      >
        <pa-icon
          :class="[
            props.useOrderPropName == item.prop && orderString == 'ascending'
              ? 'order-icon flex-center order-act'
              : 'order-icon flex-center'
          ]"
          name="up_small_fill"
        />
        <pa-icon
          :class="[
            props.useOrderPropName == item.prop && orderString == 'descending'
              ? 'order-icon flex-center order-act'
              : 'order-icon flex-center'
          ]"
          name="down_small"
        />
      </div>
    </div>

    <!-- @handle-remove-query="handleRemoveQ" -->
    <Filter
      v-if="item.useFilter != false"
      :id="props.id"
      ref="columnFilter"
      :item="item"
      :data="filterValue"
      @open-senior-filter="openSeniorFilter"
      @save-and-filter="saveAndFilter"
    >
      <div class="pa-table-filter-box" :class="[setIconAction(item.prop) ? 'pa-table-filter-box-act' : '']">
        <pa-icon
          :class="[setIconAction(item.prop) ? 'filter-icon flex-center filter-act' : 'filter-icon flex-center']"
          name="filter"
        />
      </div>
      <template v-for="slot in Object.keys($slots).filter(item => item != 'default')" #[slot]="scope">
        <template v-if="slot.indexOf('header-option-') > -1 || slot.indexOf('header-tag-') > -1">
          <slot :name="slot" :row="scope"></slot>
        </template>
      </template>

      <template #exBtn v-if="isUseCellConfig(item) && item.useSeniorFilter != false && useGlobalSeniorFilter">
        <div class="flex-center mt-size">
          <pa-button font="mortarboard_line" @click="openSeniorFilter(item)"
            >{{ languagePackage["useAdvancedSearch"] }}
          </pa-button>
        </div>
      </template>
    </Filter>
  </div>
</template>

<script setup lang="ts" name="headerItem">
// # Import
import { ref, Ref, watch, inject } from "vue";
import Filter from "./header-item-filter.vue";

import { isSelectType, isUseCellConfig, isTimeType } from "./hooks/isType";
import { ComponentItemProps, ComponentUseItemProps, PaTableUseType } from "./types";

type HeaderItemType = {
  id: string;
  item: ComponentItemProps & ComponentUseItemProps;
  useOrderPropName: string;
  listeners: any;
  setCellWidthIng?: boolean;
  tableQuery: PaTableUseType.TableQueryType;
};

// # Var
const props = withDefaults(defineProps<HeaderItemType>(), {});

const emits = defineEmits(["handleSortChange", "saveAndFilter", "openSeniorFilter"]);

const orderString: Ref<"ascending" | "descending" | null> = ref(null);
const filterValue = ref({} as PaTableUseType.FilterType);
const columnFilter = ref();
let filterData = [] as Array<PaTableUseType.FilterType>;
const languagePackage = inject("languagePackage") as Record<string, string>;
const useGlobalSeniorFilter = inject("useGlobalSeniorFilter") as Ref<boolean>;
// #Function 点击表格排序
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

// #Function 设置筛选打开icon的颜色状态
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

// #Function 删除筛选框数据时,同步删除相关数据
// function handleRemoveQ(scope) {
//   emits("handleRemoveQ", scope, "column");
// }

// #Function 打开高级搜索
function openSeniorFilter(item: ComponentItemProps & ComponentUseItemProps) {
  columnFilter.value?.closePopover();
  emits("openSeniorFilter", item);
}

// #Function 提交筛选
function saveAndFilter(data) {
  const prop = props.item.prop;
  let _filterData = filterData?.filter(item => item.fieldName != prop);
  _filterData = [..._filterData, ...data];
  emits("saveAndFilter", { Filter: _filterData });
}

// #Watch 排序
watch(
  () => props.useOrderPropName,
  (value: string) => {
    if (props.item.prop != value && orderString.value != null) orderString.value = null;
  },
  { immediate: true }
);

// #Watch Filter值
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
      filterValue.value = {
        ...findItemArr[0],
        fieldValue: arr
      };
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
