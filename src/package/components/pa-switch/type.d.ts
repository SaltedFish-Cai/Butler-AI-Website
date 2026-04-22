import { PaOptionType, LanguageKey } from "../manager-type";

export type ComponentProps = PaOptionType.Switch & {
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
   * @type `PaOptionType.Switch` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为配置数据
   * */
  exOptions?: PaOptionType.Switch;

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
