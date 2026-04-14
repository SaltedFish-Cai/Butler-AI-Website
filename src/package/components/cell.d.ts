import { MInputV2Type } from "./m-input-v2/type";
import { MNumberV2Type } from "./m-number-v2/type";
import { MCheckboxV2Type } from "./m-checkbox-v2/type";
import { MRadioV2Type } from "./m-radio-v2/type";
import { MSelectV2Type } from "./m-select-v2/type";
import { MSwitchV2Type } from "./m-switch-v2/type";
import { MTimeV2Type } from "./m-time-v2/type";
import { MCascaderV2Type } from "./m-cascader-v2/type";
import { MSelectIconV2Type } from "./m-select-icon-v2/type";
import { MFileV2Type } from "./m-file-v2/type";

export type MCellV2Type =
  | MCascaderV2Type
  | MInputV2Type
  | MSelectV2Type
  | MTimeV2Type
  | (MCheckboxV2Type & { type?: "checkbox" })
  | (MFileV2Type & { type: "file" })
  | (MNumberV2Type & { type?: "number" })
  | (MRadioV2Type & { type?: "radio" })
  | (MSelectIconV2Type & { type: "select-icon" })
  | (MSwitchV2Type & { type?: "switch" });

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type MCellItemV2Type = StrictUnion<MCellV2Type>;
