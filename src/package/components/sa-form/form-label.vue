<template>
  <div ref="RefLabelContainer" :class="['sa-form_label']" v-if="label">
    <div ref="RefLabel" :class="['label_text', 'form_label_text']" :title="label">
      {{ label }}
    </div>

    <sa-popover v-if="tip" trigger="hover" :teleport-to="RefLabelContainer" placement="top">
      <template #reference>
        <sa-icon name="question_line" class="sa-form-title_label-icon"></sa-icon>
      </template>
      <div>{{ tip }}</div>
    </sa-popover>

    <slot :name="'label-' + item.prop" v-bind="{ data, item }"></slot>
  </div>
</template>
<script lang="ts" setup>
// # Import
import { ref } from "vue";
import { SaFormItemType } from "./type";

export type labelPropsType = {
  tip?: string;
  label?: string;
  item: SaFormItemType;
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
  font-size: calc(var(--sa-size-font, 13px) + 1px);
  font-weight: bold;
  color: var(--sa-color-font);
  word-break: break-all;
}
.sa-form_label {
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
