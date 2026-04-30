/**
 * @description useToolsHooks 工具钩子
 * @param props 组件属性
 * @param mScrollbarListRef 滚动条引用
 * @returns 工具方法
 */
export const useToolsHooks = (props: any, { mScrollbarListRef }: any) => {
  /**
   * @description 设置滚动条顶部距离
   * @param value 目标距离值
   * @param cellback 回调函数
   */
  function setScrollTop(value: number, cellback?: () => void) {
    const el = document.querySelector(`#${props.id} .pa-table_body_header`);
    let _elHeaderHeight = 0;
    if (el?.clientHeight) {
      _elHeaderHeight = el.clientHeight;
    }
    mScrollbarListRef.value?.setScrollTop?.(value - _elHeaderHeight);
    cellback?.();
  }
  return { setScrollTop };
};
