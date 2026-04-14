// # Import
import { defineAsyncComponent } from "vue";
import { GlobalState } from "./store/type";
import Log from "./tools/log";
import { useBaseStore as globalState } from "./store/index";
import { setThemeColor } from "./tools/color";
import { useBaseStore as tableBaseStore } from "./m-table/hooks/store";
import toLocaleString from "./tools/toLocaleString";

import "./styles/index.scss";
import "./styles/pt-size.scss";
import "./styles/flex.scss";
import "./styles/animation.scss";

function installPackage() {
  const ScriptList = [
    "/library/wangeditor.js",

    "/library/xlsx.full.min.js",

    "/library/pdf.js",
    "/library/pdf.worker.js",
    "/library/jquery-3.6.0.min.js",
    "/library/docx@1.6.4.js",
    "/library/excel@1.7.14.js",

    "/library/sortable.js"
  ];
  for (let index = 0; index < ScriptList.length; index++) {
    const src = ScriptList[index];
    const script = window.document?.createElement("script") || {};
    script.src = src;
    if (src.includes("pdf.js")) {
      script.onload = () => {
        const ScriptList = ["/library/pdfh5.js"];
        for (let index = 0; index < ScriptList.length; index++) {
          const src = ScriptList[index];
          const script = window.document?.createElement("script") || {};
          script.src = src;
          window.document?.head?.appendChild(script);
        }
      };
    }
    window.document?.head?.appendChild(script);
  }

  // setTimeout(() => {
  //   const ScriptList = ["/library/pdfh5.js"];
  //   for (let index = 0; index < ScriptList.length; index++) {
  //     const src = ScriptList[index];
  //     const script = window.document?.createElement("script") || {};
  //     script.src = src;
  //     window.document?.head?.appendChild(script);
  //   }
  // }, 300);

  const LinkList = [
    "/library/pdfh5.min.css",
    "/library/docx@1.6.4.css",
    "/library/excel@1.7.14.css"
  ];

  for (let index = 0; index < LinkList.length; index++) {
    const href = LinkList[index];
    const link = window.document?.createElement("link") || {};
    link.rel = "stylesheet";
    link.href = href;
    window.document?.head?.appendChild(link);
  }
}

// # Dev Install
const Component = {
  install: async (app, options: GlobalState) => {
    installPackage();
    const {
      themeColor = "#254679",
      isDark = false,
      requestHeader,
      tableConfig = {},
      formConfig = {},
      size = "default",
      apiBaseUrl = ""
    } = options;
    const { info, error, warning, success, msg } = Log();
    window.log = { info, error, warning, success, msg };
    window.toLocaleString = toLocaleString;

    const components: any = import.meta.glob("./m-*/m-*.vue");
    if (Object.keys(components).length == 0) {
      return;
    }
    window.log.msg("SaltedU", "正在使用开发版");
    for (const path in components) {
      const name = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
      if (!name.includes("v2")) {
        app.component(name, defineAsyncComponent(components[path]));
      }
    }
    const useGlobalState = globalState();

    if (!window.setManagerTheme) window.setManagerTheme = setThemeColor;
    const setManagerThemeDark = val => setThemeColor(themeColor, val);
    if (!window.setManagerThemeDark) window.setManagerThemeDark = setManagerThemeDark;
    setThemeColor(themeColor, isDark);

    const SIZE_MAP_MORE = {
      small: {
        "--el-component-base-size-default": "24px",
        "--el-font-base-size-default": "12px"
      },
      default: {
        "--el-component-base-size-default": "28px",
        "--el-font-base-size-default": "13px"
      },
      large: {
        "--el-component-base-size-default": "32px",
        "--el-font-base-size-default": "15px"
      }
    };

    const SIZE_MAP = {
      // El
      "--el-scrollbar-width": "12px",
      "--el-component-size-large": "32px",
      "--el-component-size": "28px",
      "--el-component-size-small": "24px",
      // V1
      // "--m-component-font-base": "13px",
      // "--m-component-height-base": "28px",
      // "--m-component-padding-base": "10px",

      ...SIZE_MAP_MORE[size]
    };

    for (const key in SIZE_MAP) {
      window.document.documentElement?.style?.setProperty(key, SIZE_MAP[key]);
    }

    if (!window.MGlobalState) window.MGlobalState = globalState;
    if (!window.MTableState) window.MTableState = tableBaseStore;

    const data = { themeColor, isDark, requestHeader, tableConfig, formConfig, size, apiBaseUrl, globalZIndex: 3000 };
    useGlobalState.setGlobalConfig(data);

    window.lggs = arg => console.log("===========> ", arg);
    window.lj = arg => console.log("===========> ", JSON.parse(JSON.stringify(arg)));
    window.ln = () => {
      console.log(" ");
      console.log(" ");
    };

    // 下方异步注入
    // const components = import.meta.glob("@/package/m-*/index.ts");
    // for (const path in components) {
    //   const name = path.split("/")[path.split("/").length - 2];
    //   const _components: any = await components[path]();
    //   const componentName = _components.default.name;
    //   delete app._context.components[componentName];
    //   app.use(_components.default);
    // }
  }
};

export default Component;
