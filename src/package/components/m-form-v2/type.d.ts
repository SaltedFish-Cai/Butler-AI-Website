import { OtherType, GroupType, TabsType } from "./cell";
import { MCellV2Type } from "../cell";
import { MOptionV2Type } from "../manager-type";
import { DatePickerShortcut } from "../m-time-v2/type";
import { MTransferV2Type } from "../m-transfer-v2/type";

type languageKey = "en-US" | "zh-CN";

export type MFormV2Props = {
  /**
   * **多表时唯一ID**
   * @type `string`
   * @description 当设置该值时，会使用该值作为唯一ID
   * @example
   * ```ts
   * <m-form-v2 id="form" />
   * ```
   * */
  id: string;

  /**
   * **自定义类名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  class?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **双向绑定外置默认数据**
   * @type `object`
   * @description 当设置该值时，会使用该值作为默认数据
   * @example
   * ```ts
   * <m-form-v2 v-model:value={{ name: "张三", age: 18 }} />
   * ```
   * */
  data?: FormDataType;

  /**
   * **对比数据**
   * @type `object`
   * @description 当设置该值时，会使用该值作为对比数据
   * @example
   * ```ts
   * <m-form-v2 contrastData={{ name: "张三", age: 18 }} />
   * ```
   * */
  contrastData?: {};

  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，不会显示对比数据
   * @default false
   * @example
   * ```ts
   * <m-form-v2 showContrastData />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **外置选择框选项**
   * @type `MOptionV2Type.Default`
   * @description 当设置该值时，会使用该值作为外置选择框选项
   * */
  exOptions?: MOptionV2Type.Default;

  /**
   * **是否使用校验**
   * @type `boolean`
   * @default true
   * @description 当设置该值为 `true` 时，会使用校验
   * @description 当设置该值为 `false` 时，不会使用校验
   * @default true
   * @example
   * ```ts
   * <m-form-v2 useRequired />
   * ```
   * */
  useRequired?: boolean;

  /**
   * **是否隐藏Label**
   * @type `boolean`
   * @default false
   * @description 当设置该值为 `true` 时，会隐藏Label
   * @description 当设置该值为 `false` 时，不会隐藏Label
   * @default false
   * @example
   * ```ts
   * <m-form-v2 noLabel />
   * ```
   * */
  noLabel?: boolean;

  /**
   * **标题宽度(`labelPosition="left"`时生效)**
   * @type `number` | `string`
   * @description 当设置该值为 `number` 时，会使用该值作为标题宽度
   * @description 当设置该值为 `string` 时，会使用该值作为标题宽度
   * @example
   * ```ts
   * <m-form-v2 labelWidth="100px" />
   * ```
   * */
  labelWidth?: number | string;

  /**
   * **Label显示位置**
   * @type `"left"` | `"top"`
   * @description 当设置该值为 `"left"` 时，会使用该值作为Label显示位置
   * @description 当设置该值为 `"top"` 时，会使用该值作为Label显示位置
   * @default 'top'
   * @example
   * ```ts
   * <m-form-v2 labelPosition="left" />
   * ```
   * */
  labelPosition?: "left" | "right" | "top";

  /**
   * **表单结构**
   * @type `Array<MFormV2ItemType>`
   * @description 当设置该值为 `Array<MFormV2ItemType>` 时，会使用该值作为表单结构
   * @example
   * ```ts
   * <m-form-v2 structure={[{ label: "姓名", prop: "name" }]} />
   * ```
   * */
  structure: Array<MFormV2ItemType>;

  /**
   * **强制表单不可编辑**
   * @type `boolean`
   * @description 当设置该值为 `true` 时，会强制表单不可编辑
   * @description 当设置该值为 `false` 时，不会强制表单不可编辑
   * @default false
   * @example
   * ```ts
   * <m-form-v2 disabled />
   * ```
   * */
  disabled?: boolean;

  /**
   * **纯展示模式**
   * @type `boolean`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @default false
   * @example
   * ```ts
   * <m-form-v2 display />
   * ```
   * */
  display?: boolean;

  /**
   * **表单额外依赖**
   * @type `MFormV2ExDependentType`
   * @description 当设置该值时，会使用该值作为表单额外依赖
   * @example
   * ```ts
   * <m-form-v2 exDependent={{ disabledRule: { name: (value) => value === "张三" } }} />
   * ```
   * */
  exDependent?: MFormV2ExDependentType;

  /**
   * **单元格额外依赖**
   * @type `MFormV2CellExDependentType`
   * @type `MFormV2CellExDependentType.select_RequestApi` 为 `(params: { query: string }) => Promise<Array<MOptionV2Type.Select>>`
   * @type `MFormV2CellExDependentType.file_attachedData` 为 `{ [x: string]: Record<string, string> }`
   * @type `MFormV2CellExDependentType.time_disabledDateFn` 为 `(date: any) => boolean`
   * @type `MFormV2CellExDependentType.time_shortcuts` 为 `DatePickerShortcut[]`
   * @description 当设置该值时，会使用该值作为单元格额外依赖
   * @example
   * ```ts
   * <m-table :exCellDependent="exCellDependent"></m-table>
   * ```
   * */
  exCellDependent?: MFormV2CellExDependentType;

  /**
   * **单行最大分栏**
   * @type 1 | 2 | 3 | 4
   * @description 当设置该值为 `1` 时，一行最多显示1栏
   * @description 当设置该值为 `2` 时，一行最多显示2栏
   * @description 当设置该值为 `3` 时，一行最多显示3栏
   * @description 当设置该值为 `4` 时，一行最多显示4栏
   * @default 1
   * @example
   * ```ts
   * <m-form-v2 maxSpan="1" />
   * ```
   * */
  maxSpan?: 1 | 2 | 3 | 4;

  /**
   * **单行强制分栏**
   * @type 1 | 2 | 3 | 4
   * @description 当设置该值为 `1` 时，一行强制显示1栏
   * @description 当设置该值为 `2` 时，一行强制显示2栏
   * @description 当设置该值为 `3` 时，一行强制显示3栏
   * @description 当设置该值为 `4` 时，一行强制显示4栏
   * @default 1
   * @example
   * ```ts
   * <m-form-v2 exSpan="1" />
   * ```
   * */
  exSpan?: 1 | 2 | 3 | 4;

  /**
   * **当表单 `单元素` 数据发生变化时触发**
   * @type `(prop, value) => void`
   * @type `prop` `string` 表单结构唯一Key
   * @type `value` `Array<number | string>` | `number` | `string` `单元素`数据
   * @type `oldValue` `Array<number | string>` | `number` | `string` `单元素`旧数据
   * @type `option` `MOptionV2Type.Select` 表单结构项
   * @description 当设置该值为 `(prop, value, oldValue) => void` 时，会使用该值作为回调函数
   * @example
   * ```ts
   * <m-form-v2 @formCellChange={({prop, value, oldValue, option}) => { console.log(prop, value, oldValue, option) }} />
   * ```
   * */
  onFormCellChange?: ({ prop, value, oldValue, option }) => void;

  /**
   * **当表单 `单元素` 数据发生变化时触发**
   * @type `(data) => void`
   * @type `data` `Record<string, any>` 表单数据
   * @description 当设置该值为 `(data) => void` 时，会使用该值作为回调函数
   * @example
   * ```ts
   * <m-form-v2 @formDataChange={(data) => { console.log("formDataChange", data) }} />
   * ```
   * */
  onFormDataChange?: (data) => void;
};

type BaseType = {
  /**
   * ** 表单单元唯一Key**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为表单单元唯一Key
   * */
  prop?: string;

  /**
   * **自动划组时使用名**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为自动划组时使用名
   * */
  unitName?: Record<languageKey, string> | string;

  /**
   * **自动划组时提示**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为自动划组时提示
   * */
  unitTip?: Record<languageKey, string> | string;

  /**
   * **表单项标题**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标题
   * */
  label?: Record<languageKey, string> | string;

  /**
   * **表单项提示**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项提示
   * */
  tip?: Record<languageKey, string> | string;

  /**
   * **是否禁用**
   * @type `boolean`
   * @description 当设置该值为 `true` 时，会禁用该表单项
   * @description 当设置该值为 `false` 时，不会禁用该表单项
   * @default false
   * */
  disabled?: boolean;

  /**
   * **外置校验规则**
   * @type `Array<FormItemRule>` | `string`
   * @description 当设置该值为 `Array<FormItemRule>` 时，会使用该值作为外置校验规则
   * @description 当设置该值为 `string` 时，会使用该值作为外置校验规则
   * @example
   * ```ts
   * <MoForm rules={[{ required: true, message: "必填项" }]} />
   * ```
   * */
  rules?:
    | Array<{
        required?: boolean;
        message?: Record<languageKey, string> | string;
      }>
    | boolean;

  /**
   * **单行分栏**
   * @type 1 | 2 | 3 | 4
   * @description 当设置该值为 `1` 时，会显示占行1/4栏
   * @description 当设置该值为 `2` 时，会显示占行2/4栏
   * @description 当设置该值为 `3` 时，会显示占行3/4栏
   * @description 当设置该值为 `4` 时，会显示占行4/4栏
   * @default 1
   * */
  exSpan?: 1 | 2 | 3 | 4;

  /**
   * **是否必填**
   * @type `boolean`
   * @description 当设置该值为 `true` 时，会必填该表单项
   * @description 当设置该值为 `false` 时，不会必填该表单项
   * @default false
   * */
  required?: boolean;

  /**
   * **跨栏数**
   * @type 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
   * @default undefined
   * */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  /**
   * **额外样式**
   * @type `Record<string, string>`
   * @description 当设置该值为 `Record<string, string>` 时，会使用该值作为额外样式
   * */
  exStyles?: {
    style?: Record<string, string>;
    message?: string;
    class?: string;
    messageClass?: string;
    messageStyle?: Record<string, string>;
  };
};

export type MFormV2ChildType = BaseType & StrictUnion<MCellV2Type | OtherType | (MTransferV2Type & { type: "transfer" })>;
export type MFormV2ItemType = BaseType &
  StrictUnion<GroupType | MCellV2Type | OtherType | TabsType | (MTransferV2Type & { type: "transfer" })>;

export type MFormV2Ref = {
  /**
   * **校验并获取表格数据**
   * @type `() => Record<string, string> | false | "no-change"`
   * @description 当设置该值为 `() => Record<string, string> | false | "no-change"` 时，会使用该值作为回调函数
   * @description 当设置执行参数值为 `check` 时，会执行数据对比，如果对数据无变化，则会返回 `"no-change"`
   * @description 当设置执行参数值为 `undefined` 时，会执行数据校验，如果校验通过，则会返回表格数据
   * @description 当设置执行参数值为 `undefined` 时，会执行数据校验，如果校验失败，则会返回 `false`
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.getSubmitForm()  // 校验并获取表格数据
   * ```
   * */
  getSubmitForm: () => Record<string, string> | "no-change" | false;

  /**
   * **清除表单所有数据**
   * @type `() => void`
   * @description 当设置该值为 `() => void` 时，会使用该值作为回调函数
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.clean_All()  // 清除表单所有数据
   * ```
   * */
  clean_All?: () => void;

  /**
   * **替换表单结构**
   * @type `(newConfig: MStructureType.FormV2[]) => void`
   * @description 该方法用于替换表单结构，支持替换整个表单结构。
   * @param newConfig 替换后的表单结构
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.resetStructure([])
   * ```
   * */
  setStructure_All: (newConfig: MFormV2ItemType[]) => void;
  /**
   * **替换表单结构**
   * @type `(prop: string, item: MStructureType.FormV2) => void`
   * @description 该方法用于替换表单结构，支持替换整个表单结构。
   * @param prop 替换后的表单结构
   * @param item 替换后的表单结构
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.setStructureItem("prop", {})
   * ```
   * */
  setStructureItem: (prop: string, item: MFormV2ItemType) => void;
  /**
   * **重置表单数据**
   * @type `(data: object) => void`
   * @description 该方法用于重置表单数据，支持重置整个表单数据。
   * @param data 重置后的表单数据
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.changeData_All({ Text: "新值" })
   * ```
   * */
  changeData_All: (data: object) => void;

  /**
   * **重置表单数据**
   * @type `(prop: string, data: object) => void`
   * @description 该方法用于重置表单数据，支持重置整个表单数据。
   * @param prop 重置后的表单数据属性名
   * @param data 重置后的表单数据属性值
   * @returns 无返回值
   * @example
   * ```tsx
   * <MoForm ref={formRef} />
   * ```
   * ```tsx
   * formRef.value.changeData_Item("Text", "新值")
   * ```
   * */
  changeData_Item: (prop: string, data: any) => void;
};
// type InGroupType = GroupType & {
//   groupFormConfig: (GroupFromConfigType & { spanStyle?: spanStyleType })[];
// };

