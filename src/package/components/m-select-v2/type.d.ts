import { MOptionV2Type } from "../manager-type";

type languageKey = "en-US" | "zh-CN";

export type MSelectV2Type = {
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
   * **纯展示数据**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会显示该值
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  displayValue?: string;

  /**
   * **类型**
   * @type `multiple-online-select` | `multiple-request-select` | `multiple-select` | `online-select` | `request-select` | `select`
   * @default `select`
   * @description 当设置该值时，会使用该值作为类型
   * - 当设置该值为 `multiple-online-select` 时，需要配置 `requestApi` 接口
   * - 当设置该值为 `multiple-request-select` 时，需要配置 `requestApi` 接口
   * - 当设置该值为 `online-select` 时，需要配置 `requestApi` 接口
   * - 当设置该值为 `request-select` 时，需要配置 `requestApi` 接口
   * @example
   * ```tsx
   * <MoSelect type="multiple-online-select" />
   * ```
   * */
  type?: "multiple-online-select" | "multiple-request-select" | "multiple-select" | "online-select" | "request-select" | "select";

  /**
   * **外置数据**
   * @type `MOptionV2Type.SelectList`
   * @description 当设置该值时，会使用该值作为配置数据
   * @description 该值的类型为 `MOptionV2Type.SelectList`，可以是任意类型
   * @example
   * ```tsx
   * <MoSelect exOptions={[]} />
   * ```
   * */
  exOptions?: MOptionV2Type.SelectList;

  /**
   * **远端请求选项接口**
   * @type `({ query: string }) => Promise<MOptionV2Type.SelectList>`
   * @description 当设置该值时，会使用该接口请求选项
   * @description 该值的类型为 `({ query: string }) => Promise<MOptionV2Type.SelectList>`，可以是任意类型
   * @description 该接口的参数为 `{ query: string }`，返回值为 `Promise<MOptionV2Type.SelectList>`
   * @example
   * ```tsx
   * <MoSelect requestApi={(query) => { return new Promise((resolve) => { resolve([]) }) }} />
   * */
  requestApi?: ({ query: string }) => Promise<MOptionV2Type.SelectList>;

  // /**
  //  * **选项KEy**
  //  * @type `string`
  //  * @default `value`
  //  * @description 当设置该值时，会使用该值作为选项的KEy
  //  * */
  // optionKey?: string;

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
   * <MoSelect disabled={true} />
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
   * <MoSelect display={true} />
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
   * <MoSelect clearable={true} />
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
   * <MoSelect teleportInContainer={true} />
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
   * <MoSelect contrastData={[1, 2, 3]} />
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
   * <MoSelect contrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue }) => void` | `undefined`
   * @type `value` 为当前值
   * @type `oldValue` 为旧值
   * @type `option` 为当前选项
   * @default `undefined`
   * @description 当设置该值为 `({ value, oldValue, option: MOptionV2Type.Select }) => void` 时，会使用该值作为回调函数
   * @example
   * ```tsx
   * <MoSelect onChange={({value, oldValue, option}) => { console.log(value, oldValue, option) }} />
   * ```
   * */
  onChange?: ({ value, oldValue, option }) => void;
};

export type MSelectV2OptionsType = {
  /**
   * **数据标题**
   * @type `string`
   * */
  label: string;

  /**
   * **数据值**
   * @type `boolean` | `number` | `string`
   * @description 数据值的类型为 `boolean` | `number` | `string`，可以是任意类型
   * */
  value: boolean | number | string;

  /**
   * **子数据**
   * @type `Array<MSelectOptionsType>`
   * @description 子数据的类型为 `Array<MSelectOptionsType>`，可以是任意类型
   * */
  children?: Array<MSelectV2OptionsType>;

  /**
   * **是否禁用该选项**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，该选项将被禁用
   * @description 当设置该值为 `false` 时，该选项将不会被禁用
   * */
  disabled?: boolean;

  /**
   * **源数据**
   * @type `object`
   * @description 源数据的类型为 `object`，可以是任意类型
   * */
  base?: Record<string, string>;

  /**
   * **tag样式配置**
   * @type `object`
   * @type `bgColor` 背景颜色
   * @type `textColor` 文字颜色
   * @description tag样式配置的类型为 `object`，可以是任意类型
   * */
  tagStyle?: { bgColor?: string; textColor?: string };
};
