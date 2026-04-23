import { ButtonTypeV2Is } from "@/package/components/pa-button/type";
import { LanguagePackageType } from "../manager-type";

export type PaPlaygroundPageButtonType = {
  buttonId?: string;
  text: LanguagePackageType;
  type: "danger" | "default" | "info" | "primary" | "success" | "warning";
  icon: string;
  useType?: "dialog" | "HeaderCenter" | "HeaderLeft" | "operation" | "ToolButtonInline";
  is?: ButtonTypeV2Is;
  isText?: LanguagePackageType;
  styleType: "Built" | "Custom";
  actionType: string | "delete" | "dialog" | "jump" | "null" | "save";
  jumpTarget?: string;
  transmitData?: string[];
  actionApiId?: string;
  dialogContentId?: string;
  dialogSize?: "l" | "m" | "max" | "s";
  dialogContentButtons?: PaPlaygroundPageButtonType[];
  dialogTitle?: LanguagePackageType | string;
  dialogSubTitle?: string;
  closeBySave?: number;
  refreshByDialogClose?: number;
  dialogScroll?: number;
  [x: string]: any;
};
