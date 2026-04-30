/**
 * @module pa-scrollbar-list
 * @description 滚动列表组件类型定义
 */
/**
 * PaScrollbarList 组件 Props
 * @type {ComponentProps}
 * @description 滚动列表组件的属性类型
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
  /**
   * 样式模式
   * @type `"color"` | `"default"` | `undefined`
   * @default `"default"`
   * @description 当设置该值为 `"color"` 时，会将滚动条的样式设置为颜色样式
   */
  styleMode?: "color" | "default";
  /**
   * 请求表格数据的 Api
   * @type `(params: any, id?: string) => Promise<any> | any` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为请求表格数据的 Api
   */
  requestApi?: (params: any, id?: string) => Promise<any> | any;
  /**
   * 行数据的 Key
   * @type `string` | `undefined`
   * @default `"id"`
   * @description 当设置该值时，会使用该值作为行数据的 Key
   */
  rowKey?: string;
  /**
   * 是否使用阴影
   * @type `boolean` | `undefined`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用阴影效果
   */
  useShadow?: boolean;
  /**
   * 是否显示回到顶部按钮
   * @type `boolean` | `undefined`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示回到顶部按钮
   */
  useBackTop?: boolean;
  /**
   * 是否显示分页器
   * @type `boolean` | `undefined`
   * @default `true`
   * @description 当设置该值为 `false` 时，会隐藏分页器
   */
  showPagination?: boolean;
  /**
   * 内边距方向
   * @type `Array<"all" | "bottom" | "left" | "right" | "top">` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为内边距方向
   */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;
  /**
   * 内边距宽度
   * @type `number` | `undefined`
   * @default `10`
   * @description 当设置该值时，会使用该值作为内边距宽度
   */
  paddingWidth?: number;
};
