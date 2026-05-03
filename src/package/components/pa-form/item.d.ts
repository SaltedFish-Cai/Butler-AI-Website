/**
 * 表单子项类型
 * @description 表单子项组件相关类型定义
 */
import { PaFormItemType } from "./types";
/**
 * 组项属性类型
 * @description 组项组件的属性类型定义
 * @type object
 */
export type GroupItemPropsType = {
  /**
   * 唯一标识
   * @type string
   * @description 组件唯一标识
   */
  id: string;
  /**
   * 表单项配置
   * @type PaFormItemType
   * @description 表单项配置
   */
  item: PaFormItemType;
};
/**
 * 标签页项属性类型
 * @description 标签页项组件的属性类型定义
 * @type object
 */
export type TabsItemPropType = {
  /**
   * 唯一标识
   * @type string
   * @description 组件唯一标识
   */
  id: string;
  /**
   * 表单项配置
   * @type PaFormItemType
   * @description 表单项配置
   */
  item: PaFormItemType;
  /**
   * 校验规则
   * @type Record<string, FormItemRule | Array<FormItemRule>>
   * @description 校验规则
   */
  rules: Record<string, FormItemRule | Array<FormItemRule>>;
};
/**
 * 插槽项属性类型
 * @description 插槽项组件的属性类型定义
 * @type object
 */
export type SlotItemsPropsType = {
  /**
   * 表单项配置
   * @type PaFormItemType
   * @description 表单项配置
   */
  item: PaFormItemType;
  /**
   * 数据
   * @type Record<string, string> | `undefined`
   * @default undefined
   * @description 表单数据
   */
  data?: Record<string, string>;
  /**
   * 标签宽度
   * @type number | `undefined`
   * @default undefined
   * @description 标签宽度
   */
  labelWidth?: number;
};
