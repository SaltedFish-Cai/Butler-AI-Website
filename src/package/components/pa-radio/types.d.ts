/**
 * **模块导入**
 * @description 导入选项类型和多语言类型定义
 * */
import { PaOptionType, LanguagePackageType } from "../manager-type";

/**
 * **单选框子项属性类型**
 * @description 单选框子项组件的属性定义
 * */
export type ComponentItemProps = {
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
   * **双向绑定值**
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当前属性只有作为独立组件时才会生效
   * */
  modelValue?: boolean | number | string;

  /**
   * **标签**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的标签
   * */
  label?: LanguagePackageType | string;

  /**
   * **值**
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的值
   * */
  value?: boolean | number | string;

  /**
   * **是否选中**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会将组件设置为选中状态
   * */
  isChecked?: boolean;

  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * */
  disabled?: boolean;

  /**
   * **是否选项**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会将组件设置为选项状态
   * */
  isOption?: boolean;
};

/**
 * **单选框子项事件类型**
 * @description 单选框子项组件可触发的事件
 * */
export type ComponentItemEmits = {
  "update:modelValue": (value: boolean | number | string | undefined) => void;

  change: (payload: { value: boolean | number | string | undefined; oldValue: boolean | number | string | undefined }) => void;
};

/**
 * **单选框属性类型**
 * @description 单选框组件的属性定义
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
   * **双向绑定值**
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * */
  modelValue?: boolean | number | string;

  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * */
  disabled?: boolean;

  /**
   * **外置数据**
   * @type `PaOptionType.SelectList` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为配置数据
   * */
  exOptions?: PaOptionType.SelectList;

  /**
   * **纯展示模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * */
  display?: boolean;

  /**
   * **纯展示值**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会直接显示该值
   * */
  displayValue?: string;

  /**
   * **对比数据**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * */
  contrastData?: number | string;

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
 * **单选框事件类型**
 * @description 单选框组件可触发的事件
 * */
export type ComponentEmits = {
  "update:modelValue": (value: boolean | number | string) => void;

  change: (payload: {
    value: boolean | number | string;
    oldValue: boolean | number | string;
    option: PaOptionType.Select;
  }) => void;
};
