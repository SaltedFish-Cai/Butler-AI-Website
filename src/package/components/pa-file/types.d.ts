/**
 * **模块导入**
 * @description 导入多语言类型定义
 * */
import { LanguagePackageType } from "../manager-type";

/**
 * **文件数据类型**
 * @description 文件上传后的数据结构
 * */
export type FileDataType = {
  /**
   * **文件ID**
   * @type `string`
   * @description 文件的唯一标识
   * */
  FileId: string;

  /**
   * **文件完整路径**
   * @type `string`
   * @description 文件的完整访问路径
   * */
  FullPath: string;

  /**
   * **文件名称**
   * @type `string` | `undefined`
   * @description 文件的名称
   * */
  FileName?: string;

  /**
   * **文件URL**
   * @type `string` | `undefined`
   * @description 文件的访问URL
   * */
  FileUrl?: string;

  /**
   * **原始文件名**
   * @type `string` | `undefined`
   * @description 上传前的原始文件名
   * */
  OriginalName?: string;
};

/**
 * **文件上传组件属性类型**
 * @description 文件上传组件的属性定义
 * */
export type ComponentProps = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * */
  id?: string;

  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * */
  class?: Array<string> | string;

  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;

  /**
   * **双向绑定数据**
   * @type `Array<FileDataType>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * */
  modelValue?: Array<FileDataType>;

  /**
   * **上传文件时附带数据**
   * @type `object` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会将该值作为请求参数发送到服务器
   * */
  attachedData?: object;

  /**
   * **表单项占位符**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为表单项占位符
   * */
  placeholder?: LanguagePackageType | string;

  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * */
  disabled?: boolean;

  /**
   * **限制文件上传数量**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会限制文件上传数量
   * */
  fileMultiple?: number;

  /**
   * **纯展示模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * */
  display?: boolean;

  /**
   * **纯展示类型下，直接显示值**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会直接显示该值
   * */
  displayValue?: string;

  /**
   * **允许上传文件类型**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会限制文件类型
   * */
  fileIncludeType?: Array<string>;

  /**
   * **允许上传文件类型的文本描述**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会显示允许上传文件类型的文本描述
   * */
  fileIncludeText?: Array<string>;

  /**
   * **不允许上传文件类型**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会限制文件类型
   * */
  fileExcludeType?: Array<string>;

  /**
   * **不允许上传文件类型的文本描述**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会显示不允许上传文件类型的文本描述
   * */
  fileExcludeText?: Array<string>;

  /**
   * **单个文件上传大小限制**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会限制文件大小（单位 KB）
   * */
  fileSingleSize?: number;

  /**
   * **总文件上传大小限制**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会限制文件大小（单位 KB）
   * */
  fileAllSize?: number;

  /**
   * **下载模板按钮执行方法**
   * @type `() => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会显示下载模板按钮
   * */
  downloadTemplate?: () => void;

  /**
   * **对比数据**
   * @type `Array<FileDataType>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * */
  contrastData?: Array<FileDataType>;

  /**
   * **是否显示对比数据**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * */
  alwaysContrast?: boolean;

  /**
   * **表单项标签**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为表单项标签
   * */
  title?: LanguagePackageType | string;

  /**
   * **表单项标签宽度**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为表单项标签宽度
   * */
  titleWidth?: string;
};

/**
 * **文件上传组件事件类型**
 * @description 文件上传组件可触发的事件
 * */
export type ComponentEmits = {
  /**
   * **更新绑定值事件**
   * @param `value` `Array<FileDataType>` 新的绑定值
   * @returns `void`
   * */
  (e: "update:modelValue", value: Array<FileDataType>): void;

  /**
   * **值变更事件**
   * @param `payload` `{ value: Array<FileDataType>; oldValue: Array<FileDataType> }` 变更数据
   * @returns `void`
   * */
  (e: "change", payload: { value: Array<FileDataType>; oldValue: Array<FileDataType> }): void;

  /**
   * **状态变更事件**
   * @param `state` `"Working"` | `"Pending"` 当前状态
   * @returns `void`
   * */
  (e: "changeState", state: "Working" | "Pending"): void;
};
