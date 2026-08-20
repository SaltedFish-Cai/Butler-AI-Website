<template>
  <template v-if="Array.isArray(value) && value.length > 0">
    <template v-for="item in value" :key="item">
      <div
        :id="id + '-tag-' + itemConfig.prop + '-' + row.rowIndex + '_' + item"
        :data-name="'表格标签 - ' + itemConfig.label + ' ' + findText(item) + ` (表格数据${row.rowIndex})`"
        class="pa-table-tag"
        :class="[!!clickTag && !disabled ? 'm-hand' : '']"
        :style="{ color: findTextColor(item), backgroundColor: findBgColor(item) }"
        @click="!disabled && clickTag?.({ row })"
      >
        <pa-icon v-if="!!clickTag && !disabled" name="finger_press_line" style="margin-right: 4px"></pa-icon>
        {{ findText(item) }}
      </div>
    </template>
  </template>
  <div
    v-else-if="!isNil(value) && !Array.isArray(value)"
    :id="id + '-tag-' + itemConfig.prop + '-' + row.rowIndex + '_' + value"
    :data-name="'表格标签 - ' + itemConfig.label + ' ' + findText(value) + ` (表格数据${row.rowIndex})`"
    class="pa-table-tag"
    :class="[!!clickTag && !disabled ? 'm-hand' : '']"
    :style="{ color: findTextColor(value), backgroundColor: findBgColor(value) }"
    @click="!disabled && clickTag?.({ row })"
  >
    <pa-icon v-if="!!clickTag && !disabled" name="finger_press_line" style="margin-right: 4px"></pa-icon>
    {{ findText(value) }}
  </div>
  <div v-else>--</div>
</template>
<script lang="ts" setup>
import { LanguagePackageType, PaOptionType } from "../manager-type";
import isDarkColor from "../tools/isDarkColor";
import { ComponentUseItemProps, PaTableUseType } from "./types";
import isNil from "../tools/is-nil";

type Props = {
  id: string;
  value: boolean | number | string;
  itemConfig: ComponentUseItemProps;
  row: PaTableUseType.PaTableInDataType;
  clickTag?: (params: { row: PaTableUseType.PaTableInDataType }) => void;
  disabled?: boolean;
  exOptions?: PaOptionType.SelectList;
};
const props = withDefaults(defineProps<Props>(), {
  clickTag: undefined,
  disabled: undefined
});

function findText(row) {
  let text: LanguagePackageType | string = "--";
  if (props.exOptions) {
    props.exOptions.map(item => {
      if (item.value == row) {
        text = item.label;
      }
    });
  }
  return text;
}

function findBgColor(row) {
  let bgColor = "var(--pa-color-primary-light-3)";
  if (props.exOptions) {
    props.exOptions.map(item => {
      if (item.value == row) {
        if (item.tagStyle?.bgColor) bgColor = item.tagStyle?.bgColor;
      }
    });
  }
  return bgColor;
}

function findTextColor(row) {
  let textColor = "var(--pa-color-send-bg)";
  if (props.exOptions) {
    props.exOptions.map(item => {
      if (item.value == row) {
        if (item.tagStyle?.textColor) textColor = item.tagStyle?.textColor;
        else if (item.tagStyle?.bgColor && isDarkColor(item.tagStyle?.bgColor)) textColor = "#fff";
      }
    });
  }
  return textColor;
}
</script>
<style lang="scss">
.pa-table-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 1.4em;
  padding: calc(var(--pa-size-padding, 10px) / 4) calc(var(--pa-size-padding, 10px) - 2px);
  margin: calc(var(--pa-size-padding, 10px) / 4);
  font-size: calc(var(--pa-size-font, 16px) - 2px);
  border-radius: 3px;
}
</style>
