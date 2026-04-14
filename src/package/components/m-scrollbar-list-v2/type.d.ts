export interface MScrollbarListV2Type {
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
   * **样式模型**
   * @type `"color"` | `"default"`
   * @default `"default"`
   * @description 当设置该值为 `"color"` 时，会将滚动条的样式设置为颜色样式
   * @description 当设置该值为 `"default"` 时，会将滚动条的样式设置为默认样式
   * */
  styleMode?: "color" | "default";

  /**
   * **请求表格数据的Api**
   * @type `(params: any, id?: string) => Promise<any> | any`
   * @param `params` 请求参数
   * @param `id` 表格的唯一ID
   * @returns `Promise<any> | any`
   * @description 当设置该值时，会使用该值作为请求表格数据的Api
   * @example
   * ```ts
   * <m-table :requestApi="requestApi"></m-table>
   * ```
   * */
  requestApi: (params: any, id?: string) => Promise<any> | any;

  /**
   * **行数据的 Key**
   * @type `string`
   * @default `id`
   * @description 当设置该值时，会使用该值作为行数据的 Key
   * @example
   * ```ts
   * <m-table rowKey="id"></m-table>
   * ```
   * */
  rowKey?: string;

  /**
   * @description 是否使用阴影
   * @default false
   */
  useShadow?: boolean;

  /**
   * @description 是否显示回到顶部按钮
   * @default false
   */
  useBackTop?: boolean;

  /**
   * @description 是否显示分页器
   * @default true
   */
  showPagination?: boolean;

  /**
   * @description 是否使用内边距
   * @default false
   */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * @description 内边距宽度
   * @default 10
   */
  paddingWidth?: number;
}
