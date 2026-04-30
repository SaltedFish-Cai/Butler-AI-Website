/**
 * @description 导入类型定义
 * */
import { PaStructureType, PaOptionType } from "M_Types";
import { PaPlaygroundPageButtonType } from "./components/types";
import { LanguagePackageType } from "../manager-type";

/**
 * @description 接口配置类型
 * @type `object`
 * */
export type MInterfaceConfig = {
  /** @type `string` @default `undefined` @description 接口唯一标识 */
  id: string;
  /** @type `string` @default `undefined` @description 接口名称 */
  name: string;
  /** @type `string` @default `undefined` @description API 请求地址 */
  apiUrl: string;
  /** @type `"delete" | "get" | "post" | "put"` @default `undefined` @description API 请求类型 */
  apiType: "delete" | "get" | "post" | "put";
  /** @type `string` @default `undefined` @description 数据结构标识 */
  dataStructure: string;
  /** @type `Array<string>` @default `undefined` @description 请求参数列表 */
  requestParameters?: Array<string>;
};

/**
 * @description 选项类型
 * @type `object`
 * */
export type MOptionsType = {
  /** @type `string` @default `undefined` @description 选项唯一标识 */
  id: string;
  /** @type `string` @default `undefined` @description 选项描述 */
  description: string;
  /** @type `"interface" | "select" | "switch"` @default `undefined` @description 选项类型 */
  OptionsType: "interface" | "select" | "switch";
  /** @type `PaOptionType.SelectList | PaOptionType.Switch` @default `undefined` @description 选项配置 */
  config: PaOptionType.SelectList | PaOptionType.Switch;
  /** @type `string` @default `undefined` @description 字典类型 */
  dictionaryType?: string;
  /** @type `string` @default `undefined` @description 字典键名 */
  dictionaryKey?: string;
  /** @type `string` @default `undefined` @description 列名 */
  columnName?: string;
  /** @type `string` @default `undefined` @description 表名 */
  tableName?: string;
};

/**
 * @description 结构类型项
 * @type `object`
 * */
export type MStructureTypeItem = {
  /** @type `string` @default `undefined` @description 唯一标识 */
  id: string;
  /** @type `string` @default `undefined` @description 属性名 */
  prop: string;
  /** @type `string` @default `undefined` @description 描述 */
  description: string;
  /** @type `LanguagePackageType` @default `undefined` @description 标签 */
  label: LanguagePackageType;
  /** @type `any` @default `undefined` @description 其他属性 */
  [x: string]: any;
};

/**
 * @description 结构类型
 * @type `object`
 * */
export type MStructureType = {
  /** @type `string` @default `undefined` @description 唯一标识 */
  id: string;
  /** @type `string` @default `undefined` @description 描述 */
  description: string;
  /** @type `string` @default `undefined` @description 索引键名 */
  indexKey: string;
  /** @type `Array<MStructureTypeItem>` @default `undefined` @description 配置项列表 */
  config: Array<MStructureTypeItem>;
};

/**
 * @description Playground 项目类型
 * @type `object`
 * */
export type PaPlaygroundItem = {
  /** @type `string` @default `undefined` @description 项目唯一标识 */
  itemId: string;
  /** @type `number` @default `undefined` @description 宽度 */
  width: number;
  /** @type `number` @default `undefined` @description 高度 */
  height: number;
  /** @type `"form" | "table" | "tabs"` @default `undefined` @description 项目类型 */
  type: "form" | "table" | "tabs";
  /** @type `Array<PaStructureType.FormV2> | Array<PaStructureType.TableV2>` @default `undefined` @description 结构配置 */
  structure: Array<PaStructureType.FormV2 & { [x: string]: any }> | Array<PaStructureType.TableV2 & { [x: string]: any }>;
  /** @type `Array<PaPlaygroundPageButtonType>` @default `undefined` @description 操作按钮列表 */
  actionButtons: Array<PaPlaygroundPageButtonType>;
  /** @type `Record<string, string>` @default `undefined` @description 扩展选项映射 */
  exOptions: Record<string, string>;
  /** @type `string` @default `undefined` @description 源数据表名 */
  sourceTable: string;
  /** @type `string` @default `undefined` @description 操作 API 标识 */
  actionApi?: string;
  /** @type `LanguagePackageType | object` @default `undefined` @description 标题 */
  title?: LanguagePackageType | object;
  /** @type `Record<string, any>` @default `undefined` @description 其他属性 */
  otherProps?: Record<string, any>;
};

