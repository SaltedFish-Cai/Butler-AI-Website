<template>
  <template v-if="Array.isArray(value) && value.length > 0">
    <template v-for="item in value" :key="item">
      <div
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
    v-else-if="!Array.isArray(value)"
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
import { PaTableUseType } from "./types";

type Props = {
  value: boolean | number | string;
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
  let bgColor = "transparent";
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
  let textColor = "#818181";
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
  margin: calc(var(--pa-size-padding, 10px) / 4);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 2em;
  border-radius: 3px;
  font-size: calc(var(--pa-size-font, 16px) - 2px);
  padding: calc(var(--pa-size-padding, 10px) / 4) calc(var(--pa-size-padding, 10px) - 2px);
}
</style>
