import { LanguageKey } from "../manager-type";

type apiType = {
  url: string;
  type: string;
};

type ConditionalType = {
  Value: string;
  Description: string;
  DictionaryExplanation: string;
  DescriptionEn: string;
};

type PancakeGlobal = {
  /**
   * **环境**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义环境
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  env?: string;
  /**
   * **API 基础 URL**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义 API 基础 URL
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  baseHost?: string;

  /**
   * **主题颜色**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义主题颜色
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  themeColor?: string;

  /**
   * **是否为暗黑模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义暗黑模式
   * @description 该值的类型为 `boolean`，可以是任意类型
   * */
  isDark?: boolean;

  /**
   * **大小**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义大小
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  size?: "default" | "large" | "small";

  /**
   * **表格配置**
   * @type `object` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义表格配置
   * @description 该值的类型为 `object`，可以是任意类型
   * */
  table_config: {
    groupAdvancedQueryApi?: apiType | { FilterLinkNextType: Array<ConditionalType> };
    advancedQueryApi?:
      | apiType
      | { ConditionalType: Array<ConditionalType>; SqlJoinType: Array<ConditionalType>; LineConditional: Array<ConditionalType> };
    useSeniorFilter?: boolean;
    infiniteScroll?: boolean;
  };

  /**
   * **地址 API**
   * @type `apiType` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义地址 API
   * @description 该值的类型为 `apiType`，可以是任意类型
   * */
  address_config: apiType;

  /**
   * **文件 API**
   * @type `apiType` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义文件 API
   * @description 该值的类型为 `apiType`，可以是任意类型
   * */
  file_config: apiType & { downloadHose: string; compareKey: string };

  /**
   * **请求头**
   * @type `any` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义请求头
   * @description 该值的类型为 `any`，可以是任意类型
   * */
  requestHeader: any;
};

export type PaManagerType = PancakeGlobal & {
  /**
   * **语言**
   * @type `LanguageKey` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义语言
   * @description 该值的类型为 `LanguageKey`，可以是任意类型
   * */
  language?: LanguageKey;
};

export type PancakeGlobalConfigType = PancakeGlobal & {
  /**
   * **语言**
   * @type `LanguageKey` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自定义语言
   * @description 该值的类型为 `LanguageKey`，可以是任意类型
   * */
  language?: {
    value: LanguageKey;
    package: Record<string, Record<string, string>>;
  };
};
