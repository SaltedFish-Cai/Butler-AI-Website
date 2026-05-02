/**
 * @description vue 响应式相关导入
 */
import { nextTick, ref } from "vue";
/**
 * @description useScrollHooks 滚动钩子
 * @param props 组件属性
 * @param state 表格状态
 * @param hooks 各种 ref 和方法
 * @returns 滚动相关方法
 */
export const useScrollHooks = (props: any, state: any, hooks: any) => {
  const isScrollHeaderIng = hooks.isScrollHeaderIng;
  const headerBoxRef = hooks.headerBoxRef;
  const mScrollbarListRef = hooks.mScrollbarListRef;
  const mScrollbarHeaderListRef = hooks.mScrollbarHeaderListRef;
  const listenCellInView = hooks.listenCellInView;
  const parentScrollbarRef = hooks.parentScrollbarRef;
  const infiniteScroll = hooks.infiniteScroll;
  const getTableList = hooks.getTableList;
  /**
   * @description 滚动条状态
   */
  const scrollTop = ref(0);
  const scrollLeft = ref(0);
  const isDown = ref(true);
  const isLeft = ref(true);
  const isRight = ref(true);
  const scrollDirectionY = ref("down");
  const scrollDirectionX = ref("right");
  /**
   * @description 直接滚动处理
   * @param data 滚动数据
   */
  const directlyScroll = (data: any) => {
    isLeft.value = data.isAtLeft;
    isRight.value = data.isAtRight;
    scrollDirectionY.value = data.scrollDirectionY;
    scrollDirectionX.value = data.scrollDirectionX;
    isScrollHeaderIng.value = true;
    mScrollbarHeaderListRef.value.scrollLeft = data.scrollLeft;
  };
  /**
   * @description 分页更改处理
   * @param value 页码值
   */
  async function handleCurrentChange(value: any) {
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
  /**
   * @description 每页条数改变处理
   * @param val 每页条数
   * @param exQuery 额外查询参数
   */
  async function handleSizeChange(val: number, exQuery?: Record<string, any>) {
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
  /**
   * @description 刷新页面
   * @param exQuery 额外查询参数
   */
  function refreshTable(exQuery?: Record<string, any>) {
    scrollDirectionY.value = "down";
    handleSizeChange(state.pageable.PageSize, exQuery);
  }
  /**
   * @description 设置滚动条顶部距离
   * @param value 目标距离值
   * @param callback 回调函数
   * @param behavior 滚动行为
   */
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
  /**
   * @description 设置元素到相交位置
   * @param el 目标元素
   * @param callback 回调函数
   */
  function setScrollToIntersect(el: Element, callback?: () => void) {
    if (props.useSticky) {
      parentScrollbarRef.value?.setScrollToIntersect?.(el, callback, { offsetY: headerBoxRef.value?.clientHeight || 0 });
    } else {
      mScrollbarListRef.value?.setScrollToIntersect?.(el, callback);
    }
  }
  return {
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
