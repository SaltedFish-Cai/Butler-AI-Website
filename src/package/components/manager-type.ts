import { MSwitchV2OptionType } from "./m-switch-v2/type";
import { MSelectV2OptionsType } from "./m-select-v2/type";

import { MFormV2ItemType, MFormV2Ref } from "./m-form-v2/type";
import { MTableV2ItemType, MTableV2Type } from "./m-table-v2/type";

import { MManagerV2Type as MManagerV2ConfigType } from "./m-manager-v2/type";
// type MOptionType = {
//   [x: string]: MOptionType;
// };

export namespace MOptionV2Type {
  export type Select = MSelectV2OptionsType;
  export type SelectList = Array<MSelectV2OptionsType>;
  export type Switch = MSwitchV2OptionType;
  export type Default = { [x: string]: SelectList | Switch };
}

export namespace MStructureV2Type {
  export type FormV2 = MFormV2ItemType;
  export type TableV2 = MTableV2ItemType;
}

export namespace MRefV2Type {
  export type FormV2 = MFormV2Ref;
  export type TableV2 = MTableV2Type;
}

export type MManagerV2Type = MManagerV2ConfigType;
