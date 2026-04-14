// # Type
export type MDialogV2Type = {
  /**
   * **是否打开Dialog**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会打开Dialog
   * @description 当设置该值为 `false` 时，会关闭Dialog
   * @example
   * ```tsx
   * <MoDialog open={true} />
   * ```
   * */
  modelValue: boolean;

  /**
   * **ID**
   * @type `string`
   * @description 当设置该值时，会使用该值作为唯一ID
   * */
  id?: string;

  /**
   * **Dialog尺寸**
   * @type `l` | `m` | `max` | `s`
   * @default `m`
   * @description 当设置该值时，会绑定该值
   * @description 该值的类型为 `l` | `m` | `max` | `s`，可以是任意类型
   * @description 当设置该值为 `l` 时，Dialog为大尺寸
   * @description 当设置该值为 `m` 时，Dialog为中尺寸
   * @description 当设置该值为 `max` 时，Dialog为最大尺寸
   * @description 当设置该值为 `s` 时，Dialog为小尺寸
   * @example
   * ```tsx
   * <MoDialog size="m" />
   * ```
   * */
  size?: "l" | "m" | "max" | "s";

  /**
   * **Dialog高度**
   * @type `number` | `string` | `auto`
   * @default `auto`
   * @description 当设置该值为 `number` 时，Dialog高度为该值
   * @description 当设置该值为 `string` 时，Dialog高度为该值
   * @description 当设置该值为 `auto` 时，Dialog高度为自适应
   * @example
   * ```tsx
   * <MoDialog height="auto" />
   * ```
   * */
  height?: number | string | "auto" | "default";

  /**
   * **Dialog宽度**
   * @type `number` | `string` | `auto`
   * @default `auto`
   * @description 当设置该值为 `number` 时，Dialog宽度为该值
   * @description 当设置该值为 `string` 时，Dialog宽度为该值
   * @description 当设置该值为 `auto` 时，Dialog宽度为自适应
   * @example
   * ```tsx
   * <MoDialog width="auto" />
   * ```
   * */
  width?: number | string;

  /**
   * **Dialog X轴偏移量**
   * @type `number` | `string`
   * @default `0`
   * @description 当设置该值为 `number` 时，Dialog X轴偏移量为该值
   * @description 当设置该值为 `string` 时，Dialog X轴偏移量为该值
   * @example
   * ```tsx
   * <MoDialog offsetX="0" />
   * ```
   * */
  offsetX?: number | string;

  /**
   * **Dialog Y轴偏移量**
   * @type `number` | `string`
   * @default `0`
   * @description 当设置该值为 `number` 时，Dialog Y轴偏移量为该值
   * @description 当设置该值为 `string` 时，Dialog Y轴偏移量为该值
   * @example
   * ```tsx
   * <MoDialog offsetY="0" />
   * ```
   * */
  offsetY?: number | string;

  /**
   * **是否使用缓存页面**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用缓存页面
   * @description 当设置该值为 `false` 时，不会使用缓存页面
   * @example
   * ```tsx
   * <MoDialog keepAlive />
   * ```
   * */
  keepAlive?: boolean;

  /**
   * **Dialog标题**
   * @type `string`
   * @default `标题`
   * @description 当设置该值为 `string` 时，Dialog标题为该值
   * @description 当设置该值为 `undefined` 时，Dialog标题为 `标题`
   * @example
   * ```tsx
   * <MoDialog title="次标题" />
   * ```
   * */
  title?: string;

  /**
   * **Dialog副标题**
   * @type `string`
   * @default `副标题`
   * @description 当设置该值为 `string` 时，Dialog副标题为该值
   * @description 当设置该值为 `undefined` 时，Dialog副标题为 `副标题`
   * @example
   * ```tsx
   * <MoDialog subTitle="次标题" />
   * ```
   * */
  subTitle?: string;

  /**
   * **是否开启全屏按钮**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会开启全屏按钮
   * @description 当设置该值为 `false` 时，不会开启全屏按钮
   * @example
   * ```tsx
   * <MoDialog fullScreen />
   * ```
   * */
  useFull?: boolean;

  /**
   * **内容是否支持滚动**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，内容支持滚动
   * @description 当设置该值为 `false` 时，内容不支持滚动
   * @example
   * ```tsx
   * <MoDialog scroll />
   * ```
   * */
  scroll?: boolean;

  /**
   * **是否使用X轴滚动**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，使用X轴滚动
   * @description 当设置该值为 `false` 时，不使用X轴滚动
   * @example
   * ```tsx
   * <MoDialog useScrollX />
   * ```
   * */
  useScrollX?: boolean;

  /**
   * **标题位置**
   * @type `left` | `center` | `right`
   * @default `center`
   * @description 当设置该值为 `left` 时，标题位置为左
   * @description 当设置该值为 `center` 时，标题位置为中
   * @description 当设置该值为 `right` 时，标题位置为右
   * @example
   * ```tsx
   * <MoDialog titleAlign="center" />
   * ```

   * */
  titleAlign?: "center" | "left" | "right";

  /**
   * **是否点击蒙层关闭Dialog**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，点击蒙层关闭Dialog
   * @description 当设置该值为 `false` 时，不点击蒙层关闭Dialog
   * @example
   * ```tsx
   * <MoDialog closeOnClickModal />
   * ```
   * */
  closeOnClickModal?: boolean;

  /**
   * **是否使用Esc按钮关闭Dialog**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，使用Esc按钮关闭Dialog
   * @description 当设置该值为 `false` 时，不使用Esc按钮关闭Dialog
   * @example
   * ```tsx
   * <MoDialog closeOnPressEscape />
   * ```
   * */
  closeOnPressEscape?: boolean;

  /**
   * **是否使用内边距**
   * @type `Array<"top" | "left" | "bottom" | "right" | "all">`
   * @default `[]`
   * @description 当设置该值为 `["top", "left"]` 时，使用内边距
   * @description 当设置该值为 `[]` 时，不使用内边距
   * @example
   * ```tsx
   * <MoDialog padding="['top', 'left']" />
   * ```
   * */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;
};
