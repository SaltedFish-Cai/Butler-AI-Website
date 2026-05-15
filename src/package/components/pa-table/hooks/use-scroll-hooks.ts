/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { nextTick, ref } from "vue";
/**
 * useScrollHooks 滚动钩子
 * @param props - 组件属性
 * @param state - 表格状态
 * @param hooks - 各种 ref 和方法
 * @returns 滚动相关方法
 */
export const useScrollHooks = (props: any, state: any, hooks: any) => {
  const isBrowser = typeof window !== "undefined";
  const isScrollHeaderIng = hooks.isScrollHeaderIng;
  const headerBoxRef = hooks.headerBoxRef;
  const mScrollbarListRef = hooks.mScrollbarListRef;
  const mScrollbarHeaderListRef = hooks.mScrollbarHeaderListRef;
  const listenCellInView = hooks.listenCellInView;
  const parentScrollbarRef = hooks.parentScrollbarRef;
  const infiniteScroll = hooks.infiniteScroll;
  const getTableList = hooks.getTableList;
  /**
   * 滚动条状态
   * @type Ref<number>
   * @description 滚动条垂直位置
   */
  const scrollTop = ref(0);
  /**
   * 滚动条状态
   * @type Ref<number>
   * @description 滚动条水平位置
   */
  const scrollLeft = ref(0);
  /**
   * 滚动方向状态
   * @type Ref<boolean>
   * @description 是否向下滚动
   */
  const isDown = ref(true);
  /**
   * 滚动边界状态
   * @type Ref<boolean>
   * @description 是否已到最左侧
   */
  const isLeft = ref(true);
  /**
   * 滚动边界状态
   * @type Ref<boolean>
   * @description 是否已到最右侧
   */
  const isRight = ref(true);
  /**
   * 滚动方向状态
   * @type Ref<string>
   * @description 垂直滚动方向
   */
  const scrollDirectionY = ref("down");
  /**
   * 滚动方向状态
   * @type Ref<string>
   * @description 水平滚动方向
   */
  const scrollDirectionX = ref("right");
  /**
   * 直接滚动处理
   * @param data - 滚动数据
   * @description 同步表头和主体的滚动位置
   */
  function directlyScroll(data: any) {
    isLeft.value = data.isAtLeft;
    isRight.value = data.isAtRight;
    scrollDirectionY.value = data.scrollDirectionY;
    scrollDirectionX.value = data.scrollDirectionX;
    isScrollHeaderIng.value = true;
    mScrollbarHeaderListRef.value.scrollLeft = data.scrollLeft;
  }
  /**
   * 分页更改处理
   * @param value - 页码值
   * @description 切换页码并请求对应数据
   */
  async function handleCurrentChange(value: any) {
    if (isBrowser) window.developLog.log("分页更改", value, "info");
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
   * 每页条数改变处理
   * @param val - 每页条数
   * @param exQuery - 额外查询参数
   * @description 修改每页条数并重新请求数据
   */
  async function handleSizeChange(val: number, exQuery?: Record<string, any>) {
    if (isBrowser) window.developLog.log("每页条数改变", val, "info");
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
   * 刷新页面
   * @param exQuery - 额外查询参数
   * @description 刷新表格数据
   */
  function refreshTable(exQuery?: Record<string, any>) {
    scrollDirectionY.value = "down";
    handleSizeChange(state.pageable.PageSize, exQuery);
  }
  /**
   * 设置滚动条顶部距离
   * @param value - 目标距离值
   * @param callback - 回调函数
   * @param behavior - 滚动行为
   * @description 滚动到指定位置
   */
  function setScrollTop(value: number, callback?: () => void, behavior: ScrollBehavior = "smooth") {
    const el = document.querySelector(`#${props.id} .pa-table_body_header`);
    let _elHeaderHeight = 0;
    if (el?.clientHeight) _elHeaderHeight = el.clientHeight;
    if (props.useSticky) {
      parentScrollbarRef.value?.setScrollTop?.(value - _elHeaderHeight, callback, behavior);
    } else {
      mScrollbarListRef.value?.setScrollTop?.(value - _elHeaderHeight, callback, behavior);
    }
  }
  /**
   * 设置元素到相交位置
   * @param el - 目标元素
   * @param callback - 回调函数
   * @description 滚动到指定元素使其可见
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
