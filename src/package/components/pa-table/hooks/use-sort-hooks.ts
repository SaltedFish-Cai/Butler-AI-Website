/**
 * @description useSortHooks 排序钩子
 * @param state 表格状态
 * @param getTableList 获取表格数据方法
 * @returns 排序相关方法
 */
export const useSortHooks = (state: any, getTableList: any) => {
  /**
   * @description 处理排序变化
   * @param prop 排序字段
   * @param order 排序方向
   */
  function handleSortChange({ prop, order }: { prop: string; order: "ascending" | "descending" | null }) {
    state.useOrderPropName = prop;
    getTableList({
      Page: {
        PageNum: 1,
        PageSize: state.pageable.PageSize
      },
      Sort: order ? [{ SortKey: prop, SortValue: order }] : []
    });
  }
  /**
   * @description 保存表格结构
   * @param Filter 筛选数据
   * @param Col 列数据
   */
  function handleColSetting({ Filter, Col }: { Filter: any; Col?: any }) {
    if (Col) {
      const _filters = Filter.filter((item: any) => String(item.fieldValue)?.length);
      for (let index = 0; index < _filters.length; index++) {
        const element = _filters[index];
        state.tableQuery.AdvancedFilter = state.tableQuery.AdvancedFilter.filter((item: any) => {
          return item.fieldName != element.fieldName;
        });
      }
    } else {
      for (let index = 0; index < Filter.length; index++) {
        const element = Filter[index];
        state.tableQuery.AdvancedFilter = state.tableQuery.AdvancedFilter.filter(
          (item: any) => item.fieldName != element.fieldName
        );
      }
    }
    getTableList({ Filter });
  }
  return { handleSortChange, handleColSetting };
};
