import MMediaViewV2Item from "./m-media-view-v2-item.vue";
import MMediaViewV2 from "./m-media-view-v2.vue";
import inBrowser from "../tools/inBrowser";

if (inBrowser) {
  const useDomain = window.location.href.includes("Saltedfish-Website") ? "/Saltedfish-Website" : "";

  const script1 = window.document?.createElement("script") || {};
  script1.src = useDomain + "/library/pdf.js";
  script1.onload = () => {
    const script = window.document?.createElement("script") || {};
    script.src = useDomain + "/library/pdfh5.js";
    window.document?.head?.appendChild(script);
  };
  window.document?.head?.appendChild(script1);

  const script2 = window.document?.createElement("script") || {};
  script2.src = useDomain + "/library/pdf.worker.js";
  window.document?.head?.appendChild(script2);

  const script3 = window.document?.createElement("script") || {};
  script3.src = useDomain + "/library/jquery-3.6.0.min.js";
  window.document?.head?.appendChild(script3);

  const link = window.document?.createElement("link") || {};
  link.rel = "stylesheet";
  link.href = useDomain + "/library/pdfh5.min.css";
  window.document?.head?.appendChild(link);

  // const mammoth = window.document?.createElement("script") || {};
  // mammoth.src = "https://cdn.jsdelivr.net/npm/mammoth-style-plus@1.7.2-5/mammoth.browser.min.js";
  // window.document?.head?.appendChild(mammoth);

  // const zip = window.document?.createElement("script") || {};
  // zip.src = useDomain + "/library/jszip.min.js";
  // window.document?.head?.appendChild(zip);

  // const docx = window.document?.createElement("script") || {};
  // docx.src = useDomain + "/library/docx-preview.js";
  // window.document?.head?.appendChild(docx);

  // word
  const docxScript = window.document?.createElement("script") || {};
  docxScript.src = useDomain + "/library/docx@1.6.4.js";
  window.document?.head?.appendChild(docxScript);

  const docxCss = window.document?.createElement("link") || {};
  docxCss.rel = "stylesheet";
  docxCss.href = useDomain + "/library/docx@1.6.4.css";
  window.document?.head?.appendChild(docxCss);

  // excel
  const excelScript = window.document?.createElement("script") || {};
  excelScript.src = useDomain + "/library/excel@1.7.14.js";
  window.document?.head?.appendChild(excelScript);

  const excelCss = window.document?.createElement("link") || {};
  excelCss.rel = "stylesheet";
  excelCss.href = useDomain + "/library/excel@1.7.14.css";
  window.document?.head?.appendChild(excelCss);
}

const install = function (app) {
  if (!app._context.components["MMediaViewV2"]) {
    app.component("MMediaViewV2Item", MMediaViewV2Item);
    app.component("MMediaViewV2", MMediaViewV2);
  }
};
export default {
  name: "MMediaViewV2",
  install
};
