/**
 * **日期类型**
 * @description 来自 m-elements 模块的日期组件类型
 */
import { MElementDateType } from "../m-elements/time/index";
/**
 * **图标类型**
 * @description 来自 m-elements 模块的图标组件类型
 */
import { MElementIconType } from "../m-elements/icon/index";
/**
 * **地址类型**
 * @description 来自 m-elements 模块的地址组件类型
 */
import { MElementAddressType } from "../m-elements/address/index";
/**
 * **穿梭框类型**
 * @description 来自 m-elements 模块的穿梭框组件类型
 */
import { MElementTransferType } from "../m-elements/transfer/index";
/**
 * **级联选择器类型**
 * @description 来自 m-cascader 模块的类型
 */
import { MCascaderType } from "../m-cascader/type";
/**
 * **复选框类型**
 * @description 来自 m-checkbox 模块的类型
 */
import { MCheckboxType } from "../m-checkbox/type";
/**
 * **单选框类型**
 * @description 来自 m-radio 模块的类型
 */
import { MRadioType } from "../m-radio/type";
/**
 * **选择器类型**
 * @description 来自 m-select 模块的类型
 */
import { MSelectType } from "../m-select/type";
/**
 * **开关类型**
 * @description 来自 m-switch 模块的类型
 */
import { MSwitchType } from "../m-switch/type";
/**
 * **文件类型**
 * @description 来自 m-file 模块的类型
 */
import { MFileType } from "../m-file/type";
/**
 * **数字输入框类型**
 * @description 来自 m-number 模块的类型
 */
import { MNumberType } from "../m-number/type";
/**
 * **输入框类型**
 * @description 来自 m-input 模块的类型
 */
import { MInputType } from "../m-input/type";
/**
 * **表单子项类型**
 * @description 表单子项组件类型定义
 */
import { PaFormChildType } from "./types";
/**
 * **选项类型和多语言类型**
 * @description 表单选项配置及多语言支持
 */
import { PaOptionType, LanguagePackageType } from "../pa-manager/types";
/**
 * **单元格项类型**
 * @description 涵盖所有单元格组件的类型联合
 */
export type CellItemType =
  | MElementAddressType
  | MElementDateType
  | MElementIconType
  | MElementTransferType
  | (MCascaderType & {
      prop?: string;
      type: "cascader-check" | "cascader" | "multiple-cascader-check" | "multiple-cascader";
      displayProp?: string;
      options?: PaOptionType.SelectList;
    })
  | (MCheckboxType & { prop?: string; type: "checkbox"; options?: PaOptionType.SelectList })
  | (MFileType & { prop?: string; type: "file"; fileAttached?: Record<string, string> })
  | (MInputType & { prop?: string; type: "input" | "textarea" })
  | (MNumberType & { prop?: string; type: "number"; clearOnValue?: number })
  | (MRadioType & { prop?: string; type: "radio"; options?: PaOptionType.SelectList })
  | (MSelectType & {
      prop?: string;
      type:
        | "multiple-online-select"
        | "multiple-request-select"
        | "multiple-select"
        | "online-select"
        | "request-select"
        | "select";
      displayProp?: string;
      requestBy?: string;
      options?: PaOptionType.SelectList;
    })
  | (MSwitchType & { prop?: string; type: "switch"; options?: PaOptionType.SelectList });
type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;
/**
 * **其他类型**
 * @description 非标准单元格组件类型，如地址、标签、空槽等
 */
export type OtherType = {
  /**
   * **类型标识**
   * @type `"address"` | `"clickTag"` | `"null"` | `"slot"` | `"tag"` | `undefined`
   * @default `undefined`
   * @description 组件类型
   */
  type?: "address" | "clickTag" | "null" | "slot" | "tag";
  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 禁用状态
   */
  disabled?: boolean;
  /**
   * **是否展示**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 展示状态
   */
  display?: boolean;
};
/**
 * **组配置类型**
 * @description 组内表单配置类型
 */
type GroupFromConfigType = PaFormChildType & {
  /**
   * **多语言表单项标题**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为时，会使用该值作为表单项标题
   */
  label?: LanguagePackageType | string;
  /**
   * **值**
   * @type `boolean` | `number` | `string`
   * @description 默认值
   */
  value: boolean | number | string;
  /**
   * **子标签**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 子标签文本
   */
  childLabel?: string;
};
/**
 * **组类型**
 * @description 表单分组组件类型
 */
export type GroupType = {
  /**
   * **类型标识**
   * @type `"group"` | `undefined`
   * @default `undefined`
   * @description 组件类型
   */
  type?: "group";
  /**
   * **组表单配置**
   * @type `Array<GroupFromConfigType>` | `undefined`
   * @default `undefined`
   * @description 组内表单配置列表
   */
  groupFormConfig?: Array<GroupFromConfigType>;
  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 禁用状态
   */
  disabled?: boolean;
  /**
   * **是否展示**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 展示状态
   */
  display?: boolean;
};
/**
 * **标签页类型**
 * @description 表单标签页组件类型
 */
export type TabsType = {
  /**
   * **类型标识**
   * @type `"tabs-form"` | `undefined`
   * @default `undefined`
   * @description 组件类型
   */
  type?: "tabs-form";
  /**
   * **标题键名**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 分栏tab标题使用字段
   */
  titleKey?: string;
  /**
   * **标题标签**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 多语言tab标题使用字段
   */
  titleLabel?: LanguagePackageType | string;
  /**
   * **标签页表单配置**
   * @type `Array<PaFormChildType>` | `undefined`
   * @default `undefined`
   * @description 标签页内表单配置列表
   */
  tabsFormConfig?: Array<PaFormChildType>;
  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 禁用状态
   */
  disabled?: boolean;
  /**
   * **对比键名**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 对比使用的键名
   */
  contrastKey?: string;
  /**
   * **对比使用字段**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 对比使用的字段
   */
  contrastUse?: string;
};
