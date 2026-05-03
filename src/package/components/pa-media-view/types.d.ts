/**
 * @module pa-media-view
 * @description 媒体展示查看器组件类型定义
 */
/**
 * 对象类型
 * @description 对象类型
 */
type objectType = Record<string, any>;
/**
 * PaMediaViewItem 组件 Props
 * @type {ComponentItemProps}
 * @description 媒体查看器子项组件的属性类型
 */
export type ComponentItemProps = {
  /**
   * 组件唯一标识
   * @type string | `undefined`
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | `string` | `undefined`
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string | number> | `undefined`
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, number | string>;
  /**
   * 文件源对象
   * @type object | `undefined`
   * @default undefined
   * @description 当设置该值时，会使用该值作为文件源对象
   */
  file?: objectType;
  /**
   * 文件路径
   * @type string | `undefined`
   * @default undefined
   * @description 当设置该值时，会使用该值作为文件路径
   */
  filePath?: string;
  /**
   * 文件名称
   * @type string | `undefined`
   * @default undefined
   * @description 当设置该值时，会使用该值作为文件名称
   */
  fileName?: string;
  /**
   * 原始文件名称
   * @type string | `undefined`
   * @default undefined
   * @description 当设置该值时，会使用该值作为原始文件名称
   */
  OriginalName?: string;
  /**
   * 文件名称（备选字段）
   * @type string | `undefined`
   * @default undefined
   * @description 当设置该值时，会使用该值作为文件名称
   */
  FileName?: string;
};
/**
 * PaMediaView 组件 Props
 * @type {ComponentProps}
 * @description 媒体查看器组件的属性类型
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | `undefined`
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | `string` | `undefined`
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string | number> | `undefined`
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, number | string>;
  /**
   * 文件列表
   * @type Array<ComponentItemProps> | `undefined`
   * @default undefined
   * @description 当设置该值时，会使用该值作为文件列表
   */
  fileList?: Array<ComponentItemProps>;
  /**
   * 是否隐藏开启按钮
   * @type boolean | `undefined`
   * @default false
   * @description 当设置该值为 `true` 时，隐藏开启按钮
   */
  hideBtn?: boolean;
};
