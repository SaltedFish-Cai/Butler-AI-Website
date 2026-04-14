<template>
  <template v-if="Array.isArray(value) && value.length > 0">
    <template v-for="item in value" :key="item">
      <div
        class="m-table-tag-v2"
        :class="[!!clickTag && !disabled ? 'm-hand' : '']"
        :style="{ color: findTextColor(item), backgroundColor: findBgColor(item) }"
        @click="!disabled && clickTag?.({ row })"
      >
        <m-icon-v2 v-if="!!clickTag && !disabled" name="finger_press_line" style="margin-right: 4px"></m-icon-v2>
        {{ findText(item) }}
      </div>
    </template>
  </template>
  <div
    v-else-if="!Array.isArray(value)"
    class="m-table-tag-v2"
    :class="[!!clickTag && !disabled ? 'm-hand' : '']"
    :style="{ color: findTextColor(value), backgroundColor: findBgColor(value) }"
    @click="!disabled && clickTag?.({ row })"
  >
    <m-icon-v2 v-if="!!clickTag && !disabled" name="finger_press_line" style="margin-right: 4px"></m-icon-v2>
    {{ findText(value) }}
  </div>
  <div v-else>--</div>
</template>
<script lang="ts" setup>
import { MOptionV2Type } from "../manager-type";
import isDarkColor from "../tools/isDarkColor";
import { MTableV2UseType } from "./type";

type Props = {
  value: boolean | number | string;
  row: MTableV2UseType.MTableV2InDataType;
  clickTag?: (params: { row: MTableV2UseType.MTableV2InDataType }) => void;
  disabled?: boolean;
  exOptions?: MOptionV2Type.SelectList;
};
const props = withDefaults(defineProps<Props>(), {
  clickTag: undefined,
  disabled: undefined
});

function findText(row) {
  let text = "--";
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
.m-table-tag-v2 {
  margin: calc(var(--m-component-padding-size, 10px) / 4);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 2em;
  border-radius: 3px;
  font-size: calc(var(--m-component-font-size, 13px) - 2px);
  padding: calc(var(--m-component-padding-size, 10px) / 4) calc(var(--m-component-padding-size, 10px) - 2px);
}
</style>
