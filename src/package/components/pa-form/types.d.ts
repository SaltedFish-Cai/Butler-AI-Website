/**
 * **CellItemType 类型**
 * @description 单元格组件类型定义，涵盖地址、日期、图标、穿梭框等多种单元格组件
 */
import { OtherType, GroupType, TabsType } from "./cell";
/**
 * **单元格类型**
 * @description 来自公共模块的单元格类型定义
 */
import { PaCellType } from "../cell";
/**
 * **选项类型与语言键**
 * @description 表单选项配置及多语言支持
 */
import { PaOptionType, LanguageKey } from "../pa-manager/types";
/**
 * **日期选择器快捷选项类型**
 * @description 日期选择器快捷操作配置
 */
import { DatePickerShortcut } from "../pa-time/types";
/**
 * **穿梭框类型**
 * @description 穿梭框组件类型定义
 */
import { PaTransferType } from "../pa-transfer/types";
export type ComponentProps = {
  /**
   * **多表时唯一ID**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为唯一ID
   */
  id?: string;
  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * **自定义样式**
   * @type `Record<string, string | number>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, number | string>;
  /**
   * **双向绑定外置默认数据**
   * @type `FormDataType` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为默认数据
   */
  data?: FormDataType;
  /**
   * **对比数据**
   * @type `Record<string, any>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   */
  contrastData?: Record<string, any>;
  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示对比数据
   */
  alwaysContrast?: boolean;
  /**
   * **外置选择框选项**
   * @type `PaOptionType.Default` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为外置选择框选项
   */
  exOptions?: PaOptionType.Default;
  /**
   * **是否使用校验**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会使用校验
   */
  useRequired?: boolean;
  /**
   * **是否隐藏Label**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会隐藏Label
   */
  noLabel?: boolean;
  /**
   * **标题宽度**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `number` 时，会使用该值作为标题宽度(像素)
   */
  labelWidth?: number | string;
  /**
   * **Label显示位置**
   * @type `"left"` | `"right"` | `"top"`
   * @default `"top"`
   * @description 当设置该值为 `"left"` 时，标签居左
   */
  labelPosition?: "left" | "right" | "top";
  /**
   * **表单结构**
   * @type `Array<PaFormItemType>`
   * @description 当设置该值时，会使用该值作为表单结构
   */
  structure: Array<PaFormItemType>;
  /**
   * **强制表单不可编辑**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会强制表单不可编辑
   */
  disabled?: boolean;
  /**
   * **纯展示模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   */
  display?: boolean;
  /**
   * **表单额外依赖**
   * @type `PaFormExDependentType` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为表单额外依赖
   */
  exDependent?: PaFormExDependentType;
  /**
   * **单元格额外依赖**
   * @type `PaFormCellExDependentType` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为单元格额外依赖
   */
  exCellDependent?: PaFormCellExDependentType;
  /**
   * **单行最大分栏**
   * @type `1` | `2` | `3` | `4`
   * @default `4`
   * @description 当设置该值为 `1` 时，一行最多显示1栏
   */
  maxSpan?: 1 | 2 | 3 | 4;
  /**
   * **单行强制分栏**
   * @type `1` | `2` | `3` | `4`
   * @default `1`
   * @description 当设置该值为 `1` 时，一行强制显示1栏
   */
  exSpan?: 1 | 2 | 3 | 4;
  /**
   * **当表单单元素数据发生变化时触发**
   * @type `(params: { prop: string; value: Array<number | string> | number | string; oldValue: Array<number | string> | number | string; option: PaOptionType.Select }) => void`
   * @default `undefined`
   * @description 当表单单元素数据发生变化时触发
   */
  onFormCellChange?: (params: {
    prop: string;
    value: Array<number | string> | number | string;
    oldValue: Array<number | string> | number | string;
    option: PaOptionType.Select;
  }) => void;
  /**
   * **当表单数据发生变化时触发**
   * @type `(data: Record<string, any>) => void`
   * @default `undefined`
   * @description 当表单数据发生变化时触发
   */
  onFormDataChange?: (data: Record<string, any>) => void;
};
export type ComponentEmits = {
  (e: "formDataChange", data: Record<string, any>): void;
  (e: "formCellChange", data: { prop: string; value: any; oldValue: any; option: any }): void;
  (e: "onFormStateChange", data: string): void;
};
export type ComponentRef = {
  /**
   * **校验并获取表格数据**
   * @type `() => Promise<Record<string, string> | "no-change" | false | void>`
   * @description 校验并获取表格数据，校验失败返回 false，校验成功返回表格数据，若没有变更则返回 "no-change"
   */
  getSubmitForm: () => Promise<Record<string, string> | "no-change" | false | void>;
  /**
   * **清除表单所有数据**
   * @type `() => void`
   * @description 清除表单所有数据
   */
  clean_All?: () => void;
  /**
   * **替换表单结构**
   * @type `(newConfig: PaFormItemType[]) => void`
   * @description 该方法用于替换表单结构
   * @param newConfig 替换后的表单结构
   */
  setStructure_All: (newConfig: PaFormItemType[]) => void;
  /**
   * **替换表单单个结构**
   * @type `(prop: string, item: PaFormItemType) => void`
   * @description 该方法用于替换表单单个结构
   * @param prop 替换后的表单结构属性名
   * @param item 替换后的表单结构属性值
   */
  setStructureItem: (prop: string, item: PaFormItemType) => void;
  /**
   * **重置表单数据**
   * @type `(data: object) => void`
   * @description 该方法用于重置表单数据
   * @param data 重置后的表单数据
   */
  changeData_All: (data: object) => void;
  /**
   * **重置单个表单数据**
   * @type `(prop: string, data: any) => void`
   * @description 该方法用于重置单个表单数据
   * @param prop 重置后的表单数据属性名
   * @param data 重置后的表单数据属性值
   */
  changeData_Item: (prop: string, data: any) => void;
};
export type ComponentItemProps = {
  /**
   * **表单单元唯一Key**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为表单单元唯一Key
   */
  prop?: string;
  /**
   * **自动划组时使用名**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为自动划组时使用名
   */
  unitName?: LanguagePackageType | string;
  /**
   * **自动划组时提示**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为自动划组时提示
   */
  unitTip?: LanguagePackageType | string;
  /**
   * **表单项标题**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为表单项标题
   */
  label?: LanguagePackageType | string;
  /**
   * **表单项提示**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为表单项提示
   */
  tip?: LanguagePackageType | string;
  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会禁用该表单项
   */
  disabled?: boolean;
  /**
   * **外置校验规则**
   * @type `Array<FormItemRule>` | `boolean`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为外置校验规则
   */
  rules?:
    | Array<{
        required?: boolean;
        message?: LanguagePackageType | string;
      }>
    | boolean;
  /**
   * **单行分栏**
   * @type `1` | `2` | `3` | `4`
   * @default `1`
   * @description 当设置该值为 `1` 时，会显示占行1/4栏
   */
  exSpan?: 1 | 2 | 3 | 4;
  /**
   * **是否必填**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会必填该表单项
   */
  required?: boolean;
  /**
   * **额外样式**
   * @type `{ style?: Record<string, string>; message?: string; class?: string; messageClass?: string; messageStyle?: Record<string, string> }` | `undefined`
   * @default `undefined`
   * @description 设置表单项的额外样式配置
   */
  exStyles?: {
    style?: Record<string, string>;
    message?: string;
    class?: string;
    messageClass?: string;
    messageStyle?: Record<string, string>;
  };
};
type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;
export type PaFormChildType = ComponentItemProps & StrictUnion<OtherType | PaCellType | (PaTransferType & { type: "transfer" })>;
export type PaFormItemType = ComponentItemProps &
  StrictUnion<GroupType | OtherType | PaCellType | TabsType | (PaTransferType & { type: "transfer" })>;
