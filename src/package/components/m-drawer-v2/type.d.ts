// # Type
export type MDrawerV2Type = {
  /**
   * **是否打开Drawer**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会打开Drawer
   * @description 当设置该值为 `false` 时，会关闭Drawer
   * @example
   * ```tsx
   * <MDrawer open={true} />
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
   * **Drawer标题**
   * @type `string`
   * @default `标题`
   * @description 当设置该值为 `string` 时，Drawer标题为该值
   * @description 当设置该值为 `undefined` 时，Drawer标题为 `标题`
   * @example
   * ```tsx
   * <MDrawer title="次标题" />
   * ```
   * */
  title?: Record<languageKey, string> | string;

  /**
   * **Drawer次标题**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，Drawer次标题为该值
   * @description 当设置该值为 `undefined` 时，Drawer次标题为空
   * @example
   * ```tsx
   * <MDrawer subTitle="次标题" />
   * ```
   * */
  subTitle?: Record<languageKey, string> | string;

  /**
   * **宽度**
   * @type `string`
   * @default `500px`
   * @description 当设置该值为 `string` 时，Drawer宽度为该值
   * @description 当设置该值为 `undefined` 时，Drawer宽度为 `500px`
   * @example
   * ```tsx
   * <MDrawer width="600px" />
   * ```
   * */
  width?: string;

  /**
   * **高度**
   * @type `string`
   * @default `500px`
   * @description 当设置该值为 `string` 时，Drawer高度为该值
   * @description 当设置该值为 `undefined` 时，Drawer高度为 `500px`
   * @example
   * ```tsx
   * <MDrawer height="600px" />
   * ```
   * */
  height?: string;

  /**
   * **内容是否支持滚动**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，内容支持滚动
   * @description 当设置该值为 `false` 时，内容不支持滚动
   * @example
   * ```tsx
   * <MDrawer scroll />
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
   * <MDrawer useScrollX />
   * ```
   * */
  useScrollX?: boolean;

  /**
   * **是否点击蒙层关闭Drawer**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，点击蒙层关闭Drawer
   * @description 当设置该值为 `false` 时，不点击蒙层关闭Drawer
   * @example
   * ```tsx
   * <MDrawer closeOnClickModal />
   * ```
   * */
  closeOnClickModal?: boolean;

  /**
   * **是否使用Esc按钮关闭Drawer**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，使用Esc按钮关闭Drawer
   * @description 当设置该值为 `false` 时，不使用Esc按钮关闭Drawer
   * @example
   * ```tsx
   * <MDrawer closeOnPressEscape />
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
   * <MDrawer padding="['top', 'left']" />
   * ```
   * */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * **Drawer位置**
   * @type `left` | `center` | `right`
   * @default `right`
   * @description 当设置该值为 `left` 时，Drawer位置为左
   * @description 当设置该值为 `center` 时，Drawer位置为中
   * @description 当设置该值为 `right` 时，Drawer位置为右
   * @example
   * ```tsx
   * <MDrawer position="center" />
   * ```
   * */
  position?: "bottom" | "left" | "right" | "top";
};
