type languageKey = "en-US" | "zh-CN";

export type MInputV2Type = {
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
   * @description 当设置该值时，会自定义样式
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
  modelValue?: string;

  /**
   * **输入框类型**
   * @type `input` | `textarea` | `text`
   * @default `text`
   * @description 当设置该值为 `input` 时，会显示输入框
   * @description 当设置该值为 `textarea` 时，会显示文本域
   * @description 当设置该值为 `text` 时，会显示文本框
   * @example
   * ```tsx
   * <MInput type="input" />
   * ```
   * @example
   * ```tsx
   * <MInput type="textarea" />
   * ```
   * @example
   * ```tsx
   * <MInput type="text" />
   * ```
   * */
  type?: "input" | "text" | "textarea";

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
   * **最大长度**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `number` 时，会限制最大长度
   * @description 该值的类型为 `number` | `string`，可以是任意类型
   * @example
   * ```tsx
   * <MInput maxLength={10} />
   * ```
   * */
  maxLength?: number | string;

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
   * **输入框转换**
   * @type `(value: string) => string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `(value: string) => string | undefined` 时，会对输入框的值进行转换
   * @description 当设置该值为 `undefined` 时，不会对输入框的值进行转换
   * @example
   * ```tsx
   * <MInput formatter={(value: string) => value.toUpperCase()} />
   * ```
   * @example
   * ```tsx
   * <MInput formatter={(value: string) => value.toLowerCase()} />
   * ```
   * @example
   * ```tsx
   * <MInput formatter={(value: string) => value.replace(/\s/g, '')} />
   * ```
   * @example
   * ```tsx
   * <MInput formatter={(value: string) => value.replace(/\D/g, '')} />
   * ```
   * */
  inputParser?: (value: string) => string | undefined;

  /**
   * **输入框转换**
   * @type `(value: number | string) => string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `(value: number | string) => string | undefined` 时，会对输入框的值进行转换
   * @description 当设置该值为 `undefined` 时，不会对输入框的值进行转换
   * @example
   * ```tsx
   * <MInput formatter={(value: number | string) => value.toUpperCase()} />
   * ```
   * @example
   * ```tsx
   * <MInput formatter={(value: number | string) => value.toLowerCase()} />
   * ```
   * @example
   * ```tsx
   * <MInput formatter={(value: number | string) => value.replace(/\s/g, '')} />
   * ```
   * */
  inputFormatter?: (value: number | string) => string | undefined;

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
