import { useBaseStore as GlobalStateType } from "./components/store/index";
import { useBaseStore as TableBaseStoreType } from "./components/m-table/hooks/store";

import { GlobalState } from "./components/m-table/type";
import toLocaleString from "./components/tools/toLocaleString";
import { ManagerGlobalConfigType } from "./components/m-manager-v2/type";

// _Message global
declare module "vue" {
  interface GlobalComponents {}
  interface AppContext {
    globalMethods: {
      getManagerV2GlobalZIndex: () => number;
    };
  }
}

// type UnionKeys<T> = T extends T ? keyof T : never;
// type StrictUnionHelper<T, TAll> = T extends any ? Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> & T : never;
// type StrictUnion<T> = StrictUnionHelper<T, T>;

export type objectType = {
  [x: string]: any;
};

export type languageKey = "en-US" | "zh-CN";

declare global {
  interface Window {
    log: {
      info: (title: string, message?: any) => any;
      error: (title: string, message?: any) => any;
      warning: (title: string, message?: any) => any;
      success: (title: string, message?: any) => any;
      msg: (title: string, message?: any) => any;
    };
    Sortable: any;
    jsPreviewExcel: any;
    jsPreviewDocx: any;
    jsPreviewPdf: any;
    Pdfh5: any;
    wangEditor: any;
    MTableSortableData: {};
    globalZIndex: number;
    ManagerGlobalConfig: ManagerGlobalConfigType & {
      language: languageKey;
      PopoverList?: {
        [x: string]: () => void;
      };
    };
    setManagerTheme: (themeColor: string, isDark: boolean) => void;
    setManagerThemeDark: (val: any) => void;
    setManagerTableGlobalConfig: (config: GlobalState) => void;
    getManagerTableGlobalConfig: () => {
      isKeepAliveTableWidth: boolean;
      isAutoTableWidth: boolean;
      isTableTextCopy: boolean;
      tableGlobalZoom: number;
    };
    MGlobalState: {
      (): ReturnType<typeof GlobalStateType>;
    };
    MTableState: {
      (): ReturnType<typeof TableBaseStoreType>;
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
  }
  interface log {
    info: (title: string, message?: any) => any;
    error: (title: string, message?: any) => any;
    warning: (title: string, message?: any) => any;
    success: (title: string, message?: any) => any;
    msg: (title: string, message?: any) => any;
  }
  type objectType = {
    [x: string]: any;
  };
}
