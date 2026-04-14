type languageKey = "en-US" | "zh-CN";

export type MSelectIconV2Type = {
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
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  modelValue?: string;

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
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * @description 该值的类型为 `string`，可以是任意类型
   * @example
   * ```tsx
   * <MoSelect contrastData="123" />
   * ```
   * */
  contrastData?: string;

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
};
