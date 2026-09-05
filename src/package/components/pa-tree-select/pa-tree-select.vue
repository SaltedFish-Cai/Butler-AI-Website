<template>
  <!-- 独立面板模式：不渲染下拉输入框，直接平铺树面板 -->
  <div
    v-if="props.inline && !display"
    :id="renderId"
    class="pa-tree-select pa-tree-select--inline"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="props.style"
  >
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <pa-scrollbar
      class="pa-tree-select-inline-tree"
      :renderId="renderId + '_options'"
      :useBackTop="false"
      :use-scroll-x="false"
      :useShadow="false"
      :style="{ maxHeight: props.maxHeight || '300px', '--scrollbar-width': '11.1px' }"
      :useClosePopover="false"
      useHiddenThumb
    >
      <pa-tree-select-node
        v-for="node in treeData"
        :key="String(node[props.nodeKey || 'value'])"
        :id="renderId + '_node'"
        :renderId="renderId + '_node'"
        :node="node"
        :level="1"
        :nodeKey="props.nodeKey || 'value'"
        :propsConfig="propsConfig"
        :inValue="inValue"
        :defaultExpandAll="!!props.defaultExpandAll"
        :checkStrictly="!!props.checkStrictly"
        :filterValue="filterValue"
        :name="name"
      >
        <template #optionLabel="{ node: optionNode }">
          <slot name="optionLabel" :node="optionNode">
            {{ optionNode[propsConfig.label] }}
          </slot>
        </template>
      </pa-tree-select-node>
    </pa-scrollbar>
    <div v-if="treeData.length === 0" class="pa-tree-select-no-data">{{ languagePackage["empty"] }}</div>
  </div>

  <div
    v-else-if="!display"
    :id="renderId"
    class="pa-tree-select"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="props.style"
  >
    <pa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :autoWidth="!exOptionsList.length || !!filterValue"
      sticky="left"
      :teleport-to="teleportInContainer ? selectRef : 'body'"
      :closeByScroll="false"
    >
      <template #reference>
        <div class="pa-tree-select-content">
          <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
            {{ typeof title === "string" ? title : title[languageValue] }}
          </div>

          <div class="pa-tree-select-input" :id="renderId + '_input'" :class="[isFocus ? 'is-focus' : '']">
            <input
              v-if="useFilter"
              :id="renderId + '_input-inner'"
              :data-name="typeof name === 'string' ? name : name?.[languageValue]"
              class="pa-tree-select-input-inner"
              :value="inputValue"
              :placeholder="inputPlaceholder"
              ref="inputRef"
              :name="id"
              autocomplete="off"
              :disabled="props.disabled"
              @focus="handleFocus"
              @blur="handleBlur"
              @input="handleInput"
            />
            <template v-else>{{ inputValue }}</template>
            <pa-icon v-if="inValue && clearable && useFilter" name="close_circle_line" class="clear-icon" @click="clearInput" />
            <pa-icon :class="!isFocus ? 'down-icon' : 'down-icon up-icon'" name="down_line" />
          </div>
        </div>
      </template>

      <div class="pa-tree-select-options" ref="optionsRef" v-if="!props.disabled && treeData.length > 0">
        <pa-scrollbar
          :renderId="renderId + '_options'"
          :useBackTop="false"
          :useShadow="false"
          :style="{ maxHeight: '230px', '--scrollbar-width': '11.1px' }"
          :useClosePopover="false"
          useHiddenThumb
        >
          <pa-tree-select-node
            v-for="node in treeData"
            :key="String(node[props.nodeKey || 'value'])"
            :id="renderId + '_node'"
            :renderId="renderId + '_node'"
            :node="node"
            :level="1"
            :nodeKey="props.nodeKey || 'value'"
            :propsConfig="propsConfig"
            :inValue="inValue"
            :defaultExpandAll="!!props.defaultExpandAll"
            :checkStrictly="!!props.checkStrictly"
            :filterValue="filterValue"
            :name="name"
          >
            <template #optionLabel="{ node: optionNode }">
              <slot name="optionLabel" :node="optionNode">
                {{ optionNode[propsConfig.label] }}
              </slot>
            </template>
          </pa-tree-select-node>
        </pa-scrollbar>
      </div>
      <div v-else class="pa-tree-select-no-data">{{ languagePackage["empty"] }}</div>
    </pa-popover>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="props.style">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay" />
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} ) </template>
      <template v-else>{{ findData(inValue) || "--" }}</template>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, watch, inject, provide, useTemplateRef, type ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入树节点子组件
 */