/**
 * @description Playground 页面类型
 * @type `object`
 * */
export type PaPlaygroundPagesType = {
  /** @type `string` @default `undefined` @description 页面唯一标识 */
  pageId: string;
  /** @type `string` @default `undefined` @description 页面名称 */
  name: string;
  /** @type `number` @default `undefined` @description X 坐标 */
  x: number;
  /** @type `number` @default `undefined` @description Y 坐标 */
  y: number;
  /** @type `Array<PaPlaygroundItem>` @default `undefined` @description 项目配置列表 */
  itemConfigs: Array<PaPlaygroundItem>;
};

/**
 * @description Playground 数据类型
 * @type `object`
 * */
export type PaPlaygroundType = {
  /** @type `string` @default `undefined` @description 唯一标识 */
  id: string;
  /** @type `string` @default `undefined` @description 名称 */
  name: string;
  /** @type `string` @default `undefined` @description 描述 */
  description?: string;
  /** @type `string` @default `undefined` @description 管理索引 */
  adminIndex?: string;
  /** @type `number` @default `undefined` @description 管理 X 坐标 */
  adminX: number;
  /** @type `number` @default `undefined` @description 管理 Y 坐标 */
  adminY: number;
  /** @type `number` @default `undefined` @description 管理缩放比例 */
  adminScale: number;
  /** @type `Array<PaPlaygroundPagesType>` @default `undefined` @description 页面配置列表 */
  pagesConfigs: Array<PaPlaygroundPagesType>;
  /** @type `Array<MInterfaceConfig>` @default `undefined` @description 接口配置列表 */
  interfaceConfigs: Array<MInterfaceConfig>;
  /** @type `Array<MStructureType>` @default `undefined` @description 数据结构列表 */
  dataStructures: Array<MStructureType>;
  /** @type `Array<MOptionsType>` @default `undefined` @description 扩展选项列表 */
  exOptions: Array<MOptionsType>;
};

/**
 * @description Playground 操作函数类型
 * @type `object`
 * */
export type PaPlaygroundActionFunctionType = {
  /** @type `any` @default `undefined` @description 执行方法 */
  executionMethod: any;
  /** @type `Array<object>` @default `undefined` @description 执行依赖项 */
  executionDependencies: Array<{
    /** @type `LanguagePackageType` @default `undefined` @description 标签 */
    label: LanguagePackageType;
    /** @type `string` @default `undefined` @description 键名 */
    key: string;
    /** @type `"input" | "select"` @default `undefined` @description 类型 */
    type: "input" | "select";
    /** @type `PaOptionType.SelectList` @default `undefined` @description 扩展选项 */
    exOptions?: PaOptionType.SelectList;
    /** @type `string` @default `undefined` @description 显示键名 */
    showByKey?: string;
    /** @type `string` @default `undefined` @description 显示值 */
    showByValue?: string;
  }>;
};

/**
 * @description Playground 组件属性类型
 * @type `object`
 * */
export type ComponentProps = {
  /** @type `string` @default `undefined` @description 组件唯一标识 */
  id?: string;
  /** @type `string` @default `undefined` @description 自定义类名 */
  class?: string;
  /** @type `Record<string, string>` @default `undefined` @description 自定义样式 */
  style?: Record<string, string>;
  /** @type `PaPlaygroundType` @default `{}` @description 配置数据 */
  data?: PaPlaygroundType;
  /** @type `any` @default `undefined` @description 请求函数 */
  requestFunction?: any;
  /** @type `Array<PaOptionType.Select & PaPlaygroundActionFunctionType>` @default `undefined` @description 操作函数数组 */
  actionFunction?: Array<PaOptionType.Select & PaPlaygroundActionFunctionType>;
  /** @type `Array<PaStructureType.TableV2>` @default `undefined` @description 授权函数数组 */
  authorizationFunction?: Array<PaStructureType.TableV2>;
  /** @type `(data: any) => boolean` @default `undefined` @description 可见性判断函数 */
  visibleBefore?: (data: any) => boolean;
  /** @type `(data: any) => boolean` @default `undefined` @description 操作前判断函数 */
  actionBefore?: (data: any) => boolean;
};

/**
 * @description 表单类型
 * @type `object`
 * */
export type useFormType = {
  /** @type `string` @default `undefined` @description 提交地址 */
  submitUrl?: string;
};

/**
 * @description 表格类型
 * @type `object`
 * */
export type useTableType = {
  /** @type `string` @default `undefined` @description 获取表格数据地址 */
  getTableDataUrl?: string;
};
