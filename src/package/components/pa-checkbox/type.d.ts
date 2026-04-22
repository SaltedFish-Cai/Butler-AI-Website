import { PaOptionType, LanguageKey } from "../manager-type";

export type ComponentItemProps = {
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
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  class?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **双向绑定值**
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 当前属性只有作为 `独立组件` 时才会生效
   * @description 该值的类型为 `boolean` | `number` | `string`，可以是任意类型
   * */
  modelValue?: boolean | number | string;

  /**
   * **标签**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的标签
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  label?: Record<LanguageKey, string> | string;

  /**
   * **值**
   * @type `boolean` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的值
   * @description 该值的类型为 `boolean` | `number` | `string`，可以是任意类型
   * */
  value?: boolean | number | string;

  /**
   * **是否选中**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会将组件设置为选中状态
   * @description 当设置该值为 `false` 时，不会将组件设置为选中状态
   * @example
   * ```tsx
   * <PaCheckBox isChecked={true} />
   * ```
   * */
  isChecked?: boolean;

  /**
   * **是否不确定**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会将组件设置为不确定状态
   * @description 当设置该值为 `false` 时，不会将组件设置为不确定状态
   * @example
   * ```tsx
   * <PaCheckBox isIndeterminate={true} />
   * ```
   * */
  isIndeterminate?: boolean;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * @description 当设置该值为 `false` 时，不会禁用该组件
   * @example
   * ```tsx
   * <PaCheckBox disabled={true} />
   * ```
   * */
  disabled?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * @description 该值的类型为 `({ value, oldValue }) => void` | `undefined`，可以是任意类型
   * @example
   * ```tsx
   * <PaCheckBox onChange={({value, oldValue}) => { console.log(value, oldValue) }} />
   * ```
   * */
  onChange?: ({ value, oldValue }) => void;
};

export type ComponentProps = {
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
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  class?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **双向绑定值**
   * @type `Array<number | string | boolean>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 当前属性只有作为 `独立组件` 时才会生效
   * @description 该值的类型为 `Array<number | string | boolean>`，可以是任意类型
   * */
  modelValue?: Array<boolean | number | string | undefined>;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * @description 当设置该值为 `false` 时，不会禁用该组件
   * @example
   * ```tsx
   * <PaCheckBox disabled={true} />
   * ```
   * */
  disabled?: boolean;

  /**
   * **表单项标签**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标签
   * */
  title?: Record<LanguageKey, string> | string;

  /**
   * **表单项标签宽度**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标签宽度
   * */
  titleWidth?: string;

  /**
   * **外置数据**
   * @type `Array<PaOptionType.Select>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为配置数据
   * @description 该值的类型为 `Array<PaOptionType.Select>`，可以是任意类型
   * */
  exOptions?: PaOptionType.SelectList;

  /**
   * **纯展示模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @example
   * ```tsx
   * <PaCheckBox display={true} />
   * ```
   * */
  display?: boolean;

  /**
   * **纯展示值**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为纯展示值
   * @description 该值的类型为 `string`，可以是任意类型
   * @example
   * ```tsx
   * <PaCheckBox displayValue="123" />
   * ```
   * */
  displayValue?: string;

  /**
   * **对比数据**
   * @type `Array<number | string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * @description 该值的类型为 `Array<number | string>`，可以是任意类型
   * @example
   * ```tsx
   * <PaCheckBox contrastData={[1, 2, 3]} />
   * ```
   * */
  contrastData?: Array<number | string>;

  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，会更具对比数据的结果来决定是否显示对比数据
   * @example
   * ```tsx
   * <PaCheckBox alwaysContrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue, option }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为回调函数
   * @description 当设置该值为 `undefined` 时，不会触发该函数
   * @type `oldValue` 为旧值
   * @type `option` 为当前选项
   * @description 当设置该值时，会使用该值作为回调函数
   * @description 该值的类型为 `({ value, oldValue, option: PaOptionType.Select }) => void` | `undefined`，可以是任意类型
   * @example
   * ```tsx
   * <PaCheckBox onChange={({value, oldValue, option}) => { console.log(value, oldValue, option) }} />
   * ```
   * */
  onChange?: ({ value, oldValue, option }) => void;
};
