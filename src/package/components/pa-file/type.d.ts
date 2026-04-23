import { LanguageKey } from "../manager-type";

export type PaFileType = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * */
  id?: string;

  /**
   * **自定义类名**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * */
  class?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;

  /**
   * **双向绑定数据**
   * @type `Array<PaFileDataType>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * */
  modelValue?: Array<PaFileDataType>;

  /**
   * **上传文件时附带数据**
   * @type `object` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会将该值作为请求参数发送到服务器
   * */
  attachedData?: object;

  /**
   * **表单项占位符**
   * @type `Record<LanguageKey, string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为表单项占位符
   * */
  placeholder?: Record<LanguageKey, string> | string;

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
  fileIncludeType?: string[];

  /**
   * **允许上传文件类型的文本描述**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会显示允许上传文件类型的文本描述
   * */
  fileIncludeText?: string[];

  /**
   * **不允许上传文件类型**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会限制文件类型
   * */
  fileExcludeType?: string[];

  /**
   * **不允许上传文件类型的文本描述**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会显示不允许上传文件类型的文本描述
   * */
  fileExcludeText?: string[];

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
   * @type `Array<PaFileDataType>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * */
  contrastData?: Array<PaFileDataType>;

  /**
   * **是否显示对比数据**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * */
  alwaysContrast?: boolean;

  /**
   * **表单项标签**
   * @type `Record<LanguageKey, string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为表单项标签
   * */
  title?: Record<LanguageKey, string> | string;

  /**
   * **表单项标签宽度**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为表单项标签宽度
   * */
  titleWidth?: string;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * */
  onChange?: ({ value, oldValue }) => void;
};

export type PaFileDataType = {
  FileId: string;
  FullPath: string;
  FileName?: string;
  FileUrl?: string;
  OriginalName?: string;
};
