/**
 * @description 导入类型定义
 */
import { ButtonTypeV2Is } from "@/package/components/pa-button/type";
import { LanguagePackageType } from "../manager-type";

/**
 * @description Playground 页面按钮类型
 * @type object
 */
export type PaPlaygroundPageButtonType = {
  /** @type string @default undefined @description 按钮唯一标识 */
  buttonId?: string;
  /** @type LanguagePackageType @default undefined @description 按钮文本 */
  text: LanguagePackageType;
  /** @type "danger" | "default" | "info" | "primary" | "success" | "warning" @default undefined @description 按钮类型 */
  type: "danger" | "default" | "info" | "primary" | "success" | "warning";
  /** @type string @default undefined @description 图标名称 */
  icon: string;
  /** @type "dialog" | "HeaderCenter" | "HeaderLeft" | "operation" | "ToolButtonInline" @default undefined @description 使用类型 */
  useType?: "dialog" | "HeaderCenter" | "HeaderLeft" | "operation" | "ToolButtonInline";
  /** @type ButtonTypeV2Is @default undefined @description 按钮类型 */
  is?: ButtonTypeV2Is;
  /** @type LanguagePackageType @default undefined @description 内置按钮文本 */
  isText?: LanguagePackageType;
  /** @type "Built" | "Custom" @default undefined @description 样式类型 */
  styleType: "Built" | "Custom";
  /** @type string | "delete" | "dialog" | "jump" | "null" | "save" @default undefined @description 操作类型 */
  actionType: string | "delete" | "dialog" | "jump" | "null" | "save";
  /** @type string @default undefined @description 跳转目标 */
  jumpTarget?: string;
  /** @type Array<string> @default undefined @description 传递数据字段 */
  transmitData?: Array<string>;
  /** @type string @default undefined @description API 标识 */
  actionApiId?: string;
  /** @type string @default undefined @description 弹窗内容标识 */
  dialogContentId?: string;
  /** @type "l" | "m" | "max" | "s" @default undefined @description 弹窗尺寸 */
  dialogSize?: "l" | "m" | "max" | "s";
  /** @type Array<PaPlaygroundPageButtonType> @default undefined @description 弹窗内容按钮列表 */
  dialogContentButtons?: Array<PaPlaygroundPageButtonType>;
  /** @type LanguagePackageType | string @default undefined @description 弹窗标题 */
  dialogTitle?: LanguagePackageType | string;
  /** @type string @default undefined @description 弹窗副标题键名 */
  dialogSubTitle?: string;
  /** @type number @default undefined @description 保存后关闭弹窗 */
  closeBySave?: number;
  /** @type number @default undefined @description 弹窗关闭后刷新 */
  refreshByDialogClose?: number;
  /** @type number @default undefined @description 弹窗滚动 */
  dialogScroll?: number;
  /** @type any @default undefined @description 其他属性 */
  [x: string]: any;
};
