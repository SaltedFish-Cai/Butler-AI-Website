// # Import

export const useSortHooks = (state, getTableList) => {
  // #Function 排序更改
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

  // #Function 保存 表格结构
  function handleColSetting({ Filter, Col }) {
    if (Col) {
      // handleCloseDrawer({ Col });
      const _filters = Filter.filter(item => String(item.fieldValue)?.length);
      for (let index = 0; index < _filters.length; index++) {
        const element = _filters[index];
        state.tableQuery.AdvancedFilter = state.tableQuery.AdvancedFilter.filter(item => {
          return item.fieldName != element.fieldName;
        });
      }
    } else {
      for (let index = 0; index < Filter.length; index++) {
        const element = Filter[index];

        state.tableQuery.AdvancedFilter = state.tableQuery.AdvancedFilter.filter(item => item.fieldName != element.fieldName);

        // const Col: any = settingColumns.value;
        // const findIndex = Col.findIndex(item => item.prop == element.fieldName);
        // if (findIndex > -1) {
        //   if (isTimeType(Col[findIndex], true)) {
        //     Col[findIndex].searchCriteria[element.conditionalType == 3 ? 0 : 1] = element.fieldValue.split(" ")[0];
        //   } else {
        //     Col[findIndex].searchCriteria = isSelectType(Col[findIndex], true)
        //       ? element.fieldValue.split(",")
        //       : element.fieldValue;
        //   }
        // }
      }
    }

    getTableList({ Filter });
  }

  return {
    // ...toRefs(state),
    handleSortChange,
    handleColSetting
  };
};
