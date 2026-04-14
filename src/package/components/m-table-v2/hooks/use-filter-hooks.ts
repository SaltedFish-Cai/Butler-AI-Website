import { ElMessageBox } from "element-plus";
import { computed, inject } from "vue";
import { MTableV2UseType } from "../type";

export const useFilterHooks = (props, state) => {
  const Query = computed(handleQueryChange);
  const AdvancedQuery = computed(handleAdvancedQueryChange);
  const injectGetTableList = inject("getTableList") as (
    exQuery?: MTableV2UseType.TableQueryType,
    _Observer?: {
      createObserver?: () => void;
      closeObserver?: () => void;
    }
  ) => Promise<void>;
  // #Function 保存高级搜索筛选
  function handleSeniorSetting({ AdvancedFilter }) {
    if (!AdvancedFilter.relationshipGroup.length) {
      handleRemoveSeniorQuery(AdvancedFilter);
      return;
    }

    state.tableQuery.Filter = state.tableQuery.Filter.filter(item => {
      return item.fieldName != AdvancedFilter.fieldName;
    });
    // settingColumns.value.map(item => {
    //   if (item.prop == AdvancedFilter.props) item.searchCriteria = "";
    //   // callbackColSetting(item);
    // });
    const baseData = JSON.parse(JSON.stringify(state.tableQuery?.AdvancedFilter)) || [];
    const index = baseData.findIndex(item => item.fieldName == AdvancedFilter.fieldName);
    if (index < 0) {
      baseData.push(AdvancedFilter);
    } else {
      baseData.splice(index, 1, AdvancedFilter);
    }
    injectGetTableList({ AdvancedFilter: baseData });
  }

  // #Function 返回普通筛选query
  function handleQueryChange() {
    const mapData = state.tableQuery?.Filter?.map(
      (item: { fieldLabel: string; fieldValue: string; fieldName: string; conditionalType: 1 | 6 }) => {
        if (item.conditionalType == 6) {
          const array = item.fieldValue.split(",").map(item => (item == "true" ? true : item == "false" ? false : item));
          const data = {
            relationshipGroup: [] as Record<string, boolean | number | string | null>[],
            conditionalType: item.conditionalType,
            label: item.fieldLabel,
            value: item.fieldValue,
            relValue: item.fieldValue,
            props: item.fieldName
          };

          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let value = {
              text: element
            };
            const exOptions = props.exOptions[item.fieldName];
            if (exOptions) {
              const exValue = exOptions.find(item => item.value == element);
              value = {
                text: exValue?.label
              };
            }

            data.relationshipGroup.push({
              conditionalType: item.conditionalType,
              label: item.fieldLabel,
              value: value?.text,
              relValue: element,
              props: item.fieldName
            });
          }
          return data;
        } else {
          return {
            relationshipGroup: [
              {
                conditionalType: item.conditionalType,
                label: item.fieldLabel,
                value: item.fieldValue,
                relValue: item.fieldValue,
                props: item.fieldName
              }
            ],
            conditionalType: item.conditionalType,
            label: item.fieldLabel,
            value: item.fieldValue,
            relValue: item.fieldValue,
            props: item.fieldName
          };
        }
      }
    )
      .flat(1)
      .filter(data => data);
    return mapData;
  }

  // #Function 返回高级搜索query
  function handleAdvancedQueryChange() {
    const _advanced_filter = state.tableQuery?.AdvancedFilter;
    const exData = JSON.parse(JSON.stringify(_advanced_filter));
    return exData;
  }

  // #Function 删除已筛选数据
  function handleRemoveQuery(
    item: { label: string; props: string; conditionalType: number; relValue: string },
    byColumn?: string
  ) {
    const FILTER = JSON.parse(JSON.stringify(state.tableQuery?.Filter || {}));
    if (item.conditionalType == 1 || item.conditionalType == 0) {
      // 输入框
      const _filter = FILTER.filter((its: { fieldName: string }) => its.fieldName != item.props);
      // callbackColSetting(item);
      injectGetTableList({ Filter: _filter });
    } else if (item.conditionalType == 6) {
      // 选项框
      const _filter = FILTER.filter(its => {
        if (its.fieldName == item.props) {
          const FieldValueArr = its.fieldValue.split(",");
          const _index = FieldValueArr.indexOf(item.relValue);
          FieldValueArr.splice(_index, 1);
          its.fieldValue = FieldValueArr.join(",");
        }
        return String(its.fieldValue).length;
      });
      // callbackColSetting(item);
      injectGetTableList({ Filter: _filter });
    } else if (item.conditionalType == 3 || item.conditionalType == 5) {
      // 开始日期
      const _filter = FILTER.filter((its: { fieldName: string; conditionalType: number }) => {
        return its.fieldName != item.props || its.conditionalType != item.conditionalType;
      });
      // callbackColSetting(item, false, item.conditionalType == 3 ? 0 : 1);
      if (!byColumn) injectGetTableList({ Filter: _filter });
    }
  }

  // #Function 删除已筛选高级搜索数据
  function handleRemoveSeniorQuery(its: Record<string, string>) {
    const baseData = JSON.parse(JSON.stringify(state.tableQuery?.AdvancedFilter)) || [];
    const index = baseData.findIndex(item => item.fieldName == its.fieldName);
    if (index > -1) {
      baseData.splice(index, 1);
    }
    injectGetTableList({ AdvancedFilter: baseData });
  }

  // #Function 删除全部已筛选数据
  function handleCleanAllQuery() {
    ElMessageBox.confirm("是否删除所有筛选项?", "温馨提示", {
      type: "error",
      confirmButtonText: "确认删除"
    }).then(() => {
      // callbackColSetting({}, true);
      injectGetTableList({ Filter: [] });
    });
  }

  // #Function 删除全部已筛选高级搜索数据
  function handleCleanAllSeniorQuery() {
    ElMessageBox.confirm("是否删除所有筛选项?", "温馨提示", {
      type: "error",
      confirmButtonText: "确认删除"
    }).then(() => {
      injectGetTableList({ AdvancedFilter: [] });
    });
  }

  return {
    Query,
    AdvancedQuery,

    handleSeniorSetting,
    handleQueryChange,
    handleAdvancedQueryChange,
    handleRemoveQuery,
    handleRemoveSeniorQuery,
    handleCleanAllQuery,
    handleCleanAllSeniorQuery
  };
};
