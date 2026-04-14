<template>
  <template v-for="(item, columnIndex) in structure" :key="item.prop">
    <template v-if="item.isShow !== false">
      <div
        class="table_body_label"
        :class="[
          isRowIndex(item) ? 'table_body_label_index' : '',
          item.fixed == 'left'
            ? 'sticky-left border-right'
            : item.fixed == 'right'
            ? 'sticky-right border-right'
            : 'border-right',
          (!item.width && !setCellWidthIng) || (useAverageWidth == 1 && !item.baseWidth && item.prop != 'operation')
            ? 'table_body_label_flex'
            : '',
          item.lastLeftFixed ? 'last-left-fixed' : '',
          item.lastRightFixed ? 'last-right-fixed' : '',
          shouldHighlightRow ? 'highlight-row' : '',
          hoveredColumnIndex === columnIndex ? 'highlight-column' : ''
        ]"
        :style="{
          '--m-table-sticky': item.fixedValue,
          '--m-table-sticky-index': item.fixedValueIndex,
          '--m-table-item-width': item.width,
          '--m-table-item-min-width': item.minWidth
        }"
        @mouseenter="handleCellMouseEnter(props.rowIndex, columnIndex)"
        @mouseleave="handleCellMouseLeave"
      >
        <div
          :class="[item.width && !setCellWidthIng ? 'table_body_label_content' : `find_cell_${item.prop || item.type}`]"
          :style="{
            justifyContent: isRowIndex(item) ? 'center' : 'flex-start'
          }"
        >
          <!-- index -->
          <template v-if="item.type == 'index'"> {{ row.rowIndex }} </template>

          <!-- selection -->
          <template v-else-if="item.type == 'selection'">
            <m-checkbox-v2-item
              v-if="!(showSelectList && useChildren)"
              :is-checked="row.isSelected || isTableSelectAll"
              :is-indeterminate="row.isIndeterminate"
              :disabled="isTableSelectAll"
              @change="handleSelectChange({ row, parentRow })"
            />
          </template>

          <!-- radio -->
          <template v-else-if="item.type == 'radio'">
            <m-radio-v2-item
              v-if="!(showSelectList && useChildren)"
              :is-checked="row.isSelected || isTableSelectAll"
              :is-indeterminate="row.isIndeterminate"
              :disabled="isTableSelectAll"
              @change="handleSelectChange({ row, parentRow })"
            />
          </template>

          <!-- row -->
          <template v-else-if="item.type == 'row'">
            <div class="flex-center m-hand" style="width: 100%; height: 100%">
              <m-icon-v2
                v-if="(!parentRow && row?.children?.length) || props.useExpand"
                name="right_line"
                style="font-size: 18px; transition: var(--m-animation-time, 0.2s)"
                :style="{ transform: row.isOpenChild ? 'rotate(90deg)' : 'rotate(0deg)' }"
                @click="emits('changeRowStatus', { item, row })"
              />
            </div>
          </template>

          <!-- slot -->
          <template v-else-if="item.prop != 'operation' && $slots[String(item.prop)]">
            <slot :name="String(item.prop)" :row="row" :index="rowIndex"></slot>
          </template>

          <!-- operation -->
          <Operation v-else-if="item.prop == 'operation'" :row="row" :column="{ ...item }">
            <template #operation>
              <slot name="operation" :row="row" :index="row.rowIndex"></slot>
            </template>
          </Operation>

          <template v-else-if="item.cellConfig">
            <div
              v-if="item.cellConfig.display && item?.cellConfig.type != 'file'"
              :key="'cellConfig-' + item.prop + '-' + row.rowIndex"
              :style="{ whiteSpace: setCellWidthIng ? 'nowrap' : 'wrap' }"
            >
              {{ setCellDisplayValue(row, String(item.prop), item.cellConfig) || "--" }}
            </div>

            <cell-tag
              v-else-if="item?.cellConfig.type == 'tag'"
              :value="row[String(item.prop)]"
              :row="row"
              :clickTag="exCellDependent?.tag_click?.[String(item.prop)]"
              :disabled="exCellDependent?.tag_disabled?.[String(item.prop)]?.({ value: row[String(item.prop)] })"
              :exOptions="exOptions[String(item.prop)] as MOptionV2Type.SelectList || item.cellConfig.exOptions"
            />

            <!-- number -->
            <m-number-v2
              v-else-if="item.cellConfig.type == 'number'"
              v-model="row[String(item.prop)]"
              :placeholder="item.cellConfig.placeholder || languagePackage?.['input'] + item.label"
              :disabled="item.cellConfig.disabled"
              :display="item.cellConfig.display"
              :min="item.cellConfig.min"
              :max="item.cellConfig.max"
              :precision="item.cellConfig.precision"
              :controls="item.cellConfig.controls"
              :step="item.cellConfig.step"
              :unit="item.cellConfig.unit"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            />

            <!-- select -->
            <m-select-v2
              v-else-if="
                item.cellConfig.type == 'select' ||
                item.cellConfig.type == 'multiple-select' ||
                item.cellConfig.type == 'request-select' ||
                item.cellConfig.type == 'multiple-request-select' ||
                item.cellConfig.type == 'online-select' ||
                item.cellConfig.type == 'multiple-online-select'
              "
              v-model="row[String(item.prop)]"
              :type="item.cellConfig.type"
              :displayValue="item.cellConfig.displayValue ? row[item.cellConfig.displayValue] : undefined"
              :exOptions="exOptions[String(item.prop)] as MOptionV2Type.SelectList || item.cellConfig.exOptions"
              :requestApi="exCellDependent?.select_RequestApi?.[String(item.prop)]"
              :optionKey="item.cellConfig.optionKey"
              :placeholder="item.cellConfig.placeholder || languagePackage?.['select'] + item.label"
              :disabled="item.cellConfig.disabled"
              :display="item.cellConfig.display"
              :clearable="item.cellConfig.clearable"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            >
              <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                <slot :name="slot" v-bind="scope"></slot>
              </template>
            </m-select-v2>

            <!-- switch -->
            <m-switch-v2
              v-else-if="item.cellConfig.type == 'switch'"
              v-model="row[String(item.prop)]"
              :disabled="item.cellConfig.disabled"
              :exOptions="exOptions[String(item.prop)] as MOptionV2Type.Switch || item.cellConfig.exOptions"
              :display="item.cellConfig.display"
              :activeValue="item.cellConfig.activeValue"
              :inActiveValue="item.cellConfig.inActiveValue"
              :activeText="item.cellConfig.activeText"
              :inActiveText="item.cellConfig.inActiveText"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            ></m-switch-v2>

            <!-- radio -->
            <m-radio-v2
              v-else-if="item.cellConfig.type == 'radio'"
              v-model="row[String(item.prop)]"
              :disabled="item.cellConfig.disabled"
              :exOptions="exOptions[String(item.prop)] as MOptionV2Type.SelectList || item.cellConfig.exOptions"
              :display="item.cellConfig.display"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            >
            </m-radio-v2>

            <!-- checkbox -->
            <m-checkbox-v2
              v-else-if="item.cellConfig.type == 'checkbox'"
              v-model="row[String(item.prop)]"
              :disabled="item.cellConfig.disabled"
              :exOptions="exOptions[String(item.prop)] as MOptionV2Type.SelectList || item.cellConfig.exOptions"
              :display="item.cellConfig.display"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            >
            </m-checkbox-v2>

            <!-- cascader -->
            <m-cascader-v2
              v-else-if="
                item.cellConfig.type == 'cascader' ||
                item.cellConfig.type == 'cascader-check' ||
                item.cellConfig.type == 'multiple-cascader' ||
                item.cellConfig.type == 'multiple-cascader-check'
              "
              v-model="row[String(item.prop)]"
              :type="item.cellConfig.type"
              :displayValue="item.cellConfig.displayValue ? row[item.cellConfig.displayValue] : undefined"
              :exOptions="exOptions[String(item.prop)] as MOptionV2Type.SelectList|| item.cellConfig.exOptions"
              :placeholder="item.cellConfig.placeholder || languagePackage?.['select'] + item.label"
              :disabled="item.cellConfig.disabled"
              :display="item.cellConfig.display"
              :useSingleValue="item.cellConfig.useSingleValue"
              :useSingleText="item.cellConfig.useSingleText"
              :clearable="item.cellConfig.clearable"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            >
            </m-cascader-v2>

            <m-time-v2
              v-else-if="
                item.cellConfig.type == 'date-picker-group' ||
                item.cellConfig.type == 'date-picker' ||
                item.cellConfig.type == 'date-time-picker' ||
                item.cellConfig.type == 'date-time-picker-group' ||
                item.cellConfig.type == 'month-picker-group' ||
                item.cellConfig.type == 'month-picker' ||
                item.cellConfig.type == 'time-picker-group' ||
                item.cellConfig.type == 'time-picker' ||
                item.cellConfig.type == 'year-picker-group' ||
                item.cellConfig.type == 'year-picker'
              "
              v-model="row[String(item.prop)]"
              :type="item.cellConfig.type"
              :placeholder="item.cellConfig.placeholder || languagePackage?.['select'] + item.label"
              :disabledDateFn="exCellDependent?.time_disabledDateFn?.[String(item.prop)] || item.cellConfig.disabledDateFn"
              :shortcuts="exCellDependent?.time_shortcuts?.[String(item.prop)] || item.cellConfig.shortcuts"
              :disabled="item.cellConfig.disabled"
              :display="item.cellConfig.display"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            />

            <m-select-icon-v2
              v-else-if="item?.cellConfig.type == 'select-icon'"
              v-model="row[String(item.prop)]"
              :placeholder="item.cellConfig.placeholder || languagePackage?.['select'] + item.label"
              :disabled="item.cellConfig.disabled"
              :display="item.cellConfig.display"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            />

            <m-file-v2
              v-else-if="item?.cellConfig.type == 'file'"
              v-model="row[String(item.prop)]"
              :placeholder="item.cellConfig.placeholder || languagePackage?.['select'] + item.label"
              :attachedData="item.cellConfig.attachedData || exCellDependent?.file_attachedData?.[String(item.prop)]"
              :downloadTemplate="exCellDependent?.file_downloadTemplate?.[String(item.prop)]"
              :fileMultiple="item.cellConfig.fileMultiple"
              :fileIncludeType="item.cellConfig.fileIncludeType"
              :fileExcludeType="item.cellConfig.fileExcludeType"
              :fileSingleSize="item.cellConfig.fileSingleSize"
              :fileAllSize="item.cellConfig.fileAllSize"
              :disabled="item.cellConfig.disabled"
              :display="item.cellConfig.display"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            />

            <m-input-v2
              v-else-if="item?.cellConfig.type == 'input' || item?.cellConfig.type == 'textarea'"
              v-model="row[String(item.prop)]"
              :type="item.cellConfig.type"
              :placeholder="item.cellConfig.placeholder || languagePackage?.['input'] + item.label"
              :disabled="item.cellConfig.disabled"
              :display="item.cellConfig.display"
              :maxLength="item.cellConfig.maxLength"
              :clearable="item.cellConfig.clearable"
              :autofocus="item.cellConfig.autofocus"
              :contrastData="item.cellConfig.contrastData?.[String(item.prop)]"
              :alwaysContrast="item.cellConfig.alwaysContrast"
              @change="data => valueChange(data, { prop: item.prop, ...row })"
            />
            <div v-if="item.prop && row.errorList?.[item.prop]" class="m-table-v2-cell__error">
              {{ row.errorList[item.prop] }}
            </div>
          </template>

          <!-- <template v-else-if="item.filterType == 'select'">
        {{ findData(item, row) }}
      </template> -->

          <div v-else :style="{ whiteSpace: setCellWidthIng ? 'nowrap' : 'wrap' }">{{ row[String(item.prop)] }}</div>
          <!-- <m-input-v2 v-else v-model="" :display="props.display" /> -->
        </div>
      </div>
    </template>
  </template>
