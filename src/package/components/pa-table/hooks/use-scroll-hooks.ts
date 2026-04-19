// # Import
import { nextTick, ref } from "vue";

export const useScrollHooks = (
  props,
  state,
  {
    isScrollHeaderIng,
    headerBoxRef,
    mScrollbarListRef,
    mScrollbarHeaderListRef,
    listenCellInView,
    parentScrollbarRef,
    infiniteScroll,
    getTableList
  }
) => {
  // #Function 滚动条回调
  const scrollTop = ref(0);
  const scrollLeft = ref(0);
  const isDown = ref(true);

  const isLeft = ref(true);
  const isRight = ref(true);

  const scrollDirectionY = ref("down");
  const scrollDirectionX = ref("right");

  const directlyScroll = data => {
    isLeft.value = data.isAtLeft;
    isRight.value = data.isAtRight;
    scrollDirectionY.value = data.scrollDirectionY;
    scrollDirectionX.value = data.scrollDirectionX;
    isScrollHeaderIng.value = true;

    mScrollbarHeaderListRef.value.scrollLeft = data.scrollLeft;
  };

  // # Function 分页更改
  async function handleCurrentChange(value) {
    typeof window !== "undefined" && window.developLog.log("分页更改", value, "info");
    nextTick(async () => {
      state.PageNum = value;
      await getTableList({ Page: { PageNum: value } }, true);
      if (!infiniteScroll.value) return;
      nextTick(async () => {
        await getTableList({ Page: { PageNum: value - 1 } }, true);
        const mpreEl: any = document.querySelector(`#${props.id} #${props.id}-more-${value - 1}`);
        if (mpreEl) {
          setScrollToIntersect(mpreEl, () => {
            state.listenCellInViewIng = true;
            listenCellInView.create();
          });
        }
      });
    });
  }

  // # Function 每页条数改变
  function handleSizeChange(val: number, exQuery?: Record<string, any>) {
    typeof window !== "undefined" && window.developLog.log("每页条数改变", val, "info");
    nextTick(async () => {
      await getTableList({ Page: { PageSize: val }, ...exQuery }, true);
      nextTick(async () => {
        const mpreEl: any = document.querySelector(`#${props.id} #${props.id}-more-0`);
        if (mpreEl) {
          setScrollToIntersect(mpreEl, () => {
            state.listenCellInViewIng = true;
            listenCellInView.create();
          });
        }
      });
    });
  }

  // # Function 刷新页面
  function refreshTable(exQuery?: Record<string, any>) {
    scrollDirectionY.value = "down";
    handleSizeChange(state.pageable.PageSize, exQuery);
  }

  // # Function 设置高距离
  function setScrollTop(value: number, callback?: () => void, behavior: ScrollBehavior = "smooth") {
    const el = document.querySelector(`#${props.id} .pa-table_body_header`);
    let _elHeaderHeight = 0;
    if (el?.clientHeight) {
      _elHeaderHeight = el.clientHeight;
    }
    if (props.useSticky) {
      parentScrollbarRef.value?.setScrollTop?.(value - _elHeaderHeight, callback, behavior);
    } else {
      mScrollbarListRef.value?.setScrollTop?.(value - _elHeaderHeight, callback, behavior);
    }
  }

  // # Function 设置元素到相交位置
  function setScrollToIntersect(el: Element, callback?: () => void) {
    if (props.useSticky) {
      parentScrollbarRef.value?.setScrollToIntersect?.(el, callback, { offsetY: headerBoxRef.value?.clientHeight || 0 });
    } else {
      mScrollbarListRef.value?.setScrollToIntersect?.(el, callback);
    }
  }

  return {
    // ...toRefs(state),
    isScrollHeaderIng,
    isLeft,
    isRight,
    scrollTop,
    scrollLeft,
    isDown,
    scrollDirectionX,
    scrollDirectionY,
    setScrollTop,
    handleSizeChange,
    handleCurrentChange,
    refreshTable,
    directlyScroll
  };
};
