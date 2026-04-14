<template>
  <div ref="RefLabelContainer" :class="['m-form-v2_label']" v-if="label">
    <div ref="RefLabel" :class="['label_text', 'form_label_text']" :title="label">
      {{ label }}
    </div>

    <m-popover-v2 v-if="tip" trigger="hover" :teleport-to="RefLabelContainer" placement="top">
      <template #reference>
        <m-icon-v2 name="question_line" class="m-form-v2-title_label-icon"></m-icon-v2>
      </template>
      <div>{{ tip }}</div>
    </m-popover-v2>

    <slot :name="'label-' + item.prop" v-bind="{ data, item }"></slot>
  </div>
</template>
<script lang="ts" setup>
// # Import
import { ref } from "vue";
import { MFormV2ItemType } from "./type";

export type labelPropsType = {
  tip?: string;
  label?: string;
  item: MFormV2ItemType;
  data: Record<string, string>;
};
// # Var
defineProps<labelPropsType>();
const RefLabelContainer = ref();
</script>

<style lang="scss" scoped>
.form_label_text {
  // display: flex;
  // align-items: center;
  // justify-content: flex-start;
  font-size: calc(var(--m-component-font-size, 13px) + 1px);
  font-weight: bold;
  color: var(--m-title-color);
  word-break: break-all;
}
.m-form-v2_label {
  display: flex;
  // overflow: hidden;
  justify-content: flex-start;
  color: var(--dms-page-text-color);
  align-items: center;
  // white-space: nowrap;
  &_text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &-tip {
    margin: 0 5px;
  }
}
</style>
