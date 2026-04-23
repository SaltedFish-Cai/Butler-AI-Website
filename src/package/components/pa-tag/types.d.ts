import { LanguagePackageType } from "../manager-type";

export type TagListType = Array<{
  label: LanguagePackageType | string;
  value: boolean | number | string | undefined;
}>;

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
   * **标签值**
   * @type `TagListType`
   * @default `[]`
   * @description 标签列表
   * */
  tagList: TagListType;

  /**
   * **是否折叠**
   * @type `boolean`
   * @default `false`
   * @description 是否折叠标签
   * */
  useCollapse?: boolean;

  /**
   * **弹出层宽度**
   * @type `number`
   * @default `200`
   * @description 弹出层宽度
   * */
  popoverWidth?: number;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 是否禁用标签删除功能
   * */
  disabled?: boolean;
};
