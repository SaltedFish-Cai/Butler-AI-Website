export interface toolsState {
  dictionaryData: {
    [x: string]: { timeout: number | string; data: MOptionType.Select[] };
  };
  // dictionaryTimeout: number;
  dictionaryMaxTime: number;
}

export interface apiType {
  url: string;
  type: string;
}

export interface GlobalState {
  /**
   * **组件主题色**
   * @type string
   * @default '#00aa90'
   * */
  themeColor?: string;

  /**
   * **是否为深色主题**
   * @type boolean
   * @default false
   * */
  isDark?: boolean;

  /**
   * **请求头**
   * @type objectType
   * */
  requestHeader?: objectType;

  /**
   * **api基础路径**
   * @type string
   * */
  apiBaseUrl?: string;

  /**
   * **组件大小**
   * @type "default" | "large" | "small"
   * @description 组件大小
   * @default "default"
   * */
  size?: "default" | "large" | "small";

  /**
   * **语言包**
   * @type "zh-CN" | "en-US"
   * @description 语言包
   * @default "zh-CN"
   * */
  language?: "en-US" | "zh-CN";

  /**
   * **语言包字典数据**
   * @type objectType
   * @description 语言包字典数据
   * */
  languagePackage?: {
    [key: string]: { [key: string]: string };
  };

  /**
   * **表格配置**
   * @type tableConfigType
   * @description 表格配置
   * @property `boolean` `tableConfigType.useSeniorFilter` 是否使用高级搜索
   * @property `objectType | ((params?: objectType) => objectType)` `tableConfigType.groupAdvancedQueryApi` 高级搜索api
   * @property `objectType | ((params?: objectType) => objectType)` `tableConfigType.advancedQueryApi` 高级搜索api
   * */
  tableConfig?: {
    useSeniorFilter?: boolean;
    groupAdvancedQueryApi?: objectType | ((params?: objectType) => objectType);
    advancedQueryApi?: objectType | ((params?: objectType) => objectType);
  };

  /**
   * **表单配置**
   * @type formConfigType
   * @description 表格配置
   * @property `boolean` `formConfigType.useSeniorFilter` addressApi
   * @property `apiType` `formConfigType.fileApi` 文件api
   * */
  formConfig?: {
    addressApi?: objectType | ((params?: objectType) => objectType);
    fileApi?: apiType & { fileApi: string; downloadApi: string };
  };

  /**
   * **全局z-index**
   * @type number
   * @description 全局z-index
   * @default 3000
   * */
  globalZIndex?: number;

  /**
   * **是否为打印状态**
   * @type boolean
   * @description 是否为打印状态
   * @default false
   * */
  isPrint?: boolean;
}
