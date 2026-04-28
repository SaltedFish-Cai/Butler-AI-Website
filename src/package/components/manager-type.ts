import { PaFormItemType, PaFormRef } from "./pa-form/type";
import { PaTableItemType, PaTableType } from "./pa-table/type";
import { PaManagerType } from "./pa-manager/type";

export type LanguageKey = "en-US" | "zh-CN";
export type LanguagePackageType = Record<LanguageKey, string>;

export type PaSelectOptionsType = {
  /**
   * **数据标题**
   * @type `string`
   * */
  label: LanguagePackageType | string;

  /**
   * **数据值**
   * @type `boolean` | `number` | `string`
   * @description 数据值的类型为 `boolean` | `number` | `string`，可以是任意类型
   * */
  value: boolean | number | string | undefined;

  /**
   * **子数据**
   * @type `Array<MSelectOptionsType>`
   * @description 子数据的类型为 `Array<MSelectOptionsType>`，可以是任意类型
   * */
  children?: Array<PaSelectOptionsType>;

  /**
   * **父数据**
   * @type `MSelectOptionsType`
   * @description 父级的类型为 `MSelectOptionsType`，可以是任意类型
   * */
  parent?: PaSelectOptionsType;

  /**
   * **是否禁用该选项**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，该选项将被禁用
   * @description 当设置该值为 `false` 时，该选项将不会被禁用
   * */
  disabled?: boolean;

  /**
   * **源数据**
   * @type `object`
   * @description 源数据的类型为 `object`，可以是任意类型
   * */
  base?: Record<string, string>;

  /**
   * **tag样式配置**
   * @type `object`
   * @type `bgColor` 背景颜色
   * @type `textColor` 文字颜色
   * @description tag样式配置的类型为 `object`，可以是任意类型
   * */
  tagStyle?: { bgColor?: string; textColor?: string };
};

export type PaSwitchOptionType = {
  /**
   * **打开值**
   * @type `boolean` | `number` | `string`
   * */
  activeValue?: boolean | number | string;

  /**
   * **关闭值**
   * @type `boolean` | `number` | `string`
   * */
  inActiveValue?: boolean | number | string;

  /**
   * **打开标题**
   * @type `string` | `{ [key: "en-US" | "zh-CN"]: string }`
   * */
  activeText?: LanguagePackageType | string;

  /**
   * **关闭标题**
   * @type `string` | `{ [key: "en-US" | "zh-CN"]: string }`
   * */
  inActiveText?: LanguagePackageType | string;

  /**
   * **打开图标**
   * @type `string`
   * */
  activeIcon?: string;

  /**
   * **关闭图标**
   * @type `string`
   * */
  inActiveIcon?: string;
};

export namespace PaOptionType {
  export type Select = PaSelectOptionsType;
  export type SelectList = Array<PaSelectOptionsType>;
  export type Switch = PaSwitchOptionType;
  export type Default = { [x: string]: SelectList | Switch };
}

export namespace PaStructureType {
  export type FormV2 = PaFormItemType;
  export type TableV2 = PaTableItemType;
}

export namespace PaRefType {
  export type FormV2 = PaFormRef;
  export type TableV2 = PaTableType;
}

export type PancakeUIType = PaManagerType;
