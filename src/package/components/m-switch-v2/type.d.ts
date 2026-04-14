type languageKey = "en-US" | "zh-CN";

export type MSwitchV2Type = MSwitchV2OptionType & {
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
   * **图标样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到图标元素的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  iconStyle?: Record<string, string>;

  /**
   * **双向绑定值**
   * @type `boolean` | `number` | `string`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 该值的类型为 `boolean` | `number` | `string`，可以是任意类型
   * */
  modelValue?: boolean | number | string;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * @description 当设置该值为 `false` 时，不会禁用该组件
   * @example
   * ```tsx
   * <MSwitchV2 disabled={true} />
   * ```
   * */
  disabled?: boolean;

  /**
   * **外部配置数据**
   * @type `MoSwitchOptionType`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为配置数据
   * @description 该值的类型为 `MoSwitchOptionType`，可以是任意类型
   * @example
   * ```tsx
   * <MSwitchV2 exOptions={{ activeValue: true, inActiveValue: false }} />
   * ```
   * */
  exOptions?: MSwitchV2OptionType;

  /**
   * **纯展示模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @example
   * ```tsx
   * <MSwitchV2 display={true} />
   * ```
   * */
  display?: boolean;

  /**
   * **对比数据**
   * @type `boolean` | `number` | `string`
   * @default `undefined`
   * @description 当设置该值为 `boolean` | `number` | `string` 时，会使用该值作为对比数据
   * @description 当设置该值为 `undefined` 时，不会使用对比数据
   * @example
   * ```tsx
   * <MSwitchV2 contrastData={true} />
   * ```
   * */
  contrastData?: boolean | number | string;

  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，会更具对比数据的结果来决定是否显示对比数据
   * @example
   * ```tsx
   * <MSwitchV2 alwaysContrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue }) => void` | `undefined`
   * @type `value` 为当前值
   * @type `oldValue` 为旧值
   * @default `undefined`
   * @description 当设置该值为 `({ value, oldValue }) => void` 时，会使用该值作为回调函数
   * @description 当设置该值为 `undefined` 时，不会使用回调函数
   * @example
   * ```tsx
   * <MSwitchV2 onChange={({ value, oldValue }) => { console.log(value, oldValue) }} />
   * ```
   * */
  onChange?: ({ value, oldValue }) => void;
};

export type MSwitchV2OptionType = {
  /**
   * **打开值**
   * @type `boolean` | `number` | `string`
   * */
  activeValue?: boolean | number | string;

  /**
   * **关闭值**
   * @type `boolean` | `number` | `string`
   * */
  inActiveValue?: boolean | number | string;

  /**
   * **打开标题**
   * @type `string` | `{ [key: "en-US" | "zh-CN"]: string }`
   * */
  activeText?: Record<languageKey, string> | string;

  /**
   * **关闭标题**
   * @type `string` | `{ [key: "en-US" | "zh-CN"]: string }`
   * */
  inActiveText?: Record<languageKey, string> | string;

  /**
   * **打开图标**
   * @type `string`
   * */
  activeIcon?: string;

  /**
   * **关闭图标**
   * @type `string`
   * */
  inActiveIcon?: string;
};
