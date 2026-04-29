/**
 * @module pa-transfer
 * @description 穿梭框组件类型定义
 */
import type { PaOptionType } from "../manager-type";

/**
 * PaTransfer 组件 Props 类型定义
 */
export type TransferProps = {
  /** 组件唯一标识 */
  id?: string;
  /** 自定义类名 */
  class?: Array<string> | string;
  /** 自定义样式 */
  style?: Record<string, string | number>;
  /** 双向绑定值 */
  modelValue?: Array<boolean | number | string>;
  /** 纯展示数据 */
  displayValue?: string;
  /** 外置数据选项 */
  exOptions?: PaOptionType.SelectList;
  /** 选项 Key */
  optionKey?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 纯展示模式 */
  display?: boolean;
  /** 是否使用搜索 */
  useSearch?: boolean;
  /** 对比数据 */
  contrastData?: Array<number | string> | number | string;
  /** 是否显示对比数据 */
  alwaysContrast?: boolean;
};

/**
 * PaTransfer 组件 Props
 */
export type ComponentProps = TransferProps;

/**
 * PaTransfer 组件 Emits
 */
export type ComponentEmits = {
  (e: "update:modelValue", value: Array<boolean | number | string>): void;
  (e: "change", payload: { value: Array<boolean | number | string>; oldValue: Array<boolean | number | string> }): void;
  (e: "remoteMethod", query: string): void;
};
