import { SaInputType } from "./sa-input/type";
import { SaNumberType } from "./sa-number/type";
import { SaCheckboxType } from "./sa-checkbox/type";
import { SaRadioType } from "./sa-radio/type";
import { SaSelectType } from "./sa-select/type";
import { SaSwitchType } from "./sa-switch/type";
import { SaTimeType } from "./sa-time/type";
import { SaCascaderType } from "./sa-cascader/type";
import { MSelectIconV2Type } from "./sa-select-icon/type";
import { SaFileType } from "./sa-file/type";

export type MCellV2Type =
  | SaCascaderType
  | SaInputType
  | SaSelectType
  | SaTimeType
  | (SaCheckboxType & { type?: "checkbox" })
  | (SaFileType & { type: "file" })
  | (SaNumberType & { type?: "number" })
  | (SaRadioType & { type?: "radio" })
  | (MSelectIconV2Type & { type: "select-icon" })
  | (SaSwitchType & { type?: "switch" });

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type MCellItemV2Type = StrictUnion<MCellV2Type>;
