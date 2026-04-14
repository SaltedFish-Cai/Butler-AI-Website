export type MColorTypeV2 = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * */
  id?: string;

  /**
   * **自定义类名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * */
  class?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;

  /**
   * **初始颜色值**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的初始颜色值
   * */
  value?: string;

  /**
   * **当前选中的颜色值**
   * @type `string`
   * @default `#000000`
   * @description 当设置该值时，会作为组件的初始颜色值
   * */
  modelValue?: string;

  /**
   * **是否禁用状态**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，组件为禁用状态
   * */
  disabled?: boolean;

  /**
   * **是否支持透明度**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，支持选择透明色
   * */
  showAlpha?: boolean;

  /**
   * **是否显示颜色值输入框**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示颜色值输入框
   * */
  showInput?: boolean;

  /**
   * **预设颜色列表**
   * @type `string[]`
   * @default `undefined`
   * @description 当设置该值时，会显示预设颜色列表
   * */
  presetColors?: string[];

  /**
   * **颜色变化时的回调函数**
   * @type `(color: string) => void`
   * @default `undefined`
   * @description 当颜色变化时，会触发该回调函数
   * */
  onChange?: (color: string) => void;

  /**
   * **颜色选择器打开时的回调函数**
   * @type `() => void`
   * @default `undefined`
   * @description 当颜色选择器打开时，会触发该回调函数
   * */
  onOpen?: () => void;

  /**
   * **颜色选择器关闭时的回调函数**
   * @type `() => void`
   * @default `undefined`
   * @description 当颜色选择器关闭时，会触发该回调函数
   * */
  onClose?: () => void;
};
