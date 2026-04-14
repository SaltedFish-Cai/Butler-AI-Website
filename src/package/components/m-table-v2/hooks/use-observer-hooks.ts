// # Import
import { nextTick } from "vue";
import { useIntersectionObserver } from "../../utils/useIntersectionObserver";
import lodashPkg from "lodash";

export const useObserverHooks = (
  props,
  { mScrollbarListRef, contentRef, isIntersectingList, isInViewList, setCellWidth, infiniteScroll }
) => {
  const { debounce } = lodashPkg;
  let observer;
  // # Function 关闭监听
  function closeObserver() {
    window.developLog.log(`关闭监听——元素进入视窗`, props.id, "danger");
    if (isIntersectingList.value.length) {
      isIntersectingList.value.forEach((item: any) => {
        item.stopObserving();
      });
      isIntersectingList.value.length = 0;
    }
  }

  // # Function 开始监听
  function createObserver() {
    if (!infiniteScroll.value) return;
    if (isIntersectingList.value.length) closeObserver();
    const root = props.useSticky || mScrollbarListRef.value.bodyEl;

    if (props.useSticky && !isInViewList.value.length) {
      const Els = document.querySelector(`#${props.id} .m-table-v2_body_header_scroll`);

      if (Els) {
        const { isIntersecting, stopObserving } = useIntersectionObserver(Els, {
          // 配置选项
          // rootMargin: `${mScrollbarListRef.value.bodyEl.clientHeight / 3}px 0px -${
          //   mScrollbarListRef.value.bodyEl.clientHeight / 6
          // }px 0px`,
          rootMargin: `0px 0px -80px 0px`,
          // threshold: [0, 0.25, 0.5, 0.75, 1],
          threshold: [1],
          root
        });
        isInViewList.value.push({ isIntersecting: isIntersecting, stopObserving, Els });
      }
    }

    window.developLog.log(`打开监听——元素进入视窗`, props.id, "success");
    const Els = document.querySelectorAll(`#${props.id} .m-scrollbar-more`);
    if (Els.length) {
      for (let i = 0; i < Els.length; i++) {
        const el: Element = Els[i];
        const { isIntersecting, stopObserving } = useIntersectionObserver(el, {
          // 配置选项
          // rootMargin: `${mScrollbarListRef.value.bodyEl.clientHeight / 3}px 0px -${
          //   mScrollbarListRef.value.bodyEl.clientHeight / 6
          // }px 0px`,
          rootMargin: `0px 0px 0px 0px`,
          // threshold: [0, 0.25, 0.5, 0.75, 1],
          threshold: [1],
          root
        });

        isIntersectingList.value.push({ isIntersecting: isIntersecting, stopObserving, el });
      }
    }
  }

  function listenChildCell() {
    if (observer?.disconnect) return;
    window.developLog.log(`打开监听——子元素宽度变化`, props.id, "success");
    observer = new window.MutationObserver(setCellWidth);
    const config = { childList: true };
    if (contentRef.value) {
      observer.observe(contentRef.value, config);
      nextTick(() => {
        setCellWidth();
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
      window.developLog.log(`关闭监听——子元素宽度变化`, props.id, "danger");
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

      if (isInViewList.value.length) {
        isInViewList.value.forEach((item: any) => {
          item.stopObserving();
        });
        isInViewList.value.length = 0;
      }
    }
  };
};
