/**
 * @module pa-tree-select/types
 * @description PaTreeSelect 类型定义
 */
/**
 * 模块导入
 * @description 导入多语言类型定义
 */
import type { LanguagePackageType } from "../manager-type";

/**
 * 树节点字段配置
 * @description 自定义树节点的字段映射，与 el-tree-select 的 props 配置保持一致
 */
export type TreePropsType = {
  /**
   * **节点文本字段**
   * @type `string`
   * @default `label`
   * @description 树节点显示文本的取值字段
   */
  label?: string;
  /**
   * **子级字段**
   * @type `string`
   * @default `children`
   * @description 树节点子级列表的取值字段
   */
  children?: string;
  /**
   * **禁用字段**
   * @type `string`
   * @default `disabled`
   * @description 树节点禁用状态的取值字段
   */
  disabled?: string;
};

/**
 * 组件属性定义
 * @description PaTreeSelect 组件的属性类型
 */
export type ComponentProps = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * **render-id**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   */
  renderId?: string;
  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
  /**
   * **双向绑定值**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 树选择器绑定值
   */
  modelValue?: number | string;
  /**
   * **树数据**
   * @type `Array<Record<string, any>>` | `undefined`
   * @default `undefined`
   * @description 树形结构的选择数据
   */
  exOptions?: Array<PaOptionType.Select>;
  /**
   * **节点值字段**
   * @type `string`
   * @default `value`
   * @description 树节点选中值的取值字段，与 el-tree-select 的 node-key 对应
   */
  nodeKey?: string;
  /**
   * **节点字段配置**
   * @type `TreePropsType` | `undefined`
   * @default `undefined`
   * @description 自定义节点的 label / children / disabled 字段映射
   */
  props?: TreePropsType;
  /**
   * **表单项标签**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 表单项标签文本
   */
  title?: LanguagePackageType | string;
  /**
   * **表单项标签宽度**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 表单项标签宽度
   */
  titleWidth?: string;
  /**
   * **表单项名称**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 表单项名称文本
   */
  name?: LanguagePackageType | string;
  /**
   * **占位符**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 输入框占位符文本
   */
  placeholder?: LanguagePackageType | string;
  /**
   * **默认展开全部**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，默认展开所有树节点
   */
  defaultExpandAll?: boolean;
  /**
   * **父子不关联**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，点击任意层级节点均可选中（与 el-tree-select 的 check-strictly 对应）
   */
  checkStrictly?: boolean;
  /**
   * **是否开启筛选**
   * @type `boolean`
   * @default `true`
   * @description 是否开启输入框筛选功能
   */
  useFilter?: boolean;
  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会禁用该组件
   */
  disabled?: boolean;
  /**
   * **纯展示模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   */
  display?: boolean;
  /**
   * **纯展示数据**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 纯展示模式下直接显示的值
   */
  displayValue?: string;
  /**
   * **显示清除按钮**
   * @type `boolean`
   * @default `true`
   * @description 是否显示清除按钮
   */
  clearable?: boolean;
  /**
   * **Teleport 目标**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会将弹出层挂载到组件容器内
   */
  teleportInContainer?: boolean;
  /**
   * **独立面板模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，不渲染下拉输入框，直接在组件位置平铺树面板
   */
  inline?: boolean;
  /**
   * **面板最大高度**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 独立面板模式下树区域的最大高度，超出后滚动，如 `300px`
   */
  maxHeight?: string;
};

/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * **双向绑定更新事件**
   * @param `value` `number` | `string` | `boolean` 选中的节点值
   * @returns `void`
   */
  (e: "update:modelValue", value: boolean | number | string): void;
  /**
   * **值变更事件**
   * @param `payload` `object` 变更数据
   * @returns `void`
   */
  (
    e: "change",
    payload: {
      value: boolean | number | string;
      oldValue: boolean | number | string;
      option: Record<string, any>;
    }
  ): void;
  /**
   * **节点点击事件**
   * @param `node` `Record<string, any>` 被点击的节点数据
   * @returns `void`
   */
  (e: "node-click", node: Record<string, any>): void;
};
