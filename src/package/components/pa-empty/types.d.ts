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
   * **提示信息**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `暂无数据`
   * @description 当设置该值时，会显示空状态提示信息
   * */
  message?: LanguagePackageType | string;

  /**
   * **图标名称**
   * @type `string` | `undefined`
   * @default `folder_open_line`
   * @description 当设置该值时，会显示对应的图标
   * */
  icon?: string;
};
