import { defineStore } from "pinia";
import { GlobalState, toolsState } from "./type";
import piniaPersistConfig from "./piniaPersist";
import { MOptionType } from "MTypes";
import languageMap from "../language.json";

// # useBaseStore
export const useBaseStore = defineStore({
  id: "manager-ui-global-configs",
  state: (): GlobalState & toolsState => ({
    themeColor: "#254679",
    isDark: false,
    requestHeader: {},
    tableConfig: {},
    formConfig: {},
    apiBaseUrl: "",
    size: "default",

    dictionaryData: {},
    // dictionaryTimeout: 0,
    dictionaryMaxTime: 1000 * 60 * 30,
    language: "zh-CN",
    languagePackage: JSON.parse(JSON.stringify(languageMap))["zh-CN"],
    globalZIndex: 3000,
    isPrint: false
  }),
  getters: {
    /**
     * **获取请求头配置**
     * @returns 请求头配置
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getRequestHeader;
     * ```
     * */
    getRequestHeader: (state: GlobalState) => {
      return state.requestHeader;
    },

    /**
     * **获取组件大小配置**
     * @returns 组件大小配置
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getSize;
     * ```
     * */
    getSize: (state: GlobalState) => {
      return state.size;
    },

    /**
     * **获取表格配置**
     * @returns 表格配置
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getTableConfig;
     * ```
     * */
    getTableConfig: (state: GlobalState) => {
      return state.tableConfig;
    },

    /**
     * **获取表单配置**
     * @returns 表单配置
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getFormConfig;
     * ```
     * */
    getFormConfig: (state: GlobalState) => {
      return state.formConfig;
    },

    /**
     * **获取api基础路径**
     * @returns api基础路径
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getApiBaseUrl;
     * ```
     * */
    getApiBaseUrl: (state: GlobalState) => {
      return state.apiBaseUrl;
    },

    /**
     * **获取字典缓存子更新时间**
     * @returns 字典缓存时间
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getDictionaryTimeout;
     * ```
     * */
    // getDictionaryTimeout: (state: toolsState): number => state.dictionaryTimeout,

    /**
     * **获取字典缓存子最大时间**
     * @returns 字典缓存时间
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getDictionaryMaxTime;
     * ```
     * */
    getDictionaryMaxTime: (state: toolsState): number => state.dictionaryMaxTime,

    /**
     * **获取字典缓存数据**
     * @param key 字典key
     * @returns 字典缓存数据
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.getDictionary('key');
     * ```
     * */
    getDictionary: (state: toolsState) => {
      return (key: string): MOptionType.Select[] | undefined => {
        if (state.dictionaryData?.[key]) {
          const timeOut = new Date().getTime();
          const MAX_TIME_OUT = state.dictionaryMaxTime;
          const MDictionaryData = state.dictionaryData[key];
          if (MDictionaryData && timeOut - Number(MDictionaryData.timeout) < MAX_TIME_OUT) {
            const _data = MDictionaryData.data;
            return _data;
          } else {
            return undefined;
          }
        }
        return undefined;
      };
    },

    getLanguage: (state: GlobalState) => {
      return state.language;
    },

    getLanguagePackage: (state: GlobalState) => {
      return (key: string) => state.languagePackage?.[key] || {};
    }
  },
  actions: {
    /**
     * **设置全局配置**
     * 该方法会将全局配置设置到全局状态中，以便后续使用
     * @param GlobalState 全局配置
     * @type `GlobalState.themeColor` 为 `string` 主题颜色
     * @type `GlobalState.isDark` 为 `boolean` 是否为深色主题
     * @type `GlobalState.requestHeader` 为 `objectType` 请求头
     * @type `GlobalState.apiBaseUrl` 为 `string` api基础路径
     * @type `GlobalState.size` 为 `default` | `large` | `small` 组件大小
     * @type `GlobalState.tableConfig` 为 `tableConfigType` 表格配置
     * @type `GlobalState.formConfig` 为 `formConfigType` 表单配置
     * @returns 无返回值
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.setGlobalConfig({
     *  size: state.size
     * });
     * ```
     * */
    setGlobalConfig(config: GlobalState) {
      const _config = { ...this, ...config };
      this.themeColor = _config.themeColor;
      this.themeColor = _config.themeColor;
      this.isDark = _config.isDark;
      this.requestHeader = _config.requestHeader;
      this.tableConfig = _config.tableConfig;
      this.formConfig = _config.formConfig;
      this.apiBaseUrl = _config.apiBaseUrl;
      this.size = _config.size;
      this.language = _config.language;
      this.dictionaryMaxTime = _config.dictionaryMaxTime;
      this.globalZIndex = _config.globalZIndex;
      this.isPrint = config.isPrint || false;
      this.cleanDictionary();
      if (this.language) this.changeLanguage(this.language);

      window.document.documentElement?.style?.setProperty(
        "--el-component-base-size-default",
        28 + (this.size == "small" ? -4 : this.size == "large" ? 4 : 0) + "px"
      );
      window.document.documentElement?.style?.setProperty(
        "--el-font-base-size-default",
        13 + (this.size == "small" ? -1 : this.size == "large" ? 2 : 0) + "px"
      );

      // # 组件字体大小
      // window.document.documentElement?.style?.setProperty(
      //   "--m-component-font-size",
      //   13 + (this.size == "small" ? -1 : this.size == "large" ? 1 : 0) + "px"
      // );

      // # 组件高度
      // window.document.documentElement?.style?.setProperty(
      //   "--m-component-height-size",
      //   28 + (this.size == "small" ? -4 : this.size == "large" ? 1 : 0) + "px"
      // );

      // # 组件内边距
      // window.document.documentElement?.style?.setProperty(
      //   "--m-component-padding-size",
      //   10 + (this.size == "small" ? -3 : this.size == "large" ? 2 : 0) + "px"
      // );

      // # 组件字体大小
      // window.document.documentElement?.style?.setProperty("--m-component-font-base", 13 + "px");

      // # 组件高度
      // window.document.documentElement?.style?.setProperty("--m-component-height-base", 28 + "px");

      // # 组件内边距
      // window.document.documentElement?.style?.setProperty("--m-component-padding-base", 10 + "px");
    },

    /**
     * **设置字典缓存时间**
     * @param `time` 缓存时间，单位为毫秒
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.setDictionaryTimeout(12 * 60 * 60 * 1000);
     * ```
     * */
    // setDictionaryTimeout(time: number) {
    //   this.dictionaryTimeout = time;
    // },

    /**
     * **设置字典缓存数据**
     * 该方法会将字典数据缓存到全局状态中，以便后续使用
     * @param `key` 字典键名
     * @param `data` 字典数据
     * @type `key` 为 `string` 字典键名
     * @type `data` 为 `objectType[]` 字典数据
     * @returns 无返回值
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.setDictionary('DictionaryName', [{ label: 'Label1', value: 'Value1' }]);
     * ```
     * */
    setDictionary(key: string, data: MOptionType.Select[]) {
      this.dictionaryData[key] = {
        data,
        timeout: new Date().getTime()
      };

      // const _globalState = globalState();
      // const user: any = _globalState.getToken;
      // this.dictionaryData[key + user.Identifier] = data;
    },

    /**
     * **清除字典缓存数据**
     * @type `key` 为 `string` 字典键名
     * @returns 无返回值
     * @description 该方法用于清除字典缓存数据
     * @example
     * ```ts
     * const MGlobalState = window.MGlobalState();
     * MGlobalState.cleanDictionary('DictionaryName');
     * ```
     * */
    cleanDictionary() {
      this.dictionaryData = {};
    },

    changeLanguage(language: "en-US" | "zh-CN") {
      this.language = language;
      this.languagePackage = languageMap[language];
    }
  },
  persist: piniaPersistConfig("manager-ui-global-configs")
});
