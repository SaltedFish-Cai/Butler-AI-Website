// _Import
import { defineAsyncComponent } from "vue";
import pinia from "./components/store/pinia";
import inBrowser from "./components/tools/inBrowser";
import { useBaseStore as globalState } from "./components/store/index";
import packageFile from "./version.json";
import dictionaries from "./components/tools/dictionaries";
import dictionariesAll from "./components/tools/dictionaries-all";
import Log from "./components/tools/log";
import { setThemeColor } from "./components/tools/color";
import toLocaleString from "./components/tools/toLocaleString";

import { M_Notification, M_Message, M_MessageBox } from "./components/feedback";

import "./components/style.scss";
import "./components/styles/index.scss";
import "./components/styles/pt-size.scss";
import "./components/styles/flex.scss";
import "./components/styles/animation.scss";

// import "../../styles/mp.scss";

import { GlobalState } from "./components/store/type";

// input

// _Function install
const install = function (app, options: GlobalState) {
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

  if (inBrowser) {
    window.log = { info, error, warning, success, msg };
    window.log.msg("SaltedU", "Version " + packageFile.version);
    window.toLocaleString = toLocaleString;
  }

  if (!app._context.components["SaltedU"]) {
    app.use(pinia);
    app.use(dictionaries);
    app.use(dictionariesAll);

    const components: any = import.meta.glob("./components/*/sa-*.vue");
    for (const path in components) {
      const name = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
      console.log("++++++2++++> name:", name);
      app.component(name, defineAsyncComponent(components[path]));
    }

    // if (!app.GlobalState) app.GlobalState = {};
    // if (!app.MTools) app.MTools = {};
    // if (!app.GlobalState.MGlobalState) app.GlobalState.MGlobalState = globalState;
    // if (!app.GlobalState.MTableState) app.GlobalState.MTableState = tableBaseStore;

    if (inBrowser) {
      if (!window.setManagerTheme) window.setManagerTheme = setThemeColor;
      const setManagerThemeDark = val => setThemeColor(themeColor, val);
      if (!window.setManagerThemeDark) window.setManagerThemeDark = setManagerThemeDark;
      setThemeColor(themeColor, isDark);

      if (!window.MGlobalState) window.MGlobalState = globalState;

      const useGlobalState = globalState();
      const data = { themeColor, isDark, requestHeader, tableConfig, formConfig, size, apiBaseUrl };
      useGlobalState.setGlobalConfig(data);
    }
  }
};

export default {
  name: "SaltedU",
  install
};

export {};

export { dictionaries, dictionariesAll, M_Notification, M_Message, M_MessageBox };
