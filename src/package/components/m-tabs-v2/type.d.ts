// # type
export type MTabsV2Type = {
  /**
   * **多表时唯一ID**
   * @type `string`
   * @description 当设置该值时，会使用该值作为唯一ID
   * @example
   * ```ts
   * <m-table id="table1" :structure="structure" :requestApi="requestApi"></m-table>
   * ```
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
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **双向绑定值**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * */
  modelValue?: string;

  /**
   * **隐藏tabs方式**
   * @type `display` | `visible`
   * @default `visible`
   * @description 当设置该值为 `display` 时，会隐藏tabs内容元素
   * @description 当设置该值为 `visible` 时，不会隐藏tabs内容元素
   * @example
   * ```tsx
   * <MoTabsV2 visibleMode="display" />
   * ```
   * */
  visibleMode?: "display" | "visible";

  /**
   * **布局模式**
   * @type `portrait` | `slider` | `sticky` | `default`
   * @default `default`
   * @description 当设置该值为 `portrait` 时，会使用左侧栏布局
   * @description 当设置该值为 `slider` 时，会使用滚动布局
   * @description 当设置该值为 `sticky` 时，会使用黏性布局
   * @description 当设置该值为 `default` 时，会使用默认布局
   * @example
   * ```tsx
   * <MoTabsV2 mode="portrait" />
   * ```
   * */
  mode?: "default" | "portrait" | "slider" | "sticky";

  /**
   * **样式模式**
   * @type `default` | `card`
   * @default `default`
   * @description 当设置该值为 `default` 时，会使用默认样式
   * @description 当设置该值为 `card` 时，会使用卡片样式
   * @example
   * ```tsx
   * <MoTabsV2 styleMode="card" />
   * ```
   * */
  styleMode?: "card" | "default";

  /**
   * **对齐方式**
   * @type `edge` | `default`
   * @default `default`
   * @description 当设置该值为 `edge` 时，会使用边缘对齐
   * @description 当设置该值为 `default` 时，会使用默认对齐
   * @example
   * ```tsx
   * <MoTabsV2 align="edge" />
   * ```
   * */
  align?: "default" | "edge";

  /**
   * **是否使用底线**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用底线
   * @description 当设置该值为 `false` 时，不会使用底线
   * @example
   * ```tsx
   * <MoTabsV2 useHeaderLine={true} />
   * ```
   * */
  useHeaderLine?: boolean;

  /**
   * **是否使用滚动阴影**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会使用滚动阴影
   * @description 当设置该值为 `false` 时，不会使用滚动阴影
   * @example
   * ```tsx
   * <MoTabsV2 useShadow={true} />
   * ```
   * */
  useShadow?: boolean;

  /**
   * **Tab变更回调**
   * @type `({ name: string, index: number }) => void` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `({ name: string, index: number }) => void` 时，会使用该值作为Tab变更回调
   * @description 当设置该值为 `undefined` 时，不会使用Tab变更回调
   * @example
   * ```tsx
   * <MoTabsV2 onTabChange={(name, index) => { console.log(name, index) }} />
   * ```
   * */
  onTabChange?: ({ name: string, index: number }) => void;
};

export type MTabsV2ItemType = {
  /**
   * **Tab名称**
   * @type `number` | `string`
   * @description 当设置该值为 `number` 时，会使用该值作为Tab名称
   * @description 当设置该值为 `string` 时，会使用该值作为Tab名称
   * @example
   * ```tsx
   * <MoTabsV2Item label="Tab1" />
   * ```
   * */
  label: number | string;

  /**
   * **Tab唯一Key**
   * @type `number` | `string`
   * @description 当设置该值为 `number` 时，会使用该值作为Tab唯一Key
   * @description 当设置该值为 `string` 时，会使用该值作为Tab唯一Key
   * @example
   * ```tsx
   * <MoTabsV2Item name="Tab1" />
   * ```
   * */
  name: number | string;

  /**
   * **是否开启滚动**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会开启滚动
   * @description 当设置该值为 `false` 时，不会开启滚动
   * @example
   * ```tsx
   * <MoTabsV2Item scroll={true} />
   * ```
   * */
  scroll?: boolean;

  /**
   * **提示**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为提示
   * @example
   * ```tsx
   * <MoTabsV2Item tips="提示信息" />
   * ```
   * */
  tips?: string;

  /**
   * **懒加载**
   * @type `boolean` | `number`
   * @default `1000`
   * @description 当设置该值为 `true` 时，该组件会懒加载
   * @description 当设置该值为 `false` 时，该组件不会懒加载
   * @description 当设置该值为 `number` 时，该组件会懒加载，延迟加载时间为该值
   * @example
   * ```tsx
   * <MoTabsV2Item lazy={true} />
   * <MoTabsV2Item lazy={1000} />
   * ```
   * */
  lazy?: boolean | number;

  /**
   * **是否使用内边距**
   * @type `Array<"top" | "left" | "bottom" | "right" | "all">`
   * @default `[]`
   * @description 当设置该值为 `["top", "left"]` 时，使用内边距
   * @description 当设置该值为 `[]` 时，不使用内边距
   * @example
   * ```tsx
   * <MoDialog padding="['top', 'left']" />
   * ```
   * */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;

  /**
   * **是否使用水平滚动**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用水平滚动
   * @description 当设置该值为 `false` 时，不会使用水平滚动
   * @example
   * ```tsx
   * <MoTabsV2Item useScrollX={true} />
   * ```
   * */
  useScrollX?: boolean;
};

export type MTabsV2ItemTitleType = {
  slots: any;
  activeName: string;
  changeTabs: any;
  portrait: boolean;
};
