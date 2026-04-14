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
   * **Icon的名称**
   * @type `string`
   * @default `magic_line`
   * @description 当设置该值为 `undefined` 时，会使用默认值
   * @description 当设置该值为 `string` 时，会使用该值作为Icon的名称
   * @description 该值的类型为 `string`，可以是任意类型
   * @example
   * ```tsx
   * <MoIcon name="magic_line" />
   * ```
   * */
  name?: string;

  /**
   * **鼠标悬停Icon时提示**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `undefined` 时，不会显示提示
   * @description 当设置该值为 `string` 时，会显示提示
   * @description 该值的类型为 `string`，可以是任意类型
   * @example
   * ```tsx
   * <MoIcon tip="这是一个Icon" />
   * ```
   * */
  tip?: string;

  /**
   * **点击Icon执行方法**
   * @type `() => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `() => void` 时，会执行该方法
   * @description 当设置该值为 `undefined` 时，不会执行方法
   * @description 该值的类型为 `() => void` | `undefined`，可以是任意类型
   * @example
   * ```tsx
   * <MoIcon onClick={() => { console.log('点击了Icon') }} />
   * ```
   * */
  onClick?: (event: any) => void;
};
