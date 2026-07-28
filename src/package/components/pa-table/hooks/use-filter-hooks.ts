/**
 * @description vue 响应式相关导入
 */
import { computed, inject } from "vue";
/**
 * @description PaTableUseType 类型导入
 */
import { PaTableUseType } from "../types";
/**
 * @description M_MessageBox 反馈组件
 */
import { M_MessageBox } from "../../feedback";
/**
 * @description useFilterHooks 筛选钩子
 * @param props 组件属性
 * @param state 表格状态
 * @param language 语言配置
 * @returns 筛选相关方法和计算属性
 */
export const useFilterHooks = (props: any, state: any, language: any) => {
  const Query = computed(handleQueryChange);
  const AdvancedQuery = computed(handleAdvancedQueryChange);
  const injectGetTableList = inject("getTableList") as (
    exQuery?: PaTableUseType.TableQueryType,
    _Observer?: {
      createObserver?: () => void;
      closeObserver?: () => void;
    }
  ) => Promise<void>;
  /**
   * @description 保存高级搜索筛选
   * @param AdvancedFilter 高级筛选数据
   */
  function handleSeniorSetting({ AdvancedFilter }: { AdvancedFilter: any }) {
    if (!AdvancedFilter.relationshipGroup.length) {
      handleRemoveSenior(AdvancedFilter);
      return;
    }
    state.tableQuery.Filter = state.tableQuery.Filter.filter((item: any) => {
      return item.fieldName != AdvancedFilter.fieldName;
    });
    const baseData = JSON.parse(JSON.stringify(state.tableQuery?.AdvancedFilter)) || [];
    const index = baseData.findIndex((item: any) => item.fieldName == AdvancedFilter.fieldName);
    if (index < 0) {
      baseData.push(AdvancedFilter);
    } else {
      baseData.splice(index, 1, AdvancedFilter);
    }
    injectGetTableList({ AdvancedFilter: baseData });
  }
  /**
   * @description 返回普通筛选query
   * @returns 筛选数据
   */
  function handleQueryChange() {
    const mapData = state.tableQuery?.Filter?.map(
      (item: { fieldLabel: string; fieldValue: string; fieldName: string; conditionalType: 1 | 6 }) => {
        if (item.conditionalType == 6) {
          const array = item.fieldValue
            .split(",")
            .map((item: string) => (item == "true" ? true : item == "false" ? false : item));
          const data: any = {
            relationshipGroup: [] as Record<string, boolean | number | string | null>[],
            conditionalType: item.conditionalType,
            label: item.fieldLabel,
            value: item.fieldValue,
            relValue: item.fieldValue,
            props: item.fieldName
          };
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let value: any = { text: element };
            const exOptions = props.exOptions[item.fieldName];
            if (exOptions) {
              const exValue = exOptions.find((item: any) => item.value == element);
              value = { text: typeof exValue?.label === "object" ? exValue?.label[language.value] : exValue?.label };
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
      .filter((data: any) => data);
    return mapData;
  }
  /**
   * @description 返回高级搜索query
   * @returns 高级筛选数据
   */
  function handleAdvancedQueryChange() {
    const _advanced_filter = state.tableQuery?.AdvancedFilter;
    const exData = JSON.parse(JSON.stringify(_advanced_filter));
    return exData;
  }
  /**
   * @description 删除已筛选数据
   * @param item 筛选项
   * @param byColumn 按列删除标识
   */
  function handleRemoveQ(item: { label: string; props: string; conditionalType: number; relValue: string }, byColumn?: string) {
    const FILTER = JSON.parse(JSON.stringify(state.tableQuery?.Filter || {}));
    if (item.conditionalType == 1 || item.conditionalType == 0) {
      const _filter = FILTER.filter((its: { fieldName: string }) => its.fieldName != item.props);
      injectGetTableList({ Filter: _filter });
    } else if (item.conditionalType == 6) {
      const _filter = FILTER.filter((its: any) => {
        if (its.fieldName == item.props) {
          const FieldValueArr = its.fieldValue.split(",");
          const _index = FieldValueArr.indexOf(item.relValue);
          FieldValueArr.splice(_index, 1);
          its.fieldValue = FieldValueArr.join(",");
        }
        return String(its.fieldValue).length;
      });
      injectGetTableList({ Filter: _filter });
    } else if (item.conditionalType == 3 || item.conditionalType == 5) {
      const _filter = FILTER.filter((its: { fieldName: string; conditionalType: number }) => {
        return its.fieldName != item.props || its.conditionalType != item.conditionalType;
      });
      if (!byColumn) injectGetTableList({ Filter: _filter });
    }
  }
  /**
   * @description 删除已筛选高级搜索数据
   * @param its 高级筛选项
   */
  function handleRemoveSenior(its: Record<string, string>) {
    const baseData = JSON.parse(JSON.stringify(state.tableQuery?.AdvancedFilter)) || [];
    const index = baseData.findIndex((item: any) => item.fieldName == its.fieldName);
    if (index > -1) {
      baseData.splice(index, 1);
    }
    injectGetTableList({ AdvancedFilter: baseData });
  }
  /**
   * @description 删除全部已筛选数据
   */
  function handleCleanAllQuery() {
    M_MessageBox.delete({
      message: { "en-US": "Are you sure you want to delete all filters?", "zh-CN": "确认删除所有筛选项吗？" },
      onConfirm: () => {
        injectGetTableList({ Filter: [] });
      }
    });
  }
  /**
   * @description 删除全部已筛选高级搜索数据
   */
  function handleCleanAllSeniorQuery() {
    M_MessageBox.delete({
      message: { "en-US": "Are you sure you want to delete all senior filters?", "zh-CN": "确认删除所有高级筛选项吗？" },
      onConfirm: () => {
        injectGetTableList({ AdvancedFilter: [] });
      }
    });
  }
  return {
    Query,
    AdvancedQuery,
    handleSeniorSetting,
    handleQueryChange,
    handleAdvancedQueryChange,
    handleRemoveQ,
    handleRemoveSenior,
    handleCleanAllQuery,
    handleCleanAllSeniorQuery
  };
};