</template>

<script lang="ts" setup>
// >-------------> 依赖 <------------<
import { inject, Ref, computed, ComputedRef } from "vue";
import Operation from "./operation.vue";
import { MTableV2UseItemType, MTableV2UseType, MTableV2CellExDependentType } from "./type";
import { isRowIndex } from "./hooks/isType";
import CellTag from "./cell-tag.vue";
import { keepDecimalPlaces } from "../utils/handlePrecision";
import { findData as findDataSwitch } from "../m-switch-v2/find-data";
import { findData as findDataSelect } from "../m-select-v2/find-data";
import { MOptionV2Type } from "../manager-type";
import { MFormV2ChildType } from "../m-form-v2/type";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

type TableCellType = {
  structure: Array<MTableV2UseItemType>;
  row: MTableV2UseType.MTableV2InDataType;
  renderIndex?: number;
  parentRowKey?: string;
  rowKey: string;
  useExpand?: boolean;
  rowIndex: number;
  display: boolean;
  parentRow?: MTableV2UseType.MTableV2InDataType;
  useTableIndex?: boolean;
  setCellWidthIng?: boolean;
  showSelectList?: boolean;
  useChildren?: boolean;
  useAverageWidth?: -1 | 0 | 1;
};

const props = withDefaults(defineProps<TableCellType>(), {});
const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;

