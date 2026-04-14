export interface ScrollbarV2Type {
  /**
   * @description 是否使用阴影
   * @default true
   * @description styleMode='color'时：默认为 false
   */
  useShadow?: boolean;

  /**
   * @description 是否显示回到顶部按钮
   * @default true
   * @description styleMode='color'时：默认为 false
   */
  useBackTop?: boolean;

  /**
   * @description 是否开启垂直滚动条
   * @default true
   */
  useScrollY?: boolean;

  /**
   * @description 是否开启水平滚动条
   * @default true
   */
  useScrollX?: boolean;

  /**
   * @description 是否显示滚动条
   * @default true
   */
  showThumb?: boolean;

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
   * **自定义内容样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到滚动条内容的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  contentStyle?: Record<string, string>;

  /**
   * **样式模型**
   * @type `"color"` | `"default"`
   * @default `"default"`
   * @description 当设置该值为 `"color"` 时，会将滚动条的样式设置为颜色样式
   * @description 当设置该值为 `"default"` 时，会将滚动条的样式设置为默认样式
   * */
  styleMode?: "color" | "default";

  /**
   * @description 滚动条宽度
   * @default 10
   */
  paddingWidth?: number | string;

  /**
   * **监听元素类名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会监听该元素的滚动事件
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  intersectClassName?: string;

  /**
   * @description 是否使用内边距
   * @default false
   */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * @description 是否使用边框
   * @default false
   */
  border?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * @description 是否使用内边距边框
   * @default false
   */
  paddingBorder?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * @description 默认垂直滚动条位置
   * @default 0
   */
  defaultScrollVerticalThumb?: number;

  /**
   * @description 默认水平滚动条位置
   * @default 0
   */
  defaultScrollHorizontalThumb?: number;

  /**
   * @description 是否点击外部关闭
   * @default true
   */
  useClosePopover?: boolean;

  /**
   * @description 父元素引用
   * @default undefined
   */
  parentBoxRef?: Ref<HTMLElement | undefined>;
}
