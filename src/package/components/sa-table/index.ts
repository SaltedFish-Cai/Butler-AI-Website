// # Import
import SaTable from "./sa-table.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaTable"]) app.component("SaTable", SaTable);
};

export default {
  name: "SaTable",
  install
};
