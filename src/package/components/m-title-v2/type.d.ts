// # Type
export type MTitleV2Type = {
  /**
   * **使用下划线**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会使用下划线
   * @description 当设置该值为 `false` 时，不会使用下划线
   * @example
   * ```tsx
   * <MTitle line={true} />
   * ```
   * */
  line?: boolean;

  /**
   * **tips提示**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会显示该字符串
   * @description 该值的类型为 `string`，可以是任意字符串，包括空字符串
   * @example
   * ```tsx
   * <MTitle tips="这是一个提示" />
   * ```
   * */
  tips?: string;

  /**
   * **padding**
   * @type `Array<'top' | 'left' | 'bottom' | 'right' | 'all' | 'null'>`
   * @default `undefined`
   * @description 当设置该值时，会在标题的对应方向添加 padding
   * @description 该值的类型为 `Array<'top' | 'left' | 'bottom' | 'right' | 'all' | 'null'>`，可以是任意组合
   * @example
   * ```tsx
   * <MTitle padding={['top', 'left']} />
   * ```
   * */
  padding?: Array<"all" | "bottom" | "left" | "null" | "right" | "top">;
};
