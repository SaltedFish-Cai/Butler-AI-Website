<template>
  <template v-if="item.type == 'group' && item.prop">
    <!-- label -->
    <!-- <form-label :label="computedLabel" :tip="computedTip" :item="item" :data="injectConfigContext.data[item.prop]">
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </form-label> -->

    <div class="flex-col m-form-group-item">
      <!-- group -->
      <pa-radio
        v-if="!useDisplay"
        :id="id + '-' + item.prop + '-radio'"
        v-model="injectConfigContext.data[item.prop]"
        :disabled="item.disabled"
        :exOptions="radioOptions"
        @change="radioChange"
      ></pa-radio>

      <template v-for="groupItem in item.groupFormConfig" :key="groupItem.prop">
        <template
          v-if="injectConfigContext.data && injectConfigContext.data[item.prop] == groupItem.value && groupItem.type != 'null'"
        >
          <formItem :id="id" :item="{ ...groupItem }" noLabel>
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>

            <template #exDisplay>
              {{ findData(injectConfigContext.data[item.prop], radioOptions) || "--" }}
            </template>

            <template #exContrast>
              <div
                v-if="
                  (injectConfigContext.alwaysContrast && !isNil(injectConfigContext.contrastData)) ||
                  (!isNil(injectConfigContext.contrastData) &&
                    !isEqual(injectConfigContext.data[item.prop], injectConfigContext.contrastData))
                "
                :class="['pa-contrast-style']"
              >
                {{ injectConfigContext.contrastData || "--" }}
              </div>
            </template>
          </formItem>
        </template>
      </template>
    </div>
  </template>
</template>
<script lang="tsx" setup>
/** @description Vue 核心响应式 API */
import { Ref, ref, inject, computed, onMounted } from "vue";
/** @description 基础表单项组件 */
import formItem from "../form-basics-element.vue";
/** @description 分组项类型定义 */
import { GroupItemPropsType } from "../item";
/** @description 表单类型定义 */
import { ConfigContextType, PaFormChildType, PaFormItemType } from "../types";
/** @description 选项类型定义 */
import { PaOptionType } from "../../manager-type";
/** @description 数据查找工具 */
import { findData } from "../../pa-select/find-data";
/** @description 工具函数库 */
import _ from "lodash";
const { isNil, isEqual } = _;
/** @description 组件属性 */
const props = withDefaults(defineProps<GroupItemPropsType>(), {});

/** @description 计算展示状态 */
const useDisplay = computed(() => {
  return !isNil(props.item.display) ? props.item.display : injectConfigContext.value.display || false;
});

/** @description 配置上下文注入 */
const injectConfigContext = inject<Ref<ConfigContextType>>(
  "configContext",
  ref({
    baseSpanSize: 4,
    itemSpanSize: {},
    data: {},
    contrastData: {},
    alwaysContrast: false,
    display: false,
    languagePackage: {},
    language: "zh-CN",
    exOptions: {},
    exDependent: {},
    exCellDependent: {},
    useRequired: true,
    noLabel: false
  })
);
/** @description 设置校验规则注入 */
const injectSetRule = inject<
  (item: PaFormChildType | PaFormItemType, type?: string, options?: { titleKey?: string; removeList?: string[] }) => void
>("setRule", () => {});

/** @description 单选选项列表 */
const radioOptions = computed(() => {
  const val = injectConfigContext.value.data[String(props.item.prop)];
  let opts = (injectConfigContext.value.exOptions[String(props.item.prop)] ||
    props.item.groupFormConfig) as PaOptionType.SelectList;
  const types = typeof val;
  if (types == "number") {
    opts = opts.map(item => {
      return {
        label: item?.label?.[injectConfigContext.value.language || "zh-CN"] || item.label,
        value: item.value
      };
    });
  } else {
    opts = opts.map(item => {
      return {
        label: item?.label?.[injectConfigContext.value.language || "zh-CN"] || item.label,
        value: String(item.value)
      };
    });
  }
  if (isNil(injectConfigContext.value?.data?.[String(props.item.prop)])) {
    injectConfigContext.value.data[String(props.item.prop)] = opts[0].value;
  }
  return opts;
});

/**
 * 单选变更处理
 * @param value - 选中的值
 * @returns void
 * @description 处理分组单选变更事件
 */
function radioChange({ value }) {
  if (props.item.groupFormConfig) {
    const item = props.item.groupFormConfig.find(item => item.value == value);
    if (item) {
      const filterList = props.item.groupFormConfig.map(item => String(item.prop));
      injectSetRule(item, "default", { removeList: filterList });
    }
  }
}

/** @description 组件挂载时初始化单选状态 */
onMounted(() => {
  radioChange({ value: injectConfigContext.value.data[String(props.item.prop)] });
});
</script>
<style lang="scss" scoped>
.flex-col {
  width: 100%;
}
</style>
