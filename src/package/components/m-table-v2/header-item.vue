<template>
  <div
    class="m-table-v2-cell_header flex-center-between"
    :class="[item.width && !setCellWidthIng ? '' : `find_cell_${item.prop}`]"
  >
    <span class="m-table-v2-cell_header-span">
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
    <div v-if="item.useSort != false" class="flex-center-between flex1 m-table-v2-sort-box">
      <div
        class="m-hand"
        :class="[
          props.useOrderPropName == item.prop && orderString != null
            ? 'flex-col light-table-order-box light-order-box-act'
            : 'flex-col light-table-order-box'
        ]"
        @click="handleTableOrder(item)"
      >
        <m-icon-v2
          :class="[
            props.useOrderPropName == item.prop && orderString == 'ascending'
              ? 'order-icon flex-center order-act'
              : 'order-icon flex-center'
          ]"
          name="up_small_fill"
        />
        <m-icon-v2
          :class="[
            props.useOrderPropName == item.prop && orderString == 'descending'
              ? 'order-icon flex-center order-act'
              : 'order-icon flex-center'
          ]"
          name="down_small"
        />
      </div>
    </div>

    <!-- @handle-remove-query="handleRemoveQuery" -->
    <Filter
      v-if="item.useFilter != false"
      :id="props.id"
      ref="columnFilter"
      :item="item"
      :data="filterValue"
      @open-senior-filter="openSeniorFilter"
      @save-and-filter="saveAndFilter"
    >
      <div class="m-table-v2-filter-box" :class="[setIconAction(item.prop) ? 'm-table-v2-filter-box-act' : '']">
        <m-icon-v2
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
        <div class="flex-center mt-size-v2">
          <m-button-v2 font="mortarboard_line" @click="openSeniorFilter(item)"
            >{{ languagePackage["useAdvancedSearch"] }}
          </m-button-v2>
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
import { MTableV2ItemType, MTableV2UseItemType, MTableV2UseType } from "./type";

type HeaderItemType = {
  id: string;
  item: MTableV2ItemType & MTableV2UseItemType;
  useOrderPropName: string;
  listeners: any;
  setCellWidthIng?: boolean;
  tableQuery: MTableV2UseType.TableQueryType;
};

// # Var
const props = withDefaults(defineProps<HeaderItemType>(), {});

const emits = defineEmits(["handleSortChange", "saveAndFilter", "openSeniorFilter"]);

const orderString: Ref<"ascending" | "descending" | null> = ref(null);
const filterValue = ref({} as MTableV2UseType.FilterType);
const columnFilter = ref();
let filterData = [] as Array<MTableV2UseType.FilterType>;
const languagePackage = inject("languagePackage") as Record<string, string>;
const useGlobalSeniorFilter = inject("useGlobalSeniorFilter") as Ref<boolean>;
// #Function 点击表格排序
function handleTableOrder(state: MTableV2ItemType & MTableV2UseItemType) {
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
// function handleRemoveQuery(scope) {
//   emits("handleRemoveQuery", scope, "column");
// }

// #Function 打开高级搜索
function openSeniorFilter(item: MTableV2ItemType & MTableV2UseItemType) {
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
  transition: var(--m-animation-time, 0.2s);

  .order-icon {
    display: flex !important;
    width: 18px;
    height: 7px;
    font-size: calc(var(--m-component-font-size, 13px) + 8px);
    color: var(--m-scrollbar-thumb-color);
  }
  .order-act {
    color: var(--m-color-primary);
  }
}
.light-order-box-act {
  // background-color: var(--m-color-primary-light-9);
}
.light-table-order-box {
  @extend %light-table-order-box;
}
.m-table-v2-filter-box {
  @extend %light-table-order-box;
  .filter-icon {
    display: flex !important;
    width: inherit;
    height: 100%;
    font-size: calc(var(--m-component-font-size, 13px) + 1px);
    color: var(--m-scrollbar-thumb-color);
  }

  .filter-act {
    color: var(--m-color-primary);
  }
}
.m-table-v2-filter-box-act {
  // background-color: var(--m-color-primary-light-9);
}
.m-table-v2-cell_header-span {
  overflow: hidden;
  color: var(--m-font-color);
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.6em;
  display: flex;
  align-items: center;
}
.m-table-v2-cell_header {
  width: 100%;
  height: 100%;
  &:hover {
    cursor: move;
  }
  .m-table-v2-sort-box {
    height: 100%;
    &:hover {
      cursor: move;
    }
  }
  .is_required {
    &::before {
      margin-right: 4px;
      color: var(--m-color-danger);
      content: "*";
    }
  }
}

.body_cell_text {
  width: 99.5% !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--m-component-font-size) !important;
  .body_cell_text-rel {
    display: inline;
  }
}
.body_cell_text-copy {
  &:hover {
    color: var(--m-color-primary);
    cursor: pointer;
  }
}
</style>
