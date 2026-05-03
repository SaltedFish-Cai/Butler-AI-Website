/**
 * @module pa-manager
 * @description 全局配置组件类型定义
 */
/**
 * 语言键类型
 * @description 语言键类型
 */
import type { LanguageKey } from "../manager-type";
/**
 * API 配置类型
 * @type {ApiType}
 * @description API 请求的配置结构
 */
export type ApiType = {
  /**
   * API URL
   * @type `string`
   * @description API URL
   */
  url: string;
  /**
   * API 类型
   * @type `string`
   * @description API 类型
   */
  type: string;
};
/**
 * 条件类型
 * @type {ConditionalType}
 * @description 高级查询中的条件选项
 */
export type ConditionalType = {
  /**
   * 值
   * @type `string`
   * @description 值
   */
  Value: string;
  /**
   * 描述
   * @type `string`
   * @description 描述
   */
  Description: string;
  /**
   * 字典解释
   * @type `string`
   * @description 字典解释
   */
  DictionaryExplanation: string;
  /**
   * 描述英文
   * @type `string`
   * @description 描述英文
   */
  DescriptionEn: string;
};
/**
 * 全局配置基础类型
 * @type {PancakeGlobal}
 * @description 全局配置的基础属性
 */
export type PancakeGlobal = {
  /**
   * 环境
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义环境
   */
  env?: string;
  /**
   * API 基础 URL
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义 API 基础 URL
   */
  baseHost?: string;
  /**
   * 主题颜色
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义主题颜色
   */
  themeColor?: string;
  /**
   * 是否为暗黑模式
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义暗黑模式
   */
  isDark?: boolean;
  /**
   * 组件尺寸
   * @type `"default"` | `"large"` | `"small"` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义组件尺寸
   */
  size?: "default" | "large" | "small";
  /**
   * 表格配置
   * @type `object` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义表格配置
   */
  table_config?: {
    groupAdvancedQueryApi?: ApiType | { FilterLinkNextType: Array<ConditionalType> };
    advancedQueryApi?:
      | ApiType
      | { ConditionalType: Array<ConditionalType>; SqlJoinType: Array<ConditionalType>; LineConditional: Array<ConditionalType> };
    useSeniorFilter?: boolean;
    infiniteScroll?: boolean;
  };
  /**
   * 地址 API 配置
   * @type `ApiType` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义地址 API
   */
  address_config?: ApiType;
  /**
   * 文件 API 配置
   * @type `ApiType & { downloadHose: string; compareKey: string }` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义文件 API
   */
  file_config?: ApiType & { downloadHose: string; compareKey: string };
  /**
   * 请求头
   * @type `any` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义请求头
   */
  requestHeader?: any;
};
/**
 * PaManager 组件 Props
 * @type {ComponentProps}
 * @description 全局配置组件的属性类型
 */
export type ComponentProps = PancakeGlobal & {
  /**
   * 语言
   * @type `LanguageKey` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义语言
   */
  language?: LanguageKey;
  /**
   * 自定义类名
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type `Record<string, string | number>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, number | string>;
  /**
   * 组件唯一标识
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
};
/**
 * 全局配置运行时类型
 * @type {PancakeGlobalConfigType}
 * @description 全局配置运行时的状态类型
 */
export type PancakeGlobalConfigType = PancakeGlobal & {
  /**
   * 语言配置
   * @type `{ value: LanguageKey; package: Record<string, Record<string, string>> }` | `undefined`
   * @default `undefined`
   * @description 语言的值和对应的语言包
   */
  language?: {
    value: LanguageKey;
    package: Record<string, Record<string, string>>;
  };
};
