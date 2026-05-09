/**
 * @module pa-icon/types
 * @description PaIcon 类型定义
 */
/**
 * 模块导入
 * @description 导入多语言类型定义
 */
import type { LanguagePackageType } from "../manager-type";

/**
 * 组件属性
 * @type object
 * @description 定义组件的属性类型
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   * @description 当设置该值时，会自定义类名
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 当设置该值时，会自定义样式
   */
  style?: Record<string, string>;
  /**
   * Icon的名称
   * @type string | undefined
   * @default 'magic_line'
   * @description Icon的名称，数据从[Icon库](https://dms.bbraun.cn/DocumentToDms/document/ManagerUI/m-icon/readme.html#icon-选择)中获取
   */
  name?: string;
  /**
   * 鼠标悬停Icon时提示
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 鼠标悬停时显示的提示信息
   */
  tip?: LanguagePackageType | string;
  /**
   * 字体
   * @type 'pa-iconfont' | 'butler-iconfont' | undefined
   * @default 'pa-iconfont'
   * @description 字体名称
   */
  fontFamily?: string;
  /**
   * 字体颜色
   * @type Array<string> | undefined
   * @default undefined
   * @description 字体颜色，数组元素为颜色值，数组长度为2
   */
  fontColor?: Array<string>;
};

/**
 * 组件事件
 * @type object
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 点击 Icon 事件
   * @param event - 鼠标事件对象
   * @returns void
   */
  (e: "click", event: MouseEvent): void;
};
