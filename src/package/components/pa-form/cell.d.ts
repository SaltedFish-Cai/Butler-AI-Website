import { MElementDateType } from "../m-elements/time/index";
import { MElementIconType } from "../m-elements/icon/index";
import { MElementAddressType } from "../m-elements/address/index";
import { MElementTransferType } from "../m-elements/transfer/index";

import { MCascaderType } from "../m-cascader/type";
import { MCheckboxType } from "../m-checkbox/type";
import { MRadioType } from "../m-radio/type";
import { MSelectType } from "../m-select/type";
import { MSwitchType } from "../m-switch/type";
import { MFileType } from "../m-file/type";
import { MNumberType } from "../m-number/type";
import { MInputType } from "../m-input/type";
import { PaFormChildType } from "./type";
import { PaOptionType, LanguagePackageType } from "../manager-type";

export type CellItemType =
  | MElementAddressType
  | MElementDateType
  | MElementIconType
  | MElementTransferType
  | (MCascaderType & {
      prop?: string;
      type: "cascader-check" | "cascader" | "multiple-cascader-check" | "multiple-cascader";
      displayProp?: string;
      options?: PaOptionType.SelectList;
    })
  | (MCheckboxType & { prop?: string; type: "checkbox"; options?: PaOptionType.SelectList })
  | (MFileType & { prop?: string; type: "file"; fileAttached?: Record<string, string> })
  | (MInputType & { prop?: string; type: "input" | "textarea" })
  | (MNumberType & { prop?: string; type: "number"; clearOnValue?: number })
  | (MRadioType & { prop?: string; type: "radio"; options?: PaOptionType.SelectList })
  | (MSelectType & {
      prop?: string;
      type:
        | "multiple-online-select"
        | "multiple-request-select"
        | "multiple-select"
        | "online-select"
        | "request-select"
        | "select";
      displayProp?: string;
      requestBy?: string;
      options?: PaOptionType.SelectList;
    })
  | (MSwitchType & { prop?: string; type: "switch"; options?: PaOptionType.SelectList });

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type OtherType = {
  type?: "address" | "clickTag" | "null" | "slot" | "tag";
  disabled?: boolean; // 禁用状态
  display?: boolean;
};

type GroupFromConfigType = PaFormChildType & {
  /**
   * **多语言表单项标题**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标题
   * */
  label?: LanguagePackageType | string;
  value: boolean | number | string;
  childLabel?: string;
};

export type GroupType = {
  type?: "group";
  groupFormConfig?: GroupFromConfigType[];
  disabled?: boolean; // 禁用状态
  display?: boolean;
};

export type TabsType = {
  type?: "tabs-form";
  titleKey?: string; // 分栏tab标题使用字段
  titleLabel?: LanguagePackageType | string; // 多语言tab标题使用字段
  tabsFormConfig?: PaFormChildType[];
  disabled?: boolean;
  contrastKey?: string;
  contrastUse?: string;
};