// const exFunction = ref({} as Record<string, string>);
// const exFormatter = ref({} as Record<string, string>);
// const exParser = ref({} as Record<string, string>);
const isTableSelectAll = inject("isTableSelectAll") as Ref<boolean>;
const exOptions = inject("exOptions") as MOptionV2Type.Default;
const exCellDependent = inject("exCellDependent") as MTableV2CellExDependentType;
const languagePackage = inject("languagePackage") as Record<string, string>;
const handleSelectChange = inject("handleSelectChange") as (params: {
  row: MTableV2UseType.MTableV2InDataType;
  parentRow?: MTableV2UseType.MTableV2InDataType;
}) => void;

// 注入鼠标悬停相关函数和状态
const handleCellMouseEnter = inject("handleCellMouseEnter") as (rowIndex: number, columnIndex: number) => void;
const handleCellMouseLeave = inject("handleCellMouseLeave") as () => void;
const hoveredRowIndex = inject("hoveredRowIndex") as Ref<number>;
const hoveredColumnIndex = inject("hoveredColumnIndex") as Ref<number>;

// 检查当前单元格是否应该高亮
const shouldHighlightRow = computed(() => {
  return hoveredRowIndex.value === props.rowIndex;
});

// # 处理单元格显示值
function setCellDisplayValue(row: MTableV2UseType.MTableV2InDataType, prop: string, cellConfig: MFormV2ChildType) {
  const type = cellConfig.type;
  if (type == "number") {
    return keepDecimalPlaces(row[prop], cellConfig.precision);
  } else if (type == "switch") {
    const _exOptions = exOptions.value[prop];
    return findDataSwitch(row[prop], _exOptions, ManagerGlobalConfig.value?.language?.value);
  } else if (
    type == "radio" ||
    type == "checkbox" ||
    type == "cascader" ||
    type == "multiple-cascader" ||
    type == "select" ||
    type == "multiple-select" ||
    type == "request-select" ||
    type == "multiple-request-select" ||
    type == "online-select" ||
    type == "multiple-online-select"
  ) {
    const _exOptions = exOptions.value[prop];
    return findDataSelect(row[prop], _exOptions);
  } else {
    return row[prop];
  }
}

const tableCellChange: any = inject("tableCellChange");
const validateField: any = inject("validateField");

function valueChange(data, row) {
  delete row.isSelected;
  delete row.isIndeterminate;
  tableCellChange({ prop: row.prop, ...data, row });
  validateField(row.prop, data.value, row);
}

const emits = defineEmits(["changeRowStatus", "handleChangeChecked"]);
</script>
