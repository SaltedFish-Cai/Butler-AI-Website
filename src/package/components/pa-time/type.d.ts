import { LanguagePackageType } from "../manager-type";

export type MDatePickerType =
  | "date-picker-group"
  | "date-picker"
  | "date-time-picker-group"
  | "date-time-picker"
  | "month-picker-group"
  | "month-picker"
  | "time-picker-group"
  | "time-picker"
  | "year-picker-group"
  | "year-picker";

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
   * **双向绑定值**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * */
  modelValue?: Array<string> | string;

  /**
   * **Time 类型**
   * @type `MDatePickerType` | `undefined`
   * @default `date-picker`
   * @description 当设置该值时，会使用对应的日期时间选择器
   * */
  type?: MDatePickerType;

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
   * **是否将弹出层挂载到容器中**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会将弹出层挂载到容器中
   * */
  teleportInContainer?: boolean;

  /**
   * **禁用日期判断方法**
   * @type `(date: any) => boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为禁用日期判断方法
   * */
  disabledDateFn?: (date: any) => boolean;

  /**
   * **快捷选项**
   * @type `DatePickerShortcut[]` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为快捷选项
   * */
  shortcuts?: DatePickerShortcut[];

  /**
   * **对比数据**
   * @type `Array<number | string>` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * */
  contrastData?: string[] | string;

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

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * */
  onChange?: ({ value, oldValue }) => void;

  /**
   * **在组件 Input 获得焦点时触发**
   * @type `({ value }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * */
  onFocus?: ({ value }) => void;

  /**
   * **在组件 Input 失去焦点时触发**
   * @type `({ value }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * */
  onBlur?: ({ value }) => void;
};

export interface DatePickerShortcut {
  text: string;
  value: Date[] | (() => Date[]);
}
