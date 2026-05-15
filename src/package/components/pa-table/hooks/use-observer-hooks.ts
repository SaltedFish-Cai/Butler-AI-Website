/**
 * 模块导入
 * @description 导入 Vue nextTick
 */
import { nextTick } from "vue";
/**
 * 模块导入
 * @description 导入交叉观察器工具
 */
import { useIntersectionObserver } from "../../utils/useIntersectionObserver";
/**
 * 模块导入
 * @description 导入防抖工具函数
 */
import debounce from "../../tools/debounce";
/**
 * useObserverHooks 观察器钩子
 * @param props - 组件属性
 * @param refs - 各种 DOM 引用
 * @returns 观察器相关方法
 */
export const useObserverHooks = (props: any, refs: any) => {
  const isBrowser = typeof window !== "undefined";
  let observer: any;
  /**
   * 关闭监听
   * @description 关闭所有交叉元素监听
   */
  function closeObserver() {
    if (isBrowser) window.developLog.log(`关闭监听——元素进入视窗`, props.id, "danger");
    if (refs.isIntersectingList.value.length) {
      refs.isIntersectingList.value.forEach((item: any) => {
        item.stopObserving();
      });
      refs.isIntersectingList.value.length = 0;
    }
  }
  /**
   * 开始监听
   * @description 监听滚动更多元素进入视窗
   */
  function createObserver() {
    if (!refs.infiniteScroll.value) return;
    if (refs.isIntersectingList.value.length) closeObserver();
    const root = props.useSticky || refs.mScrollbarListRef.value.bodyEl;
    if (props.useSticky && !refs.isInViewList.value.length) {
      const Els = document.querySelector(`#${props.id} .pa-table_body_header_scroll`);
      if (Els) {
        const { isIntersecting, stopObserving } = useIntersectionObserver(Els, {
          rootMargin: `0px 0px -80px 0px`,
          threshold: [1],
          root
        });
        refs.isInViewList.value.push({ isIntersecting: isIntersecting, stopObserving, Els });
      }
    }
    if (isBrowser) window.developLog.log(`打开监听——元素进入视窗`, props.id, "success");
    const Els = document.querySelectorAll(`#${props.id} .m-scrollbar-more`);
    if (Els.length) {
      for (let i = 0; i < Els.length; i++) {
        const el: Element = Els[i];
        const { isIntersecting, stopObserving } = useIntersectionObserver(el, {
          rootMargin: `0px 0px 0px 0px`,
          threshold: [1],
          root
        });
        refs.isIntersectingList.value.push({ isIntersecting: isIntersecting, stopObserving, el });
      }
    }
  }
  /**
   * 监听子元素宽度变化
   * @param callback - 回调函数
   * @description 使用 MutationObserver 监听子元素变化以重新计算宽度
   */
  function listenChildCell(callback?: () => void) {
    if (observer?.disconnect) return;
    if (isBrowser) window.developLog.log(`打开监听——子元素宽度变化`, props.id, "success");
    observer = new window.MutationObserver(refs.setCellWidth);
    const config = { childList: true };
    if (refs.contentRef.value) {
      observer.observe(refs.contentRef.value, config);
      nextTick(() => {
        refs.setCellWidth();
        callback?.();
      });
    }
  }
  const listenCellInView = {
    create: createObserver,
    close: closeObserver
  };
  const listenCellChildChange = {
    create: debounce(listenChildCell, 200),
    close: () => {
      if (isBrowser) window.developLog.log(`关闭监听——子元素宽度变化`, props.id, "danger");
      observer?.disconnect?.();
      observer = null;
    }
  };
  return {
    listenCellInView,
    listenCellChildChange,
    clearListen: () => {
      listenCellInView.close();
      listenCellChildChange.close();
      if (refs.isInViewList.value.length) {
        refs.isInViewList.value.forEach((item: any) => {
          item.stopObserving();
        });
        refs.isInViewList.value.length = 0;
      }
    }
  };
};