// >-------------> 分栏类型配置 <------------<

// type InTabsType = TabsType & {
//   tabsFormConfig: (MFormV2ChildType & { spanStyle?: spanStyleType })[];
// };

// >-------------> InFormType <------------<
// export type InFormItemType = BaseType &
//   StrictUnion<CellItemType | InGroupType | InTabsType | OtherType> & { spanStyle: spanStyleType };

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type ExMultipleConfigType = MFormV2ItemType & {
  inMultipleConfig?: MultipleConfigType[];
  tabsFormConfig?: MFormV2ChildType[];
};

export type MultipleConfigType = {
  unitName?: string; // 自动划组时使用名
  unitTip?: string; // 自动划组时提示
  configs: MFormV2ItemType[];
};

// export interface GlobalState {
//   addressMap: Record<string, string>;
//   addressMapLoading: boolean;
// }

export type MFormV2ExDependentType = {
  disabledRule?: { [x: string]: (value: any) => boolean };
  displayRule?: { [x: string]: (value: any) => boolean };
  /**
   * **外置表单校验规则**
   * @type `{ [x: string]: Array<FormItemRule> }`
   * @description 当设置该值为 `{ [x: string]: Array<FormItemRule> }` 时，会使用该值作为外置表单校验规则
   * */
  exCellRules?: {
    [x: string]: Array<{ validator: (params: { rule: any; value: any; callback: any }) => void; trigger: string }>;
  };
};

