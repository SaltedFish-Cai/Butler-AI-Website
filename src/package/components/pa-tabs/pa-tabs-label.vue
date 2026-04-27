<template>
  <RenderTableColumn v-bind="_props.slots" />
</template>

<script lang="tsx" setup name="TableColumn">
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { computed, ComputedRef, inject, Ref } from "vue";
/**
 * **模块导入**
 * @description 导入标签属性类型定义
 * */
import { ComponentLabelProps } from "./types";
/**
 * **模块导入**
 * @description 导入全局配置类型定义
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";
/**
 * **标签页上下文**
 * @type `Ref<{ mode: string; tabsId: string }>`
 * @description 注入标签页父组件提供的上下文
 * */
const tabsContext = inject("TabsContext") as Ref<{ mode: "default" | "portrait" | "slider" | "sticky"; tabsId: string }>;

/**
 * **组件属性**
 * @type `ComponentLabelProps`
 * @description 组件的属性对象
 * */
const _props = defineProps<ComponentLabelProps>();

/**
 * **全局配置**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入 Pancake 全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * **语言值**
 * @type `ComputedRef<string>`
 * @description 当前语言设置
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

function setLabel(label: string) {
  if (typeof label !== "string") return label?.[languageValue.value];
  try {
    const jsonStr = label.replace(/'/g, '"');
    return JSON.parse(jsonStr)[languageValue.value];
  } catch (err) {
    console.error("多语言文本转对象失败:", err);
    return label;
  }
}

/**
 * **渲染标签列表**
 * @param `slots` `any` 插槽数据
 * @returns `JSX.Element` 标签列表渲染结果
 * @description 根据插槽数据渲染标签页标题列表
 * */
/**
 * **渲染标签列组件**
 * @param `slots` `any` 插槽数据
 * @returns `VNode` 虚拟节点
 * @description 渲染标签页标题内容
 * */
const RenderTableColumn = slots => {
  const _slots: any = [];
  for (const key in slots) {
    _slots.push(slots[key]);
  }
  const className = props => {
    const name =
      props?.name == _props.activeName
        ? `pa-tabs-title pa-tabs-title_action pa-tabs-title_action_${tabsContext.value.tabsId}`
        : "pa-tabs-title";
    return name;
  };
  if (!_slots) return <></>;
  return (
    <>
      {_slots.map(({ props, children }, index) => {
        const name = props?.name;
        return (
          <div class={className(props)} onClick={() => _props.changeTabs(name, index)}>
            {name && children.label ? "" : <pa-icon class="mr3" name={props?.icon ? props?.icon : "grid_adaptive_line"} />}
            {name && children.label ? children.label(props) : setLabel(props?.label)}
          </div>
        );
      })}
    </>
  );
};
</script>

<style lang="scss"></style>
