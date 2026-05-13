import { SaInputType } from "./pa-input/type";
import { SaNumberType } from "./pa-number/type";
import { SaCheckboxType } from "./pa-checkbox/type";
import { SaRadioType } from "./pa-radio/type";
import { SaSelectType } from "./pa-select/type";
import { SaSwitchType } from "./pa-switch/type";
import { SaTimeType } from "./pa-time/type";
import { SaCascaderType } from "./pa-cascader/type";
import { MSelectIconV2Type } from "./pa-select-icon/type";
import { SaFileType } from "./pa-file/type";

export type MCellV2Type =
  | SaCascaderType
  | SaInputType
  | SaSelectType
  | SaTimeType
  | (MSelectIconV2Type & { type: "select-icon" })
  | (SaCheckboxType & { type?: "checkbox" })
  | (SaFileType & { type: "file" })
  | (SaNumberType & { type?: "number" })
  | (SaRadioType & { type?: "radio" })
  | (SaSwitchType & { type?: "switch" });

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type MCellItemV2Type = StrictUnion<MCellV2Type>;