export type MFormV2CellExDependentType = {
  /**
   * **选择器请求Api**
   * @type `(params: { query: string }) => Promise<MOptionV2Type.SelectList>`
   * @description 当设 cellConfig.type=='select' 时，会使用该值作为选择器请求Api
   * */
  select_RequestApi?: { [x: string]: ({ query }: { query: string }) => Promise<MOptionV2Type.SelectList> };
  /**
   * **文件上传请求Api**
   * @type `(params: { file: File }) => Promise<any>`
   * @description 当设 cellConfig.type=='file' 时，会使用该值作为文件上传请求Api
   * */
  file_attachedData?: { [x: string]: Record<string, string> };
  /**
   * **文件下载模板**
   * @type `() => void`
   * @description 当设 cellConfig.type=='file' 时，会使用该值作为文件下载模板
   * */
  file_downloadTemplate?: { [x: string]: () => void };
  /**
   * **时间选择器禁用日期函数**
   * @type `(date: any) => boolean`
   * @description 当设 cellConfig.type=='time' 时，会使用该值作为时间选择器禁用日期函数
   * */
  time_disabledDateFn?: { [x: string]: (date: any) => boolean };
  /**
   * **时间选择器快捷选项**
   * @type `DatePickerShortcut[]`
   * @description 当设 cellConfig.type=='time' 时，会使用该值作为时间选择器快捷选项
   * */
  time_shortcuts?: { [x: string]: DatePickerShortcut[] };
};

