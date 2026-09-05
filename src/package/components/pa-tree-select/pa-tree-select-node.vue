<template>
  <div class="pa-tree-select-node-group">
    <div
      :id="renderId + '_option_' + String(node[nodeKey])"
      :data-name="(typeof name === 'string' ? name : name?.[languageValue]) + ` (${node[propsConfig.label]})`"
      class="pa-tree-select-option"
      :class="{ 'is-active': equalData(node[nodeKey], inValue), 'is-disabled': node[propsConfig.disabled] }"
      :style="{ paddingLeft: 'calc(var(--pa-size-padding_large) * 1.2 * ' + level + ')' }"
      @mousedown.prevent
      @click="handleClick"
    >
      <div class="flex-center">
        <slot name="optionLabel" :node="node"> {{ node[propsConfig.label] }} </slot>
      </div>
      <pa-icon
        v-if="nodeChildren.length && !checkStrictly"
        name="right"
        class="expand-icon"
        :class="[expanded || filterValue ? 'is-expanded' : '']"
      />
      <pa-icon v-if="equalData(node[nodeKey], inValue)" name="check_line" class="check-icon" />
    </div>

    <Transition name="pa-tree-expand">
      <div v-if="nodeChildren.length && (checkStrictly || expanded || filterValue)" class="pa-tree-expand-wrap">
        <div class="pa-tree-select-node-children">
          <pa-tree-select-node
            v-for="child in nodeChildren"
            :key="String(child[nodeKey])"
            :id="id"
            :renderId="renderId"
            :node="child"
            :level="Number(level) + 1"
            :nodeKey="nodeKey"
            :propsConfig="propsConfig"
            :inValue="inValue"
            :defaultExpandAll="defaultExpandAll"
            :checkStrictly="checkStrictly"
            :filterValue="filterValue"
            :name="name"
          >
            <template #optionLabel="{ node: optionNode }">
              <slot name="optionLabel" :node="optionNode" />
            </template>
          </pa-tree-select-node>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, inject, watch, ComputedRef } from "vue";
/**
 * **模块导入**
 * @description 导入全局配置类型
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * **模块导入**
 * @description 导入数据比较工具
 */
import { equalData } from "../utils/equalData";
/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **节点点击处理函数注入**
 * @type `Function`
 * @description 从父组件注入的节点选择处理函数
 */
const injectHandleNodeSelect: any = inject("handleNodeSelect");
/**
 * **组件属性**
 * @type `object`
 * @description 组件的属性对象
 */
const props = defineProps<{
  /**
   * **组件ID**
   * @type `string`
   * @description 组件的唯一标识符
   */
  id: string;
  /**
   * **render-id**
   * @type `string`
   * @description 组件的唯一标识
   */
  renderId: string;
  /**
   * **节点数据**
   * @type `Record<string, any>`
   * @description 当前节点数据
   */
  node: Record<string, any>;
  /**
   * **当前层级**
   * @type `number`
   * @description 当前层级
   */
  level: number;
  /**
   * **节点值字段**
   * @type `string`
   * @description 树节点选中值的取值字段
   */
  nodeKey: string;
  /**
   * **节点字段配置**
   * @type `object`
   * @description 节点的 label / children / disabled 字段映射
   */
  propsConfig: { label: string; children: string; disabled: string };
  /**
   * **当前选中值**
   * @type `number` | `string` | `boolean` | `undefined`
   * @description 当前选中的值
   */
  inValue?: boolean | number | string;
  /**
   * **默认展开全部**
   * @type `boolean`
   * @description 是否默认展开所有节点
   */
  defaultExpandAll?: boolean;
  /**
   * **父子不关联**
   * @type `boolean`
   * @description 是否点击任意层级节点均可选中
   */
  checkStrictly?: boolean;
  /**
   * **过滤值**
   * @type `string`
   * @description 输入框过滤关键词
   */
  filterValue?: string;
  /**
   * **表单项名称**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 表单项名称文本
   */
  name?: string | import("../manager-type").LanguagePackageType;
}>();
/**
 * **展开状态**
 * @type `Ref<boolean>`
 * @description 当前节点的子级是否展开
 */
const expanded = ref(false);
/**
 * **选中链路判断**
 * @type `computed`
 * @description 当前节点的子级中是否包含选中值节点，用于展开选中值所在链路
 */
const hasSelectedDescendant = computed(() => {
  const find = (nodes: Array<Record<string, any>> | undefined): boolean => {
    if (!nodes?.length) return false;
    return nodes.some(n => equalData(n[props.nodeKey], props.inValue) || find(n[props.propsConfig.children]));
  };
  return find(props.node[props.propsConfig.children]);
});
/**
 * **监听 defaultExpandAll 与选中值变化**
 * @description defaultExpandAll 作为初始展开状态；默认收起模式下，选中值所在链路的节点自动展开
 */
watch(
  () => [props.defaultExpandAll, props.inValue],
  () => {
    expanded.value = !!props.defaultExpandAll || hasSelectedDescendant.value;
  },
  { immediate: true }
);
/**
 * **子级节点列表**
 * @type `computed`
 * @description 当前节点的子级数据
 */
const nodeChildren = computed(() => {
  return props.node[props.propsConfig.children] || [];
});
/**
 * **当前语言值**
 * @returns `string` 当前选中的语言
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language || "zh-CN";
});
/**
 * **处理点击事件**
 * @returns `void`
 * @description checkStrictly 或叶子节点直接选中；否则点击有子级的节点切换展开/收起
 */
function handleClick(): void {
  // 非 checkStrictly 模式且有子级时，点击切换展开/收起
  if (nodeChildren.value.length && !props.checkStrictly) {
    expanded.value = !expanded.value;
    return;
  }
  if (props.node[props.propsConfig.disabled]) return;
  injectHandleNodeSelect?.(props.node);
}
</script>
