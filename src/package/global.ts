/**
 * **模块导入**
 * @description 导入全局状态管理 Store
 * */
import { useBaseStore as GlobalStateType } from "./components/store/index";

/**
 * **模块导入**
 * @description 导入国际化时间格式化工具
 * */
import toLocaleString from "./components/tools/toLocaleString";

/**
 * **模块导入**
 * @description 导入 Pancake 全局配置类型定义
 * */
import { PancakeGlobalConfigType } from "./components/pa-manager/types";

declare module "vue" {
  interface GlobalComponents {}
  interface AppContext {
    globalMethods: {
      getManagerV2GlobalZIndex: () => number;
    };
  }
}

/**
 * **对象类型**
 * @description 通用键值对对象类型定义
 * */
export type objectType = {
  [x: string]: any;
};

/**
 * **语言键类型**
 * @description 支持的语言标识类型
 * */
export type languageKey = "en-US" | "zh-CN";

interface LogFunctions {
  info: (textOrTitle: string, content?: string) => void;
  error: (textOrTitle: string, content?: string) => void;
  warning: (textOrTitle: string, content?: string) => void;
  success: (textOrTitle: string, content?: string) => void;
  msg: (textOrTitle: string, content?: string) => void;
}

declare global {
  interface Window {
    log: LogFunctions;

    Sortable: any;
    jsPreviewExcel: any;
    jsPreviewDocx: any;
    jsPreviewPdf: any;
    // eslint-disable-next-line spellcheck/spell-checker
    Pdfh5: any;
    wangEditor: any;
    MTableSortableData: {};
    globalZIndex: number;
    getPaAnagerGlobalZIndex: () => number;
    PancakeGlobalConfig: PancakeGlobalConfigType & {
      language: languageKey;
      escapeMap?: string[];
      PopoverList?: {
        [x: string]: () => void;
      };
    };
    setManagerTheme: (themeColor: string, isDark: boolean) => void;
    setManagerThemeDark: (val: any) => void;
    getManagerTableGlobalConfig: () => {
      isKeepAliveTableWidth: boolean;
      isAutoTableWidth: boolean;
      isTableTextCopy: boolean;
      tableGlobalZoom: number;
    };
    MGlobalState: {
      (): ReturnType<typeof GlobalStateType>;
    };
    toLocaleString: typeof toLocaleString;

    MScrollbarObject: {
      [x: string]: any;
    };
    MScrollbarToError: () => void;

    developLog: {
      log: (msg: number | string, id: number | string, type?: string) => void;
      json: (json: any, mgs: string, type?: string) => void;
    };
    passport: string;

    managerPageScale: number;

    $t: (key: string) => string;
  }
  interface log {
    info: (title: string, message?: any) => any;
    error: (title: string, message?: any) => any;
    warning: (title: string, message?: any) => any;
    success: (title: string, message?: any) => any;
    msg: (title: string, message?: any) => any;
  }
  type objectType = Record<string, any>;
}
