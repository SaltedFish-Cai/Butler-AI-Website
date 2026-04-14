type languageKey = "en-US" | "zh-CN";

export type MNumberV2Type = {
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
   * **双向绑定值**
   * @type `string` | `number`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 当前属性只有作为 `独立组件` 时才会生效
   * @description 该值的类型为 `string` | `number`，可以是任意类型
   * */
  modelValue?: number | string;

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
   * <MInput disabled={true} />
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
   * <MInput display={true} />
   * ```
   * */
  display?: boolean;

  /**
   * **是否显示控制按钮**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示控制按钮
   * @description 当设置该值为 `false` 时，不会显示控制按钮
   * @example
   * ```tsx
   * <MInput controls={true} />
   * ```
   * */
  controls?: boolean;

  /**
   * **最小值**
   * @type `number`
   * @default `undefined`
   * @description 当设置该值为 `number` 时，会使用该值作为最小值
   * @description 当设置该值为 `undefined` 时，不会使用最小值
   * @example
   * ```tsx
   * <MInput min={1} />
   * ```
   * */
  min?: number;

  /**
   * **最大值**
   * @type `number`
   * @default `undefined`
   * @description 当设置该值为 `number` 时，会使用该值作为最大值
   * @description 当设置该值为 `undefined` 时，不会使用最大值
   * @example
   * ```tsx
   * <MInput max={100} />
   * ```
   * */
  max?: number;

  /**
   * **单位**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，会使用该值作为单位
   * @description 当设置该值为 `undefined` 时，不会使用单位
   * @example
   * ```tsx
   * <MInput unit="%" />
   * ```
   * */
  unit?: string;

  /**
   * **精度**
   * @type `number`
   * @default `undefined`
   * @description 当设置该值为 `number` 时，会使用该值作为精度
   * @description 当设置该值为 `undefined` 时，不会使用精度
   * @example
   * ```tsx
   * <MInput precision={2} />
   * ```
   * */
  precision?: number;

  /**
   * **显示清除按钮**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示清除按钮
   * @description 当设置该值为 `false` 时，不会显示清除按钮
   * @example
   * ```tsx
   * <MInput clearable={true} />
   * ```
   * */
  clearable?: boolean;

  /**
   * **自动聚焦**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会自动聚焦
   * @description 当设置该值为 `false` 时，不会自动聚焦
   * @example
   * ```tsx
   * <MInput autofocus={true} />
   * ```
   * */
  autofocus?: boolean;

  /**
   * **步长**
   * @type `number`
   * @default `1`
   * @description 当设置该值为 `number` 时，会使用该值作为步长
   * @description 当设置该值为 `undefined` 时，不会使用步长
   * @example
   * ```tsx
   * <MInput step={1} />
   * ```
   * */
  step?: number;

  /**
   * **对比数据**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `number` | `string` 时，会对输入框的值进行对比
   * @description 当设置该值为 `undefined` 时，不会对输入框的值进行对比
   * @example
   * ```tsx
   * <MInput contrastData="123" />
   * ```
   * @example
   * ```tsx
   * <MInput contrastData={123} />
   * ```
   * */
  contrastData?: number | string;

  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，不会显示对比数据
   * @example
   * ```tsx
   * <MInput showContrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

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
