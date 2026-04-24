import { Ref } from "vue";

export type ComponentProps = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * */
  id?: string;

  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * */
  class?: Array<string> | string;

  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;

  /**
   * **是否使用阴影**
   * @type `boolean`
   * @default `true`
   * @description styleMode='color'时：默认为 false
   * */
  useShadow?: boolean;

  /**
   * **是否显示回到顶部按钮**
   * @type `boolean`
   * @default `true`
   * @description styleMode='color'时：默认为 false
   * */
  useBackTop?: boolean;

  /**
   * **是否开启垂直滚动条**
   * @type `boolean`
   * @default `true`
   * @description 是否开启垂直滚动条
   * */
  useScrollY?: boolean;

  /**
   * **是否开启水平滚动条**
   * @type `boolean`
   * @default `true`
   * @description 是否开启水平滚动条
   * */
  useScrollX?: boolean;

  /**
   * **是否显示滚动条内容**
   * @type `boolean`
   * @default `true`
   * @description 是否显示滚动条内容
   * */
  showThumb?: boolean;

  /**
   * **自定义内容样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到滚动条内容的样式中
   * */
  contentStyle?: Record<string, string>;

  /**
   * **样式模型**
   * @type `'color'` | `'default'`
   * @default `'default'`
   * @description 当设置该值为 `color` 时，会将滚动条的样式设置为颜色样式
   * */
  styleMode?: "color" | "default";

  /**
   * **滚动条内边距宽度**
   * @type `number` | `string`
   * @default `var(--pa-size-padding, 10px)`
   * @description 滚动条内边距宽度
   * */
  paddingWidth?: number | string;

  /**
   * **监听元素类名**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会监听该元素的滚动事件
   * */
  intersectClassName?: string;

  /**
   * **内边距方向**
   * @type `Array<'all' | 'bottom' | 'left' | 'right' | 'top'>` | `undefined`
   * @default `undefined`
   * @description 是否使用内边距
   * */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * **边框方向**
   * @type `Array<'all' | 'bottom' | 'left' | 'right' | 'top'>` | `undefined`
   * @default `undefined`
   * @description 是否使用边框
   * */
  border?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * **内边距边框方向**
   * @type `Array<'all' | 'bottom' | 'left' | 'right' | 'top'>` | `undefined`
   * @default `undefined`
   * @description 是否使用内边距和边框
   * */
  paddingBorder?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * **默认垂直滚动条位置**
   * @type `number`
   * @default `0`
   * @description 默认垂直滚动条位置
   * */
  defaultScrollVerticalThumb?: number;

  /**
   * **默认水平滚动条位置**
   * @type `number`
   * @default `0`
   * @description 默认水平滚动条位置
   * */
  defaultScrollHorizontalThumb?: number;

  /**
   * **是否点击外部关闭弹窗**
   * @type `boolean`
   * @default `true`
   * @description 是否点击外部关闭弹窗
   * */
  useClosePopover?: boolean;

  /**
   * **父元素引用**
   * @type `Ref<HTMLElement | undefined>` | `undefined`
   * @default `undefined`
   * @description 父元素引用
   * */
  parentBoxRef?: Ref<HTMLElement | undefined>;
};
