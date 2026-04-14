export type TagListType = Array<{
  label: string;
  value: boolean | number | string;
}>;

export type MTagV2Type = {
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
   * **标签值**
   * @type `Array<string|number>`
   * @default `[]`
   * @description 标签值
   * @example
   * ```tsx
   * <m-tag-v2 modelValue={['1', '2']} />
   * ```
   * */
  tagList: TagListType;

  /**
   * **是否折叠**
   * @type `boolean`
   * @default `false`
   * @description 是否折叠
   * @example
   * ```tsx
   * <m-tag-v2 modelValue={['1', '2']} useCollapse />
   * ```
   * */
  useCollapse?: boolean;

  /**
   * **弹出层宽度**
   * @type `number`
   * @default `200`
   * @description 弹出层宽度
   * @example
   * ```tsx
   * <m-tag-v2 modelValue={['1', '2']} popoverWidth={200} />
   * ```
   * */
  popoverWidth?: number;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 是否禁用
   * @example
   * ```tsx
   * <m-tag-v2 modelValue={['1', '2']} disabled />
   * ```
   * */
  disabled?: boolean;
};
