// # Import
import { nextTick, ref } from "vue";

export const useScrollHooks = (
  props,
  state,
  { headerBoxRef, mScrollbarListRef, mScrollbarHeaderListRef, listenCellInView, parentScrollbarRef, infiniteScroll, getTableList }
) => {
  // #Function 滚动条回调
  const scrollTop = ref(0);
  const scrollLeft = ref(0);
  const isDown = ref(true);

  const isLeft = ref(true);
  const isRight = ref(true);

  const isScrollIng = ref(false);
  const isScrollHeaderIng = ref(false);

  const scrollDirectionY = ref("down");
  const scrollDirectionX = ref("right");

  const directlyScroll = ({
    scrollLeft: _scrollLeft,
    scrollDirectionY: _scrollDirectionY,
    scrollDirectionX: _scrollDirectionX
  }) => {
    scrollDirectionY.value = _scrollDirectionY;
    scrollDirectionX.value = _scrollDirectionX;
    !isScrollHeaderIng.value && mScrollbarHeaderListRef.value.setScrollLeft(_scrollLeft, undefined, "instant");
  };

  // # Function 分页更改
  async function handleCurrentChange(value) {
    window.developLog.log("分页更改", value, "info");
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
  function handleSizeChange(val: number) {
    window.developLog.log("每页条数改变", val, "info");
    nextTick(async () => {
      await getTableList({ Page: { PageSize: val } }, true);
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
  function refreshTable() {
    scrollDirectionY.value = "down";
    handleSizeChange(state.pageable.PageSize);
  }

  // # Function 设置高距离
  function setScrollTop(value: number, callback?: () => void, behavior: ScrollBehavior = "smooth") {
    const el = document.querySelector(`#${props.id} .m-table-v2_body_header`);
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

  // # 处理滚动结束事件
  function onScrollLeft(val) {
    isLeft.value = val;
  }

  function onScrollRight(val) {
    isRight.value = val;
  }

  function overScroll(isHeader?: boolean) {
    if (isHeader) {
      isScrollHeaderIng.value = true;
      isScrollIng.value = false;
    } else {
      isScrollHeaderIng.value = false;
      isScrollIng.value = true;
    }
  }

  return {
    // ...toRefs(state),
    isLeft,
    isRight,
    isScrollIng,
    scrollTop,
    scrollLeft,
    isDown,
    scrollDirectionX,
    scrollDirectionY,
    onScrollLeft,
    onScrollRight,
    setScrollTop,
    handleSizeChange,
    handleCurrentChange,
    refreshTable,
    directlyScroll,

    overScroll
  };
};
