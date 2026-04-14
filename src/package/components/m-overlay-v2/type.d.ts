// # Type
export type MOverlayV2Type = {
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
   * **自定义类名**
   * @type `string`
   * @default `''`
   * @description 自定义类名
   * @example
   * ```tsx
   * <MoDialog class="custom-class" />
   * ```
   * */
  class?: string[] | string;

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **是否使用阻塞**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会使用阻塞
   * @description 当设置该值为 `false` 时，会不使用阻塞
   * @example
   * ```tsx
   * <MoDialog use-block={false} />
   * ```
   * */
  useBlock?: boolean;

  /**
   * **目标元素**
   * @type `HTMLElement`
   * @default `null`
   * @description 目标元素
   * @example
   * ```tsx
   * <MoDialog teleportTo={document.body} />
   * ```
   * */
  teleportTo?: HTMLElement;
};
