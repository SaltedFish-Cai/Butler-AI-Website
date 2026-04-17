// # Import
import SaEditor from "./sa-editor.vue";
import inBrowser from "../tools/inBrowser";

// # Var
if (inBrowser) {
  const script = window.document?.createElement("script") || {};
  const useDomain = window.location.href.includes("Pancakefish-Website") ? "/Pancakefish-Website" : "";
  script.src = useDomain + "/library/wangeditor.js";
  window.document?.head?.appendChild(script);
}

// #Function install
const install = function (app) {
  if (!app._context.components["SaEditor"]) app.component("SaEditor", SaEditor);
};

export default {
  name: "SaEditor",
  install
};
