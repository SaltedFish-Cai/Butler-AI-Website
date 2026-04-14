export type MPopoverV2Type = {
  /**
   * **弹窗标识**
   * @type `string`
   * @default ``
   * @description 弹窗标识
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
   * **弹窗类名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到弹窗的类名中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  popoverClass?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 是否禁用
   * */
  disabled?: boolean;

  /**
   * **弹窗挂载位置**
   * @type `string`
   * @default `body`
   * @description 弹窗挂载位置
   * */
  // eslint-disable-next-line spellcheck/spell-checker
  teleportTo?: string;

  /**
   * **弹窗位置**
   * @type `top` | `bottom`
   * @default `top`
   * @description 弹窗位置
   * */
  placement?: "bottom" | "top";

  /**
   * **触发方式**
   * @type `hover` | `click`
   * @default `click`
   * @description 触发方式
   * */
  trigger?: "click" | "hover";

  /**
   * **内容类名**
   * @type `string`
   * @default ``
   * @description 内容类名
   * */
  contentClassName?: string;

  /**
   * **弹出层宽度**
   * @type `number`
   * @default `200`
   * @description 弹出层宽度
   * */
  popoverWidth?: number;

  /**
   * **是否阻止事件冒泡**
   * @type `boolean`
   * @default `false`
   * @description 是否阻止事件冒泡
   * */
  stopPropagation?: boolean;

  /**
   * **是否自动宽度**
   * @type `boolean`
   * @default `true`
   * @description 是否自动宽度
   * */
  autoWidth?: boolean;

  /**
   * **是否点击外部关闭**
   * @type `boolean`
   * @default `true`
   * @description 是否点击外部关闭
   * */
  targetClose?: boolean;

  /**
   * **是否粘性**
   * @type `'left' | 'right' | undefined`
   * @default `undefined`
   * @description 是否粘性
   * */
  sticky?: "left" | "right" | undefined;

  /**
   * **弹窗关闭前触发**
   * @type `() => boolean`
   * @default `undefined`
   * @description 弹窗关闭前触发
   * */
  beforeClose?: () => boolean;
};
