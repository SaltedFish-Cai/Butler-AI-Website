<template>
  <div ref="RefLabelContainer" :class="['form_label']" v-if="label">
    <div ref="RefLabel" :class="['label_text', 'form_label_text']" :title="label">
      {{ label }}
    </div>

    <pa-popover v-if="tip" trigger="hover" :teleport-to="RefLabelContainer" placement="top">
      <template #reference>
        <pa-icon name="question_line" class="form-title_label-icon"></pa-icon>
      </template>
      <div>{{ tip }}</div>
    </pa-popover>

    <slot :name="'label-' + item.prop" v-bind="{ data, item }"></slot>
  </div>
</template>
<script lang="ts" setup>
/**
 * Vue 响应式 API
 * @description Vue 响应式 API
 */
import { ref } from "vue";
/**
 * 表单项类型定义
 * @description 表单项类型定义
 */
import { PaFormItemType } from "./types";

export type labelPropsType = {
  tip?: string;
  label?: string;
  item: PaFormItemType;
  data: Record<string, string>;
};
defineProps<labelPropsType>();
/**
 * 标签容器引用
 * @description 标签容器 DOM 引用
 */
const RefLabelContainer = ref();
</script>

<style lang="scss" scoped>
.form_label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--dms-page-text-color);
  &_text {
    overflow: hidden;
    font-size: var(--pa-size-font, 16px);
    font-weight: bold;
    color: var(--pa-title-color);
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
  &-tip {
    margin: 0 5px;
  }
}
</style>
