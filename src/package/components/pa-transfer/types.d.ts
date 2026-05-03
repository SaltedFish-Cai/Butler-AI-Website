/**
 * @module pa-transfer
 * @description 穿梭框组件类型定义
 */
/**
 * 选项类型
 * @description 选项类型
 */
import type { PaOptionType } from "../manager-type";
/**
 * PaTransfer 组件 Props
 * @type {ComponentProps}
 * @description 穿梭框组件的属性类型
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string | number> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, number | string>;
  /**
   * 双向绑定值
   * @type Array<boolean | number | string> | undefined
   * @default undefined
   * @description 当设置该值时，会绑定该值
   */
  modelValue?: Array<boolean | number | string>;
  /**
   * 纯展示数据
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会显示该值
   */
  displayValue?: string;
  /**
   * 外置数据选项
   * @type PaOptionType.SelectList | undefined
   * @default undefined
   * @description 当设置该值时，会使用该值作为配置数据
   */
  exOptions?: PaOptionType.SelectList;
  /**
   * 选项 Key
   * @type string | undefined
   * @default "value"
   * @description 当设置该值时，会使用该值作为选项的 Key
   */
  optionKey?: string;
  /**
   * 占位符
   * @type string | undefined
   * @default "请选择"
   * @description 当设置该值时，会使用该值作为占位字符串
   */
  placeholder?: string;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default false
   * @description 当设置该值为 `true` 时，会禁用该组件
   */
  disabled?: boolean;
  /**
   * 纯展示模式
   * @type boolean | undefined
   * @default false
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   */
  display?: boolean;
  /**
   * 是否使用搜索
   * @type boolean | undefined
   * @default false
   * @description 当设置该值为 `true` 时，会使用搜索功能
   */
  useSearch?: boolean;
  /**
   * 对比数据
   * @type Array<boolean | number | string> | undefined
   * @default undefined
   * @description 当设置该值时，会使用该值作为对比数据
   */
  contrastData?: Array<boolean | number | string>;
  /**
   * 是否显示对比数据
   * @type boolean | undefined
   * @default false
   * @description 当设置该值为 `true` 时，会显示对比数据
   */
  alwaysContrast?: boolean;
};
/**
 * PaTransfer 组件 Emits
 * @type {ComponentEmits}
 * @description 穿梭框组件的事件类型
 */
export type ComponentEmits = {
  (e: "update:modelValue", value: Array<boolean | number | string>): void;
  (e: "change", payload: { value: Array<boolean | number | string>; oldValue: Array<boolean | number | string> }): void;
  (e: "remoteMethod", query: string): void;
};