import PaTreeSelectNode from "./pa-tree-select-node.vue";
/**
 * 模块导入
 * @description 导入 render-id 工具函数
 */
import useRenderId from "../tools/render-id";
/**
 * 模块导入
 * @description 导入滚动条组件
 */
import PaScrollbar from "../pa-scrollbar/pa-scrollbar.vue";
/**
 * 模块导入
 * @description 导入空值判断工具函数
 */
import isNil from "../tools/is-nil";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
import { PaOptionType } from "../manager-type";

/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  useFilter: true,
  clearable: true
});
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * render-id
 * @description 组件唯一标识
 */
const renderId = ref(props.renderId || (props.id ? props.id : "pa-tree-select_" + useRenderId()));
/**
 * 弹出层引用
 * @type any
 * @description 弹出层组件引用
 */
const popoverRef = useTemplateRef("popoverRef");
/**
 * 选择器容器引用
 * @type any
 * @description 选择器容器 DOM 元素引用
 */
const selectRef = ref();
/**
 * 聚焦状态
 * @type boolean
 * @description 当前是否处于聚焦状态
 */
const isFocus = ref(false);
/**
 * 输入框引用
 * @type any
 * @description 输入框 DOM 元素引用
 */
const inputRef = ref();
/**
 * 选项列表容器引用
 * @type any
 * @description 选项列表容器 DOM 元素引用
 */
const optionsRef = ref();
/**
 * 过滤值
 * @type string
 * @description 输入框过滤关键词
 */
const filterValue = ref("");
/**
 * 内部值
 * @type any
 * @description 树选择器的内部绑定值
 */
const inValue = ref(props.modelValue);
/**
 * 旧值存储
 * @type number | string
 * @description 存储上一次的值，用于变更事件
 */
let oldValue: number | string = props.modelValue as number | string;
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language || "zh-CN";
});
/**
 * 语言包
 * @type ComputedRef
 * @description 当前语言的文本配置
 */
const languagePackage = computed(() => {
  return languageValue.value === "zh-CN"
    ? { selectPlaceholder: "请选择内容", empty: "暂无数据" }
    : { selectPlaceholder: "Please Select Content", empty: "No Data" };
});
/**
 * **选项列表**
 * @type `Ref<Array<PaOptionType.Select>>`
 * @description 外部传入的选项列表
 */
const exOptionsList = ref([] as PaOptionType.Select[]);
/**
 * 节点字段配置
 * @type computed
 * @description 合并默认值后的节点字段映射
 */
const propsConfig = computed(() => {
  return {
    label: props.props?.label || "label",
    children: props.props?.children || "children",
    disabled: props.props?.disabled || "disabled"
  };
});
/**
 * 扁平化树数据
 * @type computed
 * @description 树形数据扁平化后的节点列表，用于查找与筛选
 */
const flatTreeData = computed(() => {
  const flatList: Array<Record<string, any>> = [];
  const flatten = (nodes: Array<Record<string, any>>) => {
    nodes?.forEach(node => {
      flatList.push(node);
      if (node[propsConfig.value.children]?.length) {
        flatten(node[propsConfig.value.children]);
      }
    });
  };
  flatten(props.exOptions || []);
  return flatList;
});
/**
 * 树数据
 * @type computed
 * @description 按过滤值筛选后的树形数据（保留命中节点的父级链路）
 */
