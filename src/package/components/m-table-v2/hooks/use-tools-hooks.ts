// # Import
// import { isSelectType, isTimeType } from "./isType";

export const useToolsHooks = (props, { mScrollbarListRef }) => {
  // #Function 设置高距离
  function setScrollTop(value: number, cellback?: () => void) {
    const el = document.querySelector(`#${props.id} .m-table-v2_body_header`);
    let _elHeaderHeight = 0;
    if (el?.clientHeight) {
      _elHeaderHeight = el.clientHeight;
    }
    mScrollbarListRef.value?.setScrollTop?.(value - _elHeaderHeight);
    cellback?.();
  }

  return {
    // ...toRefs(state),
    setScrollTop
  };
};