export type ConfigContextType = {
  /** 表单标签宽度 */
  labelWidth?: number | string;
  /** 表单标签位置 */
  labelPosition?: "left" | "right" | "top";
  baseSpanSize: number;
  itemSpanSize: { [x: string]: number };
  data: Record<string, any>;
  contrastData: Record<string, any>;
  alwaysContrast: boolean;
  display: boolean;
  languagePackage: Record<string, string>;
  language: languageKey;
  exOptions: MOptionV2Type.Default;
  exDependent: MFormV2ExDependentType;
  exCellDependent: MFormV2CellExDependentType;
  useRequired: boolean;
  noLabel: boolean;
};

// 定义表单规则类型
export interface FormItemRule {
  /** 验证规则名称 */
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
  /** 是否必填 */
  required?: boolean;
  /** 验证错误信息 */
  message?: string;
  /** 验证触发方式 */
  trigger?: "blur" | "change" | "input";
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 长度 */
  len?: number;
  /** 正则表达式 */
  pattern?: RegExp;
  /** 自定义验证函数 */
  validator?: (params: { rule: FormItemRule; value: any; callback: (error?: string) => void }) => Promise<void> | void;
  /** 枚举值 */
  enum?: Array<boolean | number | string | null | undefined>;
  /** 转换值 */
  transform?: (value: any) => any;
}

export type FormDataType = Record<string, any> & {
  name?: string;
  isError?: boolean;
};
