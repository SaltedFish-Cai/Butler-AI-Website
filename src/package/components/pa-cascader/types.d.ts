/**
 * @module pa-cascader/types
 * @description PaCascader 类型定义
 */
/**
 * 模块导入
 * @description 导入选项类型和多语言类型定义
 */
import { PaOptionType, LanguagePackageType } from "../manager-type";
/**
 * 组件属性类型
 * @description 级联选择器组件的属性定义
 */
/**
 * 组件属性
 * @type object
 * @description PaCascader 组件的属性类型定义
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
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
  /**
   * 双向绑定值
   * @type Array<number | string> | number | string | undefined
   * @default undefined
   * @description 当设置该值时，会绑定该值
   */
  modelValue?: Array<number | string> | number | string;
  /**
   * 表单项标签
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标签
   */
  title?: LanguagePackageType | string;
  /**
   * 表单项标签宽度
   * @type string | undefined
   * @default undefined
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标签宽度
   */
  titleWidth?: string;
  /**
   * 是否使用'AA-aa'格式的选项值模式
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，返回值为'AA-aa'格式的选项值
   */
  useValueBylink?: boolean;
  /**
   * 是否使用'AA/aa'格式的选项标签模式
   * @type boolean | undefined
   * @default true
   * @description 当设置该值为 `true` 时，会显示'AA/aa'格式的选项标签
   */
  useTextByLink?: boolean;
  /**
   * 纯展示数据
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会显示该值
   */
  displayValue?: string;
  /**
   * 类型
   * @type 'cascader-check' | 'cascader' | 'multiple-cascader-check' | 'multiple-cascader'
   * @default 'cascader'
   * @description 当设置该值时，会使用该值作为类型
   */
  type?: "cascader-check" | "cascader" | "multiple-cascader-check" | "multiple-cascader";
  /**
   * 外置数据
   * @type Array<PaOptionType.Select> | undefined
   * @default undefined
   * @description 当设置该值时，会使用该值作为配置数据
   */
  exOptions?: PaOptionType.SelectList;
  /**
   * 表单项占位符
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 当设置该值为 `string` 时，会使用该值作为表单项占位符
   */
  placeholder?: LanguagePackageType | string;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，会禁用该组件
   */
  disabled?: boolean;
  /**
   * 纯展示模式
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   */
  display?: boolean;
  /**
   * 显示清除按钮
   * @type boolean | undefined
   * @default true
   * @description 当设置该值为 `true` 时，会显示清除按钮
   */
  clearable?: boolean;
  /**
   * Teleport 目标
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，会将组件挂载到指定的目标元素下
   */
  teleportInContainer?: boolean;
  /**
   * 对比数据
   * @type Array<number | string> | number | string | undefined
   * @default undefined
   * @description 当设置该值时，会使用该值作为对比数据
   */
  contrastData?: Array<number | string> | number | string;
  /**
   * 是否显示对比数据
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，会显示对比数据
   */
  alwaysContrast?: boolean;
};
/**
 * 组件事件类型
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 更新绑定值事件
   * @param value - | number | string 新的绑定值
   * @returns void
   */
  (e: "update:modelValue", value: Array<number | string> | number | string): void;
  /**
   * 值变更事件
   * @param payload - 变更数据
   * @returns void
   */
  (
    e: "change",
    payload: {
      value: Array<number | string> | number | string;
      oldValue: Array<number | string> | number | string;
      option: PaOptionType.Select;
    }
  ): void;
};
