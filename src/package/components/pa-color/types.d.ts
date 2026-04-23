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
   * **当前选中的颜色值**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的初始颜色值
   * */
  modelValue?: string;

  /**
   * **是否禁用状态**
   * @type `boolean`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，组件为禁用状态
   * */
  disabled?: boolean;

  /**
   * **是否支持透明度**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，支持选择透明色
   * */
  useAlpha?: boolean;

  /**
   * **是否显示颜色值输入框**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示颜色值输入框
   * */
  useInput?: boolean;

  /**
   * **预设颜色列表**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会显示预设颜色列表
   * */
  presetColors?: Array<string>;
};
