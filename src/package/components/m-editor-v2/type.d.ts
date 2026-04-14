// # Type
import { MFileV2Type } from "../m-file-v2/type";

export type MEditorV2Type = {
  /**
   * **编辑器ID**
   * - 类型为 `string`
   * - 当设置该值为 `string` 时，会使用该值作为编辑器ID
   * @example
   * ```tsx
   * <MoEditor id="editor-1" />
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
   * **模型值**
   * - 类型为 `string`
   * - 当设置该值为 `string` 时，会使用该值作为模型值
   * @example
   * ```tsx
   * <MoEditor modelValue="Hello World" />
   * ```
   * */

  modelValue: string;
  /**
   * **占位符**
   * - 类型为 `string`
   * - 当设置该值为 `string` 时，会使用该值作为占位符
   * @example
   * ```tsx
   * <MoEditor placeholder="请输入内容" />
   * ```
   * */
  placeholder?: string;

  /**
   * **外置编辑器按钮**
   * - 类型为 `Array<exButtonType>`
   * - 当设置该值为 `Array<exButtonType>` 时，会使用该值作为外置编辑器按钮
   * - exButtonType.icon 为按钮图标
   * - exButtonType.name 为按钮名称
   * - exButtonType.target 为按钮点击事件
   * @example
   * ```tsx
   * <MoEditor exButton={[{ icon: "el-icon-upload", name: "上传", target: () => { console.log("上传") } }]} />
   * ```
   * */
  exButton?: Array<{
    icon: string;
    name: string;
    target: Function;
    isActive?: boolean;
  }>;

  config: {
    /**
     * **上传文件配置**
     * - 类型为 `MFileType`
     * - 当设置该值为 `MFileType` 时，会使用该值作为上传文件配置
     * */
    uploadImage?: MFileV2Type;
  };
};

// 定义工具栏工具
export interface Tool {
  command: string;
  icon: string;
  title: string;
  value?: string;
  children?: Tool[];
  isActive?: boolean;
  foreColor?: string;
  backColor?: string;
  linkString?: string;
}