export type ExMultipleConfigType = PaFormItemType & {
  /**
   * **多配置选项**
   * @type `Array<MultipleConfigType>` | `undefined`
   * @default `undefined`
   * @description 多配置选项列表
   */
  inMultipleConfig?: Array<MultipleConfigType>;
  /**
   * **Tab表单配置**
   * @type `Array<PaFormChildType>` | `undefined`
   * @default `undefined`
   * @description Tab表单配置列表
   */
  tabsFormConfig?: Array<PaFormChildType>;
};
export type MultipleConfigType = {
  /**
   * **自动划组时使用名**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 自动划组时使用名称
   */
  unitName?: string;
  /**
   * **自动划组时提示**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 自动划组时提示信息
   */
  unitTip?: string;
  /**
   * **配置列表**
   * @type `Array<PaFormItemType>`
   * @description 配置项列表
   */
  configs: Array<PaFormItemType>;
};
export type PaFormExDependentType = {
  /**
   * **禁用规则**
   * @type `{ [x: string]: (value: any) => boolean }` | `undefined`
   * @default `undefined`
   * @description 设置字段禁用规则
   */
  disabledRule?: { [x: string]: (value: any) => boolean };
  /**
   * **显示规则**
   * @type `{ [x: string]: (value: any) => boolean }` | `undefined`
   * @default `undefined`
   * @description 设置字段显示规则
   */
  displayRule?: { [x: string]: (value: any) => boolean };
  /**
   * **外置表单校验规则**
   * @type `{ [x: string]: Array<{ validator: (params: { rule: any; value: any; callback: any }) => void; trigger: string }> }` | `undefined`
   * @default `undefined`
   * @description 设置表单校验规则
   */
  exCellRules?: {
    [x: string]: Array<{ validator: (params: { rule: any; value: any; callback: any }) => void; trigger: string }>;
  };
};
export type PaFormCellExDependentType = {
  /**
   * **选择器请求Api**
   * @type `{ [x: string]: (params: { query: string }) => Promise<PaOptionType.SelectList> }` | `undefined`
   * @default `undefined`
   * @description 选择器数据请求接口
   */
  select_RequestApi?: { [x: string]: (params: { query: string }) => Promise<PaOptionType.SelectList> };
  /**
   * **文件上传请求Api**
   * @type `{ [x: string]: Record<string, string> }` | `undefined`
   * @default `undefined`
   * @description 文件上传附加数据
   */
  file_attachedData?: { [x: string]: Record<string, string> };
  /**
   * **文件下载模板**
   * @type `{ [x: string]: () => void }` | `undefined`
   * @default `undefined`
   * @description 文件下载模板函数
   */
  file_downloadTemplate?: { [x: string]: () => void };
  /**
   * **时间选择器禁用日期函数**
   * @type `{ [x: string]: (date: any) => boolean }` | `undefined`
   * @default `undefined`
   * @description 时间选择器禁用日期函数
   */
  time_disabledDateFn?: { [x: string]: (date: any) => boolean };
  /**
   * **时间选择器快捷选项**
   * @type `{ [x: string]: Array<DatePickerShortcut> }` | `undefined`
   * @default `undefined`
   * @description 时间选择器快捷选项
   */
  time_shortcuts?: { [x: string]: Array<DatePickerShortcut> };
  /**
   * **点击查看内容函数**
   * @type `{ [x: string]: (prop: string, data: object) => void }` | `undefined`
   * @default `undefined`
   * @description 点击标签回调函数
   */
  clickTagClick?: { [x: string]: (prop: string, data: any) => void };
};
export type ConfigContextType = {
  /**
   * **表单标签宽度**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 表单标签宽度
   */
  labelWidth?: number | string;
  /**
   * **表单标签位置**
   * @type `"left"` | `"right"` | `"top"` | `undefined`
   * @default `undefined`
   * @description 表单标签位置
   */
  labelPosition?: "left" | "right" | "top";
  /**
   * **基础分栏大小**
   * @type `number`
   * @description 基础分栏大小
   */
  baseSpanSize: number;
  /**
   * **分栏大小映射**
   * @type `Record<string, number>`
   * @description 分栏大小映射表
   */
  itemSpanSize: Record<string, number>;
  /**
   * **表单数据**
   * @type `Record<string, any>`
   * @description 表单数据
   */
  data: Record<string, any>;
  /**
   * **对比数据**
   * @type `Record<string, any>`
   * @description 对比数据
   */
  contrastData: Record<string, any>;
  /**
   * **是否一直对比**
   * @type `boolean`
   * @description 是否一直显示对比
   */
  alwaysContrast: boolean;
  /**
   * **是否展示模式**
   * @type `boolean`
   * @description 是否展示模式
   */
  display: boolean;
  /**
   * **语言包**
   * @type `Record<string, string>`
   * @description 语言包配置
   */
  languagePackage: Record<string, string>;
  /**
   * **语言类型**
   * @type `LanguageKey`
   * @description 语言类型
   */
  language: LanguageKey;
  /**
   * **外置选项**
   * @type `PaOptionType.Default`
   * @description 外置选项配置
   */
  exOptions: PaOptionType.Default;
  /**
   * **外置依赖**
   * @type `PaFormExDependentType`
   * @description 外置依赖配置
   */
  exDependent: PaFormExDependentType;
  /**
   * **单元格外置依赖**
   * @type `PaFormCellExDependentType`
   * @description 单元格外置依赖
   */
  exCellDependent: PaFormCellExDependentType;
  /**
   * **是否使用必填校验**
   * @type `boolean`
   * @description 是否使用必填校验
   */
  useRequired: boolean;
  /**
   * **是否隐藏标签**
   * @type `boolean`
   * @description 是否隐藏标签
   */
  noLabel: boolean;
};
export interface FormItemRule {
  /**
   * **验证规则名称**
   * @type `"any"` | `"array"` | `"boolean"` | `"date"` | `"email"` | `"enum"` | `"float"` | `"hex"` | `"integer"` | `"method"` | `"number"` | `"object"` | `"regexp"` | `"string"` | `"url"` | `undefined`
   * @default `undefined`
   * @description 验证规则类型
   */
  type?:
    | "any"
    | "array"
    | "boolean"
    | "date"
    | "email"
    | "enum"
    | "float"
    | "hex"
    | "integer"
    | "method"
    | "number"
    | "object"
    | "regexp"
    | "string"
    | "url";
  /**
   * **是否必填**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 是否必填
   */
  required?: boolean;
  /**
   * **验证错误信息**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 验证失败时的错误信息
   */
  message?: string;
  /**
   * **验证触发方式**
   * @type `"blur"` | `"change"` | `"input"` | `undefined`
   * @default `undefined`
   * @description 验证触发方式
   */
  trigger?: "blur" | "change" | "input";
  /**
   * **最小值**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 最小值
   */
  min?: number;
  /**
   * **最大值**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 最大值
   */
  max?: number;
  /**
   * **长度**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 长度
   */
  len?: number;
  /**
   * **正则表达式**
   * @type `RegExp` | `undefined`
   * @default `undefined`
   * @description 正则表达式验证
   */
  pattern?: RegExp;
  /**
   * **自定义验证函数**
   * @type `(params: { rule: FormItemRule; value: any; callback: (error?: string) => void }) => Promise<void> | void`
   * @default `undefined`
   * @description 自定义验证函数
   */
  validator?: (params: { rule: FormItemRule; value: any; callback: (error?: string) => void }) => Promise<void> | void;
  /**
   * **枚举值**
   * @type `Array<boolean | number | string | null | undefined>` | `undefined`
   * @default `undefined`
   * @description 枚举值列表
   */
  enum?: Array<boolean | number | string | null | undefined>;
  /**
   * **转换值**
   * @type `(value: any) => any` | `undefined`
   * @default `undefined`
   * @description 转换值函数
   */
  transform?: (value: any) => any;
}
export type FormDataType = Record<string, any> & {
  /**
   * **表单名称**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 表单名称
   */
  name?: string;
  /**
   * **是否有错误**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 是否有错误
   */
  isError?: boolean;
};
export type GroupItemPropsType = {
  /**
   * **唯一标识**
   * @type `string`
   * @description 唯一标识
   */
  id: string;
  /**
   * **表单项配置**
   * @type `PaFormItemType`
   * @description 表单项配置
   */
  item: PaFormItemType;
};
export type TabsItemPropType = {
  /**
   * **唯一标识**
   * @type `string`
   * @description 唯一标识
   */
  id: string;
  /**
   * **Tab表单项配置**
   * @type `PaFormItemType`
   * @description Tab表单项配置
   */
  item: PaFormItemType;
  /**
   * **校验规则**
   * @type `Record<string, FormItemRule | Array<FormItemRule>>`
   * @description 校验规则
   */
  rules: Record<string, Array<FormItemRule> | FormItemRule>;
};
export type SlotItemsPropsType = {
  /**
   * **表单项配置**
   * @type `PaFormItemType`
   * @description 表单项配置
   */
  item: PaFormItemType;
  /**
   * **数据**
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
