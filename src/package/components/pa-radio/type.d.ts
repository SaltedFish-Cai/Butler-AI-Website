import { PaOptionType, LanguagePackageType } from "../manager-type";

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
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 当前属性只有作为 `独立组件` 时才会生效
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
   * **当数据发生变更时触发**
   * @type `({ value, oldValue, option }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * */
  onChange?: ({ value, oldValue, option }) => void;
};

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
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 当前属性只有作为 `独立组件` 时才会生效
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
   * **纯展示类型下，直接显示值**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会直接显示该值
   * */
  displayValue?: string;

  /**
   * **对比数据**
   * @type `Array<number | string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * */
  contrastData?: Array<number | string>;

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
   * @type `({ value, oldValue, option }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * */
  onChange?: ({ value, oldValue, option }) => void;
};
