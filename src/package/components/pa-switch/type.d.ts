import { LanguageKey } from "../manager-type";

export type PaSwitchOptionType = {
  /**
   * **打开值**
   * @type `number` | `string` | `undefined`
   * @default `true`
   * */
  activeValue?: number | string;

  /**
   * **关闭值**
   * @type `number` | `string` | `undefined`
   * @default `false`
   * */
  inActiveValue?: number | string;

  /**
   * **打开标题**
   * @type `Record<LanguageKey, string>` | `string` | `undefined`
   * @default `是` / `Yes`
   * */
  activeText?: Record<LanguageKey, string> | string;

  /**
   * **关闭标题**
   * @type `Record<LanguageKey, string>` | `string` | `undefined`
   * @default `否` / `No`
   * */
  inActiveText?: Record<LanguageKey, string> | string;

  /**
   * **打开图标**
   * @type `string` | `undefined`
   * */
  activeIcon?: string;

  /**
   * **关闭图标**
   * @type `string` | `undefined`
   * */
  inActiveIcon?: string;
};

export type PaSwitchType = PaSwitchOptionType & {
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
   * **图标样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到图标元素的样式中
   * */
  iconStyle?: Record<string, string>;

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
   * **外部配置数据**
   * @type `PaSwitchOptionType` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为配置数据
   * */
  exOptions?: PaSwitchOptionType;

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
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * */
  contrastData?: boolean | number | string;

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
