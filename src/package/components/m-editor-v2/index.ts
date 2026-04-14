// # Import
import MEditorV2 from "./m-editor-v2.vue";
import inBrowser from "../tools/inBrowser";

// # Var
if (inBrowser) {
  const script = window.document?.createElement("script") || {};
  const useDomain = window.location.href.includes("Saltedfish-Website") ? "/Saltedfish-Website" : "";
  script.src = useDomain + "/library/wangeditor.js";
  window.document?.head?.appendChild(script);
}

// #Function install
const install = function (app) {
  if (!app._context.components["MEditorV2"]) app.component("MEditorV2", MEditorV2);
};

export default {
  name: "MEditorV2",
  install
};
