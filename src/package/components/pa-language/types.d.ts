import { LanguagePackageType } from "../manager-type";

export type ComponentProps = {
  id?: string;
  renderId?: string;
  class?: Array<string> | string;
  style?: Record<string, string>;
  /** 多语言文本包，根据当前语言环境显示对应文本 */
  text?: LanguagePackageType;
};
