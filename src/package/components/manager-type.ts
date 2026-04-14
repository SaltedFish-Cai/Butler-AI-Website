import { SaSwitchOptionType } from "./sa-switch/type";
import { SaSelectOptionsType } from "./sa-select/type";

import { SaFormItemType, SaFormRef } from "./sa-form/type";
import { SaTableItemType, SaTableType } from "./sa-table/type";

import { MManagerV2Type as MManagerV2ConfigType } from "./sa-content/type";
// type MOptionType = {
//   [x: string]: MOptionType;
// };

export namespace MOptionV2Type {
  export type Select = SaSelectOptionsType;
  export type SelectList = Array<SaSelectOptionsType>;
  export type Switch = SaSwitchOptionType;
  export type Default = { [x: string]: SelectList | Switch };
}

export namespace MStructureV2Type {
  export type FormV2 = SaFormItemType;
  export type TableV2 = SaTableItemType;
}

export namespace MRefV2Type {
  export type FormV2 = SaFormRef;
  export type TableV2 = SaTableType;
}

export type MManagerV2Type = MManagerV2ConfigType;
