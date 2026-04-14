// # Import
import { ComputedRef, inject, reactive, toRefs } from "vue";

import inBrowser from "../../tools/inBrowser";
import { GetConditionals } from "../../api/table-v2";
import { MOptionV2Type } from "../../manager-type";
import { ManagerGlobalConfigType } from "../../m-manager-v2/type";

export const useSeniorFilterHooks = () => {
  // # Var
  const state = reactive({
    seniorFilterOptions: { LineConditional: [] as MOptionV2Type.SelectList, linkOptions: [] as MOptionV2Type.SelectList },
    seniorFilterData: { visible: false, propItem: {} as Record<string, string> }
  });
  const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
  if (inBrowser && ManagerGlobalConfig.value?.table_config?.advancedQueryApi) {
    GetDictionaries();
  }

  // #Function 获取高级搜索关系字典
  async function GetDictionaries() {
    const Data = await GetConditionals(ManagerGlobalConfig.value, "link");
    state.seniorFilterOptions.LineConditional = Data.ConditionalType;

    const List = await GetConditionals(ManagerGlobalConfig.value, "group", { keys: "FilterLinkNextType" });
    state.seniorFilterOptions.linkOptions = List.FilterLinkNextType;
  }

  // #Function 设置高级搜索字典（计算类型）
  function setConditionalType(value: string) {
    const { LineConditional } = state.seniorFilterOptions;
    const findData = LineConditional.find(item => item.Value == value);
    return findData?.Description;
  }

  // #Function 设置高级搜索字典（上下关系）
  function setRelationshipGroupLinkType(value: string) {
    const { linkOptions } = state.seniorFilterOptions;
    const findData = linkOptions.find(item => item.Value == value);
    return findData?.Description;
  }

  // #Function 打开高级搜索
  function openSeniorFilter(propItem: Record<string, string>) {
    if (propItem) {
      state.seniorFilterData = { visible: true, propItem };
    }
  }

  return {
    ...toRefs(state),
    openSeniorFilter,
    setConditionalType,
    setRelationshipGroupLinkType
  };
};
