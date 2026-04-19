import PaMediaViewItem from "./pa-media-view-item.vue";
import PaMediaView from "./pa-media-view.vue";
import inBrowser from "../tools/inBrowser";

if (inBrowser) {
  const script1 = typeof window !== "undefined" && window.document?.createElement("script") || {};
  script1.src = "/DocumentToDms/library/pdf.js";
  script1.onload = () => {
    const script = typeof window !== "undefined" && window.document?.createElement("script") || {};
    script.src = "/DocumentToDms/library/pdfh5.js";
    typeof window !== "undefined" && window.document?.head?.appendChild(script);
  };
  typeof window !== "undefined" && window.document?.head?.appendChild(script1);

  const script2 = typeof window !== "undefined" && window.document?.createElement("script") || {};
  script2.src = "/DocumentToDms/library/pdf.worker.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(script2);

  const script3 = typeof window !== "undefined" && window.document?.createElement("script") || {};
  script3.src = "/DocumentToDms/library/jquery-3.6.0.min.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(script3);

  const link = typeof window !== "undefined" && window.document?.createElement("link") || {};
  link.rel = "stylesheet";
  link.href = "/DocumentToDms/library/pdfh5.min.css";
  typeof window !== "undefined" && window.document?.head?.appendChild(link);

  // const mammoth = typeof window !== "undefined" && window.document?.createElement("script") || {};
  // mammoth.src = "https://cdn.jsdelivr.net/npm/mammoth-style-plus@1.7.2-5/mammoth.browser.min.js";
  // typeof window !== "undefined" && window.document?.head?.appendChild(mammoth);

  // const zip = typeof window !== "undefined" && window.document?.createElement("script") || {};
  // zip.src = "/DocumentToDms/library/jszip.min.js";
  // typeof window !== "undefined" && window.document?.head?.appendChild(zip);

  // const docx = typeof window !== "undefined" && window.document?.createElement("script") || {};
  // docx.src = "/DocumentToDms/library/docx-preview.js";
  // typeof window !== "undefined" && window.document?.head?.appendChild(docx);

  // word
  const docxScript = typeof window !== "undefined" && window.document?.createElement("script") || {};
  docxScript.src = "/DocumentToDms/library/docx@1.6.4.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(docxScript);

  const docxCss = typeof window !== "undefined" && window.document?.createElement("link") || {};
  docxCss.rel = "stylesheet";
  docxCss.href = "/DocumentToDms/library/docx@1.6.4.css";
  typeof window !== "undefined" && window.document?.head?.appendChild(docxCss);

  // excel
  const excelScript = typeof window !== "undefined" && window.document?.createElement("script") || {};
  excelScript.src = "/DocumentToDms/library/excel@1.7.14.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(excelScript);

  const excelCss = typeof window !== "undefined" && window.document?.createElement("link") || {};
  excelCss.rel = "stylesheet";
  excelCss.href = "/DocumentToDms/library/excel@1.7.14.css";
  typeof window !== "undefined" && window.document?.head?.appendChild(excelCss);
}

const install = function (app) {
  if (!app._context.components["PaMediaView"]) {
    app.component("PaMediaViewItem", PaMediaViewItem);
    app.component("PaMediaView", PaMediaView);
  }
};
export default {
  name: "PaMediaView",
  install
};
