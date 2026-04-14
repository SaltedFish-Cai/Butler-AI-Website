/**
 * 获取元素坐标信息
 * @returns 元素位置信息对象或null
 */
export function getElementPosition(el, parentElement?: HTMLElement, paddingBox = { top: 0, left: 0, right: 0, bottom: 0 }) {
  if (!el) {
    return null;
  }

  // 使用getBoundingClientRect获取元素的位置和尺寸信息
  const rect = el.getBoundingClientRect();

  const viewportWidth = window?.innerWidth;
  const viewportHeight = window?.innerHeight;

  const parentPosition: {
    parentTop: number | null;
    parentLeft: number | null;
    parentRight: number | null;
    parentBottom: number | null;
    isFullInParent: boolean | null;
  } = {
    parentTop: null,
    parentLeft: null,
    parentRight: null,
    parentBottom: null,
    isFullInParent: null
  };
  if (parentElement) {
    const parentElementRect = parentElement.getBoundingClientRect();
    const isFullInParent =
      rect.top >= parentElementRect.top + paddingBox.top &&
      rect.right <= parentElementRect.right - paddingBox.right &&
      rect.left >= parentElementRect.left + paddingBox.left &&
      rect.bottom <= parentElementRect.bottom - paddingBox.bottom;

    parentPosition.isFullInParent = isFullInParent;
    parentPosition.parentTop = (parentElementRect.top - rect.top) / (window.managerPageScale || 1);
    parentPosition.parentLeft = (parentElementRect.left - rect.left) / (window.managerPageScale || 1);
    parentPosition.parentRight = (rect.right - parentElementRect.right) / (window.managerPageScale || 1);
    parentPosition.parentBottom = (rect.bottom - parentElementRect.bottom) / (window.managerPageScale || 1);
  }
  return {
    // 相对于视口的位置
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    // 元素尺寸
    width: rect.width,
    height: rect.height,
    // 现代浏览器支持的x,y属性
    x: rect.x,
    y: rect.y,
    // 相对于文档的位置（考虑页面滚动）
    pageTop: rect.top + window.pageYOffset,
    pageBottom: window.innerHeight - rect.bottom + window.pageYOffset,
    pageLeft: rect.left + window.pageXOffset,
    pageRight: window.innerWidth - rect.right + window.pageXOffset,

    // 相对于窗口的位置（考虑页面滚动）
    windowTop: rect.top,
    windowBottom: window.innerHeight - rect.bottom,
    windowLeft: rect.left,
    windowRight: window.innerWidth - rect.right,

    // 检查是否超出视口右侧
    outRight: rect.right > viewportWidth,
    // 检查是否超出视口底部
    outBottom: rect.bottom > viewportHeight,
    // 检查是否超出视口左侧
    outLeft: rect.left < 0,
    // 检查是否超出视口顶部
    outTop: rect.top < 0,
    // 判断元素是否在视口内
    isInViewport: rect.top < viewportHeight && rect.bottom >= 0 && rect.left < viewportWidth && rect.right >= 0,

    // 判断元素是否在父元素内
    ...parentPosition
  };
}
