import { MSwitchOptionType, MSelectOptionsType } from "./m-switch/type";

import { MFormItemType, MFormRef } from "./m-form/type";
import { MTableItemType, MTableRef } from "./m-table/type";

type MFormStructureType = MFormItemType;
type MFormRefType = MFormRef | undefined;

type MTableStructureType = MTableItemType;
type MTableRefType = MTableRef | undefined;

export type mFormStructureType = MFormStructureType;
export type mTableStructureType = MTableStructureType;
export type mSelectOptionType = MSelectOptionsType;
// type MOptionType = {
//   [x: string]: MOptionType;
// };
type MOptionType = MSelectOptionsType[] | MSwitchOptionType;

export namespace MOptionType {
  export type Select = MSelectOptionsType;
  export type Switch = MSwitchOptionType;
  export type Table = { [x: string]: MOptionType };
  export type Form = { [x: string]: MOptionType };
}

export namespace MStructureType {
  export type Form = MFormStructureType;
  export type Table = MTableStructureType;
}

export namespace MRefType {
  export type Form = MFormRefType;
  export type Table = MTableRefType;
}
