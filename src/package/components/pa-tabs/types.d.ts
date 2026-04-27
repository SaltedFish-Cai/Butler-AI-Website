/**
 * **模块导入**
 * @description 导入多语言类型定义
 * */
import { LanguagePackageType } from "../manager-type";

/**
 * **标签页布局模式**
 * @description 预设标签页布局类型
 * */
export type ComponentTabsMode = "default" | "portrait" | "slider" | "sticky";

/**
 * **标签页样式模式**
 * @description 预设标签页样式类型
 * */
export type ComponentTabsStyleMode = "border-card" | "card" | "default";

/**
 * **标签页对齐方式**
 * @description 预设标签页对齐方式类型
 * */
export type ComponentTabsAlign = "default" | "edge";

/**
 * **标签页隐藏方式**
 * @description 预设标签页隐藏方式类型
 * */
export type ComponentVisibleMode = "display" | "visible";

/**
 * **标签页内边距方向**
 * @description 预设标签页内边距方向类型
 * */
export type ComponentPadding = "all" | "bottom" | "left" | "right" | "top";

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
   * **双向绑定值**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定当前激活的标签页
   * */
  modelValue?: string;

  /**
   * **隐藏 tabs 方式**
   * @type `'display'` | `'visible'`
   * @default `visible`
   * @description 当设置该值为 `display` 时，隐藏 tabs 内容元素；`visible` 时不隐藏
   * */
  visibleMode?: ComponentVisibleMode;

  /**
   * **布局模式**
   * @type `'default'` | `'portrait'` | `'slider'` | `'sticky'`
   * @default `default`
   * @description 预设布局模式：`portrait` 左侧栏布局、`slider` 滚动布局、`sticky` 黏性布局、`default` 默认布局
   * */
  mode?: ComponentTabsMode;

  /**
   * **样式模式**
   * @type `'border-card'` | `'card'` | `'default'`
   * @default `default`
   * @description 预设样式模式：`card` 卡片样式、`default` 默认样式
   * */
  styleMode?: ComponentTabsStyleMode;

  /**
   * **对齐方式**
   * @type `'default'` | `'edge'`
   * @default `default`
   * @description `edge` 边缘对齐、`default` 默认对齐
   * */
  align?: ComponentTabsAlign;

  /**
   * **是否使用底线**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，使用底线
   * */
  useHeaderLine?: boolean;

  /**
   * **是否使用滚动阴影**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，使用滚动阴影
   * */
  useShadow?: boolean;
};

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
export type ComponentEmits = {
  /**
   * **更新模型值事件**
   * @param `value` `string` 更新的值
   * @returns `void`
   * */
  (e: "update:modelValue", value: string): void;

  /**
   * **标签页切换事件**
   * @param `name` `string` 标签页标识
   * @param `index` `number` 标签页索引
   * @returns `void`
   * */
  (e: "tabChange", name: string, index: number): void;
};

export type ComponentItemProps = {
  /**
   * **Tab 名称**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 标签页显示的名称
   * */
  label?: LanguagePackageType | string;

  /**
   * **Tab 唯一 Key**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 标签页的唯一标识
   * */
  name?: number | string;

  /**
   * **是否开启滚动**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，开启滚动
   * */
  scroll?: boolean;

  /**
   * **提示信息**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 标签页的提示信息
   * */
  tips?: string;

  /**
   * **懒加载**
   * @type `boolean` | `number` | `undefined`
   * @default `1000`
   * @description `true` 懒加载、`false` 不懒加载、`number` 延迟加载时间（毫秒）
   * */
  lazy?: boolean | number;

  /**
   * **是否使用内边距**
   * @type `Array<ComponentPadding>` | `undefined`
   * @default `[]`
   * @description 设置需要添加内边距的方向
   * */
  padding?: Array<ComponentPadding>;

  /**
   * **是否使用水平滚动**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，使用水平滚动
   * */
  useScrollX?: boolean;

  /**
   * **是否使用边框**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，使用边框
   * */
  useBorder?: boolean;
};

/**
 * **标签页标题类型**
 * @description 标签页标题组件的属性类型
 * */
export type ComponentLabelProps = {
  /**
   * **插槽内容**
   * @type `any | undefined`
   * @default `undefined`
   * @description 标签页标题的插槽内容
   * */
  slots?: any | undefined;

  /**
   * **当前激活的标签页名称**
   * @type `string`
   * @default `''`
   * @description 当前选中的标签页标识
   * */
  activeName?: string;

  /**
   * **标签页切换函数**
   * @type `any | undefined`
   * @default `undefined`
   * @description 切换标签页时调用的回调函数
   * */
  changeTabs?: any | undefined;

  /**
   * **是否为纵向布局模式**
   * @type `boolean`
   * @default `false`
   * @description 当为 `true` 时，标签页以纵向布局显示
   * */
  portrait?: boolean;
};
