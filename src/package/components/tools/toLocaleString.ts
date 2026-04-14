import { useBaseStore } from "../store/index";

function toLocaleString(value, type = "money", option = { minimumFractionDigits: 2, maximumFractionDigits: 2 }) {
  if (!value) return value;
  const globalState = useBaseStore();
  const language = globalState.getLanguage;

  if (value?.toLocaleString && type == "money") {
    return value.toLocaleString(language, option);
  }
}
export default toLocaleString;
