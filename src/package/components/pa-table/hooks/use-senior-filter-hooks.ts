// # Import
import { ComputedRef, inject, reactive, toRefs } from "vue";

import inBrowser from "../../tools/inBrowser";
import { GetConditionals } from "../../api/table";
import { PaOptionType } from "../../manager-type";
import { PancakeGlobalConfigType } from "../../pa-manager/type";

export const useSeniorFilterHooks = () => {
  // # Var
  const state = reactive({
    seniorFilterOptions: { LineConditional: [] as PaOptionType.SelectList, linkOptions: [] as PaOptionType.SelectList },
    seniorFilterData: { visible: false, propItem: {} as Record<string, string> }
  });
  const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
  if (inBrowser && PancakeGlobalConfig.value?.table_config?.advancedQueryApi) {
    GetDictionaries();
  }

  // #Function 获取高级搜索关系字典
  async function GetDictionaries() {
    const Data: any = await GetConditionals(PancakeGlobalConfig.value, "link");
    state.seniorFilterOptions.LineConditional = Data.ConditionalType;
    const List: any = await GetConditionals(PancakeGlobalConfig.value, "group", { keys: "FilterLinkNextType" });
    state.seniorFilterOptions.linkOptions = List.FilterLinkNextType;
  }

  // #Function 设置高级搜索字典（计算类型）
  function setConditionalType(value: string) {
    const { LineConditional } = state.seniorFilterOptions;
    const findData = (LineConditional as any).find(item => item.value == value);
    return findData?.Description;
  }

  // #Function 设置高级搜索字典（上下关系）
  function setRelationshipGroupLinkType(value: string) {
    const { linkOptions } = state.seniorFilterOptions;
    const findData = (linkOptions as any).find(item => item.Value == value);
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
