export type MIconV2Type = {
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
   * @description 当设置该值时，会自定义类名
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  class?: Array<string> | string;

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会自定义样式
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **提示信息**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会显示提示信息
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  message?: string;

  /**
   * **图标名称**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会显示图标
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  icon?: string;
};