const treeData = computed(() => {
  if (!filterValue.value) return props.exOptions || [];
  const matchedValues = new Set(
    flatTreeData.value
      .filter(item => {
        const label = String(item[propsConfig.value.label] ?? "");
        return label.includes(filterValue.value);
      })
      .map(item => String(item[props.nodeKey || "value"]))
  );
  const buildFilteredTree = (nodes: Array<Record<string, any>>): Array<Record<string, any>> => {
    return (nodes || [])
      .map(node => {
        const children = buildFilteredTree(node[propsConfig.value.children]);
        const selfMatched = matchedValues.has(String(node[props.nodeKey || "value"]));
        if (selfMatched || children.length) {
          return { ...node, [propsConfig.value.children]: children };
        }
        return null;
      })
      .filter(Boolean) as Array<Record<string, any>>;
  };
  return buildFilteredTree(props.exOptions || []);
});
/**
 * 输入框显示值
 * @returns string 输入框显示的文本
 * @description 计算输入框应显示的文本内容
 */
const inputValue = computed(() => {
  if (props.useFilter && isFocus.value) return filterValue.value || "";

  const node = flatTreeData.value?.find?.(item => item[props.nodeKey || "value"] == inValue.value);
  return node ? node[propsConfig.value.label] : inValue.value || "";
});
/**
 * 输入框占位符
 * @returns string 占位符文本
 * @description 计算输入框的占位符文本
 */
const inputPlaceholder = computed(() => {
  if (props.display || props.disabled) return "";

  if (isFocus.value) {
    const node = flatTreeData.value.find(item => item[props.nodeKey || "value"] == inValue.value);
    return node ? node[propsConfig.value.label] : languagePackage.value["selectPlaceholder"];
  }
  return (
    (typeof props.placeholder === "object"
      ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
      : props.placeholder) || languagePackage.value[`selectPlaceholder`]
  );
});
/**
 * 处理输入事件
 * @description 处理输入框输入，过滤树节点
 */
function handleInput({ target }) {
  filterValue.value = target.value;
}
/**
 * 处理聚焦事件
 * @description 显示弹出层
 */
function handleFocus() {
  isFocus.value = true;
  popoverRef.value?.showPopover();
}
/**
 * 处理失焦事件
 * @description 隐藏弹出层
 */
function handleBlur() {
  isFocus.value = false;
  popoverRef.value?.hidePopover();
}
/**
 * 处理弹出层状态变化
 * @description 根据弹出层状态更新组件状态
 */
function handlePopoverChange(data) {
  if (!data) {
    isFocus.value = false;
    filterValue.value = "";
  } else {
    isFocus.value = true;
    inputRef?.value?.focus();
  }
}
/**
 * 处理节点选择
 * @param `node` `Record<string, any>` 被选中的节点数据
 * @returns `void`
 * @description 更新选中值并触发变更事件
 */
function handleNodeSelect(node: Record<string, any>) {
  const value = node[props.nodeKey || "value"];
  inValue.value = value;
  emits("update:modelValue", value);
  emits("change", { value, oldValue, option: node });
  oldValue = value;
  popoverRef.value?.hidePopover();
}
provide("handleNodeSelect", handleNodeSelect);
/**
 * 查找显示数据
 * @description 根据值查找对应的显示文本
 */
function findData(data) {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  const node = flatTreeData.value?.find?.(item => item[props.nodeKey || "value"] == data);
  return node ? node[propsConfig.value.label] : data || "--";
}
/**
 * 清空输入内容
 * @description 清空选择器值
 */
function clearInput(e) {
  e.stopPropagation();
  inValue.value = "";
  emits("update:modelValue", "");
  emits("change", { value: "", oldValue, option: {} });
  oldValue = "";
}
/**
 * 监听 modelValue 变化
 * @description 外部值变化时更新内部值
 */
watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data : "";
    oldValue = !isNil(data) ? data || "" : "";
  },
  { immediate: true }
);
/**
 * **监听 exOptions 变化**
 * @description 同步外部传入的选项列表
 */
watch(
  () => props.exOptions,
  data => {
    exOptionsList.value = data || [];
  },
  { immediate: true, deep: true }
);
defineExpose({
  closeDropdown: () => popoverRef.value?.hidePopover(),
  openDropdown: () => popoverRef.value?.showPopover()
});
</script>

<style lang="scss">
@use "../styles/default/pa-tree-select.scss";
@use "../cell-style.scss";
</style>
