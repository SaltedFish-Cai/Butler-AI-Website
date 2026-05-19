/**
 * useSortHooks 排序钩子
 * @param state - 表格状态
 * @param getTableList - 获取表格数据方法
 * @returns 排序相关方法
 */
export const useSortHooks = (state: any, getTableList: any) => {
  /**
   * 处理排序变化
   * @param prop - 排序字段
   * @param order - 排序方向
   * @description 更新排序字段并重新请求数据
   */
  function handleSortChange({ prop, order }: { prop: string; order: "ascending" | "descending" | null }) {
    state.useOrderPropName = prop;
    getTableList({
      Page: { PageNum: 1, PageSize: state.pageable.PageSize },
      Sort: order ? [{ SortKey: prop, SortValue: order }] : []
    });
  }
  /**
   * 保存表格结构
   * @param Filter - 筛选数据
   * @param Col - 列数据
   * @description 保存筛选和列配置并重新请求数据
   */
  function handleColSetting({ Filter }: { Filter: any; Col?: any }) {
    for (let index = 0; index < Filter.length; index++) {
      const element = Filter[index];
      state.tableQuery.AdvancedFilter = state.tableQuery.AdvancedFilter.filter((item: any) => item.fieldName != element.fieldName);
    }
    getTableList({ Filter });
  }
  return { handleSortChange, handleColSetting };
};
