import type { Dayjs } from "dayjs";

type languageKey = "en-US" | "zh-CN";

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

export type MTimeV2Type = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * @description 该值的类型为 `string`，可以是任意类型，但是建议不要重复
   * */
  id?: string;

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
   * **双向绑定值**
   * @type `Array<string>` | `string`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 该值的类型为 `Array<string>` | `string`，可以是任意数组，包括空数组
   * */
  modelValue?: Array<string> | string;

  /**
   * **Time 类型**
   * @type `MDatePickerType`
   * @default `date-picker-group`
   * @description 当设置该值为 `date-picker-group` 时，会显示日期选择器组
   * @description 当设置该值为 `date-picker` 时，会显示日期选择器
   * @description 当设置该值为 `date-time-picker-group` 时，会显示日期时间选择器组
   * @description 当设置该值为 `date-time-picker` 时，会显示日期时间选择器
   * @description 当设置该值为 `month-picker-group` 时，会显示月份选择器组
   * @description 当设置该值为 `month-picker` 时，会显示月份选择器
   * @description 当设置该值为 `time-picker-group` 时，会显示时间选择器组
   * @description 当设置该值为 `time-picker` 时，会显示时间选择器
   * @description 当设置该值为 `year-picker-group` 时，会显示年份选择器组
   * @description 当设置该值为 `year-picker` 时，会显示年份选择器
   * */
  type?: MDatePickerType;

  /**
   * **纯展示模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @example
   * ```tsx
   * <MTime display={true} />
   * ```
   * */
  display?: boolean;

  /**
   * **表单项占位符**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项占位符
   * */
  placeholder?: Record<languageKey, string> | string;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * @description 当设置该值为 `false` 时，不会禁用该组件
   * @example
   * ```tsx
   * <MTime disabled={true} />
   * ```
   * */
  disabled?: boolean;

  /**
   * **是否将弹出层挂载到容器中**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会将弹出层挂载到容器中
   * @description 当设置该值为 `false` 时，不会将弹出层挂载到容器中
   * @example
   * ```tsx
   * <MTime teleport-in-container={true} />
   * ```
   * */
  teleportInContainer?: boolean;

  /**
   * **禁用日期判断方法**
   * @type `(date: any) => boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `(date: any) => boolean` 时，会使用该值作为禁用日期判断方法
   * @description 当设置该值为 `undefined` 时，不会使用禁用日期判断方法
   * @example
   * ```tsx
   * <MTime disabledDateFn={(date) => date > moment().endOf("day")} />
   * ```
   * */
  disabledDateFn?: (date: any) => boolean;

  /**
   * **快捷选项**
   * @type `DatePickerShortcut[]` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `DatePickerShortcut[]` 时，会使用该值作为快捷选项
   * @description 当设置该值为 `undefined` 时，不会使用快捷选项
   * @example
   * ```tsx
   * <MTime shortcuts={[{ text: "今天", value: () => [moment(), moment()] }]} />
   * ```
   * */
  shortcuts?: DatePickerShortcut[];

  /**
   * **对比数据**
   * @type `Array<number | string>` | `number` | `string`
   * @default `undefined`
   * @description 当设置该值为 `Array<number | string>` 时，会使用该值作为对比数据
   * @description 当设置该值为 `number` 时，会使用该值作为对比数据
   * @description 当设置该值为 `string` 时，会使用该值作为对比数据
   * @description 当设置该值为 `undefined` 时，不会使用对比数据
   * @example
   * ```tsx
   * <MTime contrastData={["2021-01-01", "2021-01-02"]} />
   * ```
   * */
  contrastData?: string[] | string;

  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，不会显示对比数据
   * @example
   * ```tsx
   * <MTime showContrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `({ value, oldValue }) => void` 时，会使用该值作为回调函数
   * @description 当设置该值为 `undefined` 时，不会使用回调函数
   * @example
   * ```tsx
   * <MTime onChange={({value, oldValue}) => { console.log(value, oldValue) }} />
   * ```
   * */
  onChange?: ({ value, oldValue }) => void;

  /**
   * **在组件 Input 获得焦点时触发**
   * @type `({ value }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `({ value }) => void` 时，会使用该值作为回调函数
   * @description 当设置该值为 `undefined` 时，不会使用回调函数
   * @example
   * ```tsx
   * <MTime onFocus={({value}) => { console.log(value) }} />
   * ```
   * */
  onFocus?: ({ value }) => void;

  /**
   * **	在组件 Input 失去焦点时触发**
   * @type `({ value }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `({ value, oldValue }) => void` 时，会使用该值作为回调函数
   * @description 当设置该值为 `undefined` 时，不会使用回调函数
   * @example
   * ```tsx
   * <MTime onBlur={({value}) => { console.log(value) }} />
   * ```
   * */
  onBlur?: ({ value }) => void;
};

export interface DatePickerShortcut {
  text: string;
  value: Date[] | (() => Date[]);
}

export interface DatePickerProps {
  modelValue?: Date | Dayjs | number | string | [Date | Dayjs | number | string, Date | Dayjs | number | string] | null;
  type?: MDatePickerType;
  format?: string;
  valueType?: "date" | "dayjs" | "string";
  placeholder?: string | [string, string];
  rangeSeparator?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  defaultValue?: Date | Dayjs | [Date | Dayjs, Date | Dayjs];
  defaultTime?: [Date, Date];
  disabled?: boolean;
  editable?: boolean;
  clearable?: boolean;
  size?: "default" | "large" | "small";
  showTime?: boolean;
  disabledDate?: (date: Date) => boolean;
  cellClassName?: (date: Date) => string;
  popperClass?: string;
  popperOptions?: any;
  validateEvent?: boolean;
}

export interface DatePickerEmits {
  (e: "update:modelValue", value: any): void;
  (e: "change", value: any): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "calendar-change", value: [Date, Date]): void;
  (e: "visible-change", visible: boolean): void;
  (e: "clear"): void;
}

export type MTimerV2Type = {
  /**
   * **组件唯一标识**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会自定义组件的唯一标识
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  id?: string;

  /**
   * **自定义类名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会自定义类名
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
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会禁用组件
   * @description 当设置该值为 `false` 时，不会禁用组件
   * */
  disabled?: boolean;

  /**
   * **双向绑定值**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 当前属性只有作为 `独立组件` 时才会生效
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  modelValue?: string;

  /**
   * **当数据发生变更时触发**
   * @type `(value: string) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `(value: string) => void` 时，会使用该值作为回调函数
   * @description 当设置该值为 `undefined` 时，不会使用回调函数
   * @example
   * ```tsx
   * <MInput onChange={(value: string) => { console.log(value) }} />
   * ```
   * */
  onChange?: ({ value, oldValue }) => void;
};
