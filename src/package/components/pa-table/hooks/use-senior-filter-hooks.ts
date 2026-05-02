/**
 * @description vue 响应式相关导入
 */
import { ComputedRef, inject, reactive, toRefs } from "vue";
/**
 * @description 浏览器环境判断
 */
import inBrowser from "../../tools/inBrowser";
/**
 * @description 获取条件字典 API
 */
import { GetConditionals } from "../../api/table";
/**
 * @description PaOptionType 类型
 */
import { PaOptionType } from "../../manager-type";
/**
 * @description PancakeGlobalConfigType 类型
 */
import { PancakeGlobalConfigType } from "../../pa-manager/types";
/**
 * @description useSeniorFilterHooks 高级筛选钩子
 * @returns 高级筛选相关方法和状态
 */
export const useSeniorFilterHooks = () => {
  /**
   * @description 高级筛选状态
   */
  const state = reactive({
    seniorFilterOptions: { LineConditional: [] as PaOptionType.SelectList, linkOptions: [] as PaOptionType.SelectList },
    seniorFilterData: { visible: false, propItem: {} as Record<string, string> }
  });
  const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
  if (inBrowser && PancakeGlobalConfig.value?.table_config?.advancedQueryApi) {
    GetDictionaries();
  }
  /**
   * @description 获取高级搜索关系字典
   */
  async function GetDictionaries() {
    const Data: any = await GetConditionals(PancakeGlobalConfig.value, "link");
    state.seniorFilterOptions.LineConditional = Data.ConditionalType;
    const List: any = await GetConditionals(PancakeGlobalConfig.value, "group", { keys: "FilterLinkNextType" });
    state.seniorFilterOptions.linkOptions = List.FilterLinkNextType;
  }
  /**
   * @description 设置高级搜索字典（计算类型）
   * @param value 条件值
   * @returns 条件描述
   */
  function setConditionalType(value: string) {
    const { LineConditional } = state.seniorFilterOptions;
    const findData = (LineConditional as any).find((item: any) => item.value == value);
    return findData?.Description;
  }
  /**
   * @description 设置高级搜索字典（上下关系）
   * @param value 关系值
   * @returns 关系描述
   */
  function setRelationshipGroupLinkType(value: string) {
    const { linkOptions } = state.seniorFilterOptions;
    const findData = (linkOptions as any).find((item: any) => item.Value == value);
    return findData?.Description;
  }
  /**
   * @description 打开高级搜索
   * @param propItem 属性配置
   */
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
