import { MOptionV2Type } from "../manager-type";

type languageKey = "en-US" | "zh-CN";

export type MCascaderV2Type = {
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
   * @type `Array<number | string>` | `number` | `string` | `boolean`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 该值的类型为 `Array<number | string>` | `number` | `string` | `boolean`，可以是任意类型
   * */
  modelValue?: Array<number | string> | number | string;

  /**
   * **是否使用单值模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用单值模式
   * @description 当设置该值为 `false` 时，不会使用单值模式
   * */
  useSingleValue?: boolean;

  /**
   * **是否使用单值模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用单值模式
   * @description 当设置该值为 `false` 时，不会使用单值模式
   * */
  useSingleText?: boolean;

  /**
   * **纯展示数据**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会显示该值
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  displayValue?: string;

  /**
   * **类型**
   * @type `cascader-check` | `cascader` | `multiple-cascader-check` | `multiple-cascader`
   * @default `cascader`
   * @description 当设置该值时，会使用该值作为类型
   * */
  type?: "cascader-check" | "cascader" | "multiple-cascader-check" | "multiple-cascader";

  /**
   * **外置数据**
   * @type `Array<MOptionV2Type.Select>`
   * @description 当设置该值时，会使用该值作为配置数据
   * @description 该值的类型为 `Array<MOptionV2Type.Select>`，可以是任意类型
   * @example
   * ```tsx
   * <MoCascaderV2 exOptions={[]} />
   * ```
   * */
  exOptions?: MOptionV2Type.SelectList;

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
   * <MoCascaderV2 disabled={true} />
   * ```
   * */
  disabled?: boolean;

  /**
   * **纯展示模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @example
   * ```tsx
   * <MoCascaderV2 display={true} />
   * ```
   * */
  display?: boolean;

  /**
   * **显示清除按钮**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示清除按钮
   * @description 当设置该值为 `false` 时，不会显示清除按钮
   * @example
   * ```tsx
   * <MoCascaderV2 clearable={true} />
   * ```
   * */
  clearable?: boolean;

  /**
   * **Teleport 目标**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会将组件挂载到指定的目标元素下
   * @description 该值的类型为 `boolean`，可以是任意类型
   * @example
   * ```tsx
   * <MoCascaderV2 teleportInContainer={true} />
   * ```
   * */
  teleportInContainer?: boolean;

  /**
   * **对比数据**
   * @type `Array<number | string>` | `number` | `string`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * @description 该值的类型为 `Array<number | string>` | `number` | `string`，可以是任意类型
   * @example
   * ```tsx
   * <MoCascaderV2 contrastData={[1, 2, 3]} />
   * ```
   * */
  contrastData?: Array<number | string> | number | string;

  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，不会显示对比数据
   * @example
   * ```tsx
   * <MoCascaderV2 contrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue, option }) => void` | `undefined`
   * @type `value` 为当前值
   * @type `oldValue` 为旧值
   * @type `option` 为当前选项
   * @default `undefined`
   * @description 当设置该值为 `({ value, oldValue, option: MOptionV2Type.Select }) => void` 时，会使用该值作为回调函数
   * @example
   * ```tsx
   * <MoCascaderV2 onChange={({value, oldValue, option}) => { console.log(value, oldValue, option) }} />
   * ```
   * */
  onChange?: ({ value, oldValue, option }) => void;
};

export type MCascaderV2OptionType = {
  /**
   * **外置数据**
   * @type `Array<MOptionV2Type.Select>`
   * @description 当设置该值时，会使用该值作为配置数据
   * @description 该值的类型为 `Array<MOptionV2Type.Select>`，可以是任意类型
   * @example
   * ```tsx
   * <MoCascaderV2 exOptions={[]} />
   * ```
   * */
  exOptions?: Array<MOptionV2Type.Select>;

  /**
   * **当前值**
   * @type `Array<number | string>` | `number` | `string`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为当前值
   * @description 该值的类型为 `Array<number | string>` | `number` | `string`，可以是任意类型
   * @example
   * ```tsx
   * <MoCascaderV2 inValue={[1, 2, 3]} />
   * ```
   * */
  inValue?: Array<number | string> | number | string;

  /**
   * **是否为多选**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用多选模式
   * @description 当设置该值为 `false` 时，不会使用多选模式
   * @example
   * ```tsx
   * <MoCascaderV2 multiple={true} />
   * ```
   * */
  isMultiple?: boolean;

  /**
   * **是否为Check模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用Check模式
   * @description 当设置该值为 `false` 时，不会使用Check模式
   * @example
   * ```tsx
   * <MoCascaderV2 isCheck={true} />
   * ```
   * */
  isCheck?: boolean;

  /**
   * **选项高度**
   * @type `string`
   * @default `48px`
   * @description 当设置该值为 `string` 时，会使用该值作为选项高度
   * @description 当设置该值为 `0` 时，选项高度不做限制
   * @description 当设置该值为 `string` 时，选项高度为 `string`
   * @example
   * ```tsx
   * <MoCascaderV2 OptionsHeight="48px" />
   * ```
   * */
  OptionsHeight?: string;

  /**
   * **是否为过滤模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用过滤模式
   * @description 当设置该值为 `false` 时，不会使用过滤模式
   * @example
   * ```tsx
   * <MoCascaderV2 isFilter={true} />
   * ```
   * */
  isFilter?: boolean;
};
