/**
 * **模块导入**
 * @description 导入表单子项类型
 */
import { PaFormItemType } from "./types";

/**
 * **组项属性类型**
 * @type `object`
 * @description 组项组件的属性类型定义
 */
export type GroupItemPropsType = {
  /**
   * **唯一标识**
   * @type `string`
   * @description 组件唯一标识
   */
  id: string;
  /**
   * **表单项配置**
   * @type [`PaFormItemType`](#paformitemtype)
   * @description 表单项配置
   */
  item: PaFormItemType;
};

/**
 * **标签页项属性类型**
 * @type `object`
 * @description 标签页项组件的属性类型定义
 */
export type TabsItemPropType = {
  /**
   * **唯一标识**
   * @type `string`
   * @description 组件唯一标识
   */
  id: string;
  /**
   * **表单项配置**
   * @type [`PaFormItemType`](#paformitemtype)
   * @description 表单项配置
   */
  item: PaFormItemType;
  /**
   * **校验规则**
   * @type `Record<string, `[`FormItemRule`](#formitemrule)` | Array<`[`FormItemRule`](#formitemrule)`>>`
   * @description 校验规则
   */
  rules: Record<string, Array<FormItemRule> | FormItemRule>;
};

/**
 * **插槽项属性类型**
 * @type `object`
 * @description 插槽项组件的属性类型定义
 */
export type SlotItemsPropsType = {
  /**
   * **表单项配置**
   * @type [`PaFormItemType`](#paformitemtype)
   * @description 表单项配置
   */
  item: PaFormItemType;
  /**
   * **表单数据**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 表单数据
   */
  data?: Record<string, string>;
  /**
   * **标签宽度**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 标签宽度
   */
  labelWidth?: number;
};
