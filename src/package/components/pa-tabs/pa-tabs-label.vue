<template>
  <RenderTableColumn v-bind="_props.slots" />
</template>

<script lang="tsx" setup name="TableColumn">
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, ComputedRef, inject, ref, Ref } from "vue";
/**
 * 模块导入
 * @description 导入全局配置类型定义
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入标签页标题组件属性类型定义
 */
import { ComponentLabelProps } from "./types";
import { JSX } from "vue/jsx-runtime";
import useRenderId from "../tools/render-id";
/**
 * 标签页上下文
 * @type Ref<{ mode: string; tabsId: string }>
 * @description 注入标签页父组件提供的上下文
 */
const tabsContext = inject("TabsContext") as Ref<{
  mode: "default" | "portrait" | "slider" | "sticky";
  tabsId: string;
}>;
/**
 * 组件属性
 * @type ComponentLabelProps
 * @description 组件的属性对象
 */
const _props = defineProps<ComponentLabelProps>();
const randId = ref((_props.id ? _props.id + "_" : "") + "pa-tabs-label_" + useRenderId());
/**
 * 全局配置
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入 Pancake 全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 语言值
 * @type ComputedRef<string>
 * @description 当前语言设置
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language || "zh-CN";
});
/**
 * 设置标签
 * @param label - | Record<string, string> 标签文本或语言对象
 * @returns string | undefined 返回对应语言的值
 * @description 根据当前语言设置返回标签文本，支持字符串和语言对象两种格式
 */
function setLabel(label: Record<string, string> | string): string | undefined {
  if (typeof label === "object") return label?.[languageValue.value];
  if (label.includes("'") || label.includes('"')) {
    try {
      const jsonStr = label.replace(/'/g, '"');
      return JSON.parse(jsonStr)[languageValue.value];
    } catch {
      return label;
    }
  }
  return label;
}
/**
 * 渲染标签列组件
 * @param slots - 插槽数据
 * @returns JSX.Element 虚拟节点
 * @description 渲染标签页标题内容
 */
let dragIndex: number | null = null;

function handleDragStart(event: DragEvent, index: number): void {
  dragIndex = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }
  (event.target as HTMLElement)?.classList?.add("dragging");
}

function handleDragOver(event: DragEvent, index: number): void {
  if (dragIndex === null) return;
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
  // 移除所有 dragover
  document.querySelectorAll(".pa-tabs-title.dragover").forEach(el => el.classList.remove("dragover"));
  if (dragIndex !== index) {
    (event.currentTarget as HTMLElement)?.classList?.add("dragover");
  }
}

function handleDrop(event: DragEvent, index: number): void {
  event.preventDefault();
  document.querySelectorAll(".pa-tabs-title.dragover").forEach(el => el.classList.remove("dragover"));
  if (dragIndex !== null && dragIndex !== index && _props.onDragReorder) {
    _props.onDragReorder(dragIndex, index);
  }
  dragIndex = null;
}

function handleDragEnd(event: DragEvent): void {
  (event.target as HTMLElement)?.classList?.remove("dragging");
  document.querySelectorAll(".pa-tabs-title.dragover").forEach(el => el.classList.remove("dragover"));
  dragIndex = null;
}

const RenderTableColumn = (slots: any): JSX.Element => {
  const _slots: any[] = [];
  for (const key in slots) {
    _slots.push(slots[key]);
  }
  /**
   * 获取类名
   * @param props - 插槽属性
   * @returns string 类名字符串
   * @description 根据是否激活状态返回对应的类名
   */
  const className = (props: any): string => {
    const name =
      props?.name == _props.activeName
        ? `pa-tabs-title _action pa-tabs-title_action_${tabsContext.value.tabsId}`
        : "pa-tabs-title";
    return name;
  };
  if (!_slots) return <></>;
  return (
    <>
      {_slots.map(({ props, children }, index) => {
        const name = props?.name;
        return (
          <div
            id={randId.value + "_tab" + "_" + props?.name}
            class={className(props)}
            onClick={() => _props.changeTabs && _props.changeTabs(name, index)}
            draggable={!!_props.onDragReorder}
            onDragstart={(e: DragEvent) => handleDragStart(e, index)}
            onDragover={(e: DragEvent) => handleDragOver(e, index)}
            onDrop={(e: DragEvent) => handleDrop(e, index)}
            onDragend={handleDragEnd}
          >
            {name && children.label ? "" : <pa-icon class="mr3" name={props?.icon ? props?.icon : "grid_adaptive_line"} />}
            {name && children.label ? children.label(props) : setLabel(props?.label)}
          </div>
        );
      })}
    </>
  );
};
</script>
