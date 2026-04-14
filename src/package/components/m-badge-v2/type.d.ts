// # Type
export type MBadgeV2Type = {
  /**
   * **值**
   * @type `string`
   * @default `''`
   * @description 值
   * @example
   * ```tsx
   * <MoDialog value="123" />
   * ```
   * */
  value?: number | string;

  /**
   * **是否显示**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示组件
   * @description 当设置该值为 `false` 时，会隐藏组件
   * @example
   * ```tsx
   * <MoDialog show={false} />
   * ```
   * */
  show?: boolean;

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
};
