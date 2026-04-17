import { SaSwitchOptionType } from "./sa-switch/type";
import { SaSelectOptionsType } from "./sa-select/type";

import { SaFormItemType, SaFormRef } from "./sa-form/type";
import { SaTableItemType, SaTableType } from "./sa-table/type";

import { PancakeUIType as MManagerV2ConfigType } from "./sa-content/type";
// type MOptionType = {
//   [x: string]: MOptionType;
// };

export namespace SaOptionType {
  export type Select = SaSelectOptionsType;
  export type SelectList = Array<SaSelectOptionsType>;
  export type Switch = SaSwitchOptionType;
  export type Default = { [x: string]: SelectList | Switch };
}

export namespace SaStructureType {
  export type FormV2 = SaFormItemType;
  export type TableV2 = SaTableItemType;
}

export namespace SaRefType {
  export type FormV2 = SaFormRef;
  export type TableV2 = SaTableType;
}

export type PancakeUIType = MManagerV2ConfigType;
