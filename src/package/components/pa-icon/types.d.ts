// # Import
import { LanguagePackageType } from "../manager-type";

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
   * @description 当设置该值时，会自定义类名
   * */
  class?: Array<string> | string;

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会自定义样式
   * */
  style?: Record<string, string>;

  /**
   * **Icon的名称**
   * @type `string`
   * @default `magic_line`
   * @description Icon的名称，数据从[Icon库](https://dms.bbraun.cn/DocumentToDms/document/ManagerUI/m-icon/readme.html#icon-选择)中获取
   * */
  name?: string;

  /**
   * **鼠标悬停Icon时提示**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 鼠标悬停时显示的提示信息
   * */
  tip?: LanguagePackageType | string;

  /**
   * **点击Icon执行方法**
   * @type `(event: any) => void` | `undefined`
   * @default `undefined`
   * @description 点击Icon时执行的回调函数
   * */
  onClick?: (event: any) => void;
};
