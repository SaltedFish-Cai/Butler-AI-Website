/**
 * 模块导入
 * @description 导入 lodash 防抖和节流函数
 */
import { debounce, throttle } from "lodash-es";
/**
 * 滚动条滑块最大尺寸
 * @description 滚动条滑块的最大尺寸常量
 */
const MAX_THUMB_SIZE = 60;
/**
 * 滚动数据接口
 * @type interface
 * @description 滚动信息的数据结构
 */
export interface ScrollInfoData {
  scrollTop: number;
  scrollLeft: number;
  isAtTop: boolean;
  isAtBottom: boolean;
  isAtLeft: boolean;
  isAtRight: boolean;
  scrollDirectionY: "down" | "none" | "up";
  scrollDirectionX: "left" | "none" | "right";
  element: HTMLElement;
}
/**
 * 滚动监听器配置
 * @type interface
 * @description 滚动监听器的配置选项
 */
export interface ScrollListenerOptions {
  debounceTime?: number;
  root?: HTMLElement | null;
  threshold?: number;
  defaultScrollHorizontalThumb: number;
  defaultScrollVerticalThumb: number;
}
/**
 * 滚动状态信息
 * @type interface
 * @description 滚动监听返回的状态信息
 */
export interface ScrollUserInfo {
  horizontalThumb: number;
  verticalThumb: number;
  horizontalThumbScale: number;
  verticalThumbScale: number;
  useHorizontal: boolean;
  useVertical: boolean;
}
/**
 * 尺寸变化数据接口
 * @type interface
 * @description 尺寸变化事件的数据结构
 */
export interface ResizeData {
  width: number;
  height: number;
  element: HTMLElement;
}
/**
 * 滚动监听器类
 * @type class
 * @description 用于监听指定元素的滚动状态
 */
export class ScrollListener {
  private listeners: Map<
    string,
    {
      handler: (data: ScrollInfoData) => void;
      debouncedHandler: (data: ScrollInfoData) => void;
      element: HTMLElement;
      scrollHandler: (event: Event) => void;
    }
  > = new Map();

  private lastScrollPositions: Map<HTMLElement, { scrollTop: number; scrollLeft: number }> = new Map();
  private resizeObservers: Map<string, ResizeObserver> = new Map();
  private options: ScrollListenerOptions = {
    debounceTime: 100,
    defaultScrollHorizontalThumb: 0,
    defaultScrollVerticalThumb: 0
  };

  /**
   * 构造函数
   * @param options - 配置选项
   * @description 创建滚动监听器实例
   */
  constructor(options: ScrollListenerOptions = { defaultScrollHorizontalThumb: 0, defaultScrollVerticalThumb: 0 }) {
    this.options = { ...this.options, ...options };
  }

  /**
   * 更新滚动条状态
   * @param element - 要更新的 DOM 元素
   * @param parentBoxRef - 父容器引用
   * @returns 更新后的滚动状态信息
   * @description 更新指定元素的滚动条状态和尺寸
   */
  public update(element: HTMLElement, parentBoxRef: HTMLElement | undefined): ScrollUserInfo {
    // 为每个已注册的元素重新初始化滚动位置

    const { scrollHeight, scrollWidth } = element;
    const { clientWidth: _clientWidth, clientHeight: _clientHeight } = parentBoxRef || element;

    const _defaultScrollHorizontalThumb = this.options.defaultScrollHorizontalThumb;
    const _defaultScrollVerticalThumb = this.options.defaultScrollVerticalThumb;

    const clientWidth = _clientWidth - _defaultScrollHorizontalThumb;
    const clientHeight = _clientHeight - _defaultScrollVerticalThumb;
    const _h = (clientWidth / scrollWidth) * clientWidth;
    const _v = (clientHeight / scrollHeight) * clientHeight;
    const horizontalThumb = _h < MAX_THUMB_SIZE ? MAX_THUMB_SIZE : _h;
    const verticalThumb = _v < MAX_THUMB_SIZE ? MAX_THUMB_SIZE : _v;

    const useHorizontal = scrollWidth - _clientWidth > 2;
    const useVertical = scrollHeight - _clientHeight > 2;

    return {
      horizontalThumb,
      verticalThumb,
      horizontalThumbScale: useHorizontal ? (clientWidth - horizontalThumb) / (scrollWidth - _clientWidth) : 0,
      verticalThumbScale: useVertical ? (clientHeight - verticalThumb) / (scrollHeight - _clientHeight) : 0,
      useHorizontal,
      useVertical
    };
  }
  /**
   * 重新初始化滚动监听器
   * @description 重置所有元素的上次滚动位置记录并重新初始化
   */
  public reinitialize(): void {
    this.lastScrollPositions.clear();
    this.listeners.forEach(listenerInfo => {
      const { element } = listenerInfo;
      if (element instanceof HTMLElement) {
        this.lastScrollPositions.set(element, {
          scrollTop: element.scrollTop,
          scrollLeft: element.scrollLeft
        });
      }
    });
  }
  /**
   * 添加元素滚动监听器
   * @param id - 监听器唯一标识
   * @param element - 要监听的 DOM 元素
   * @param handler - 滚动处理函数
   * @param directlyHandler - 直接滚动处理函数
   * @param options - 配置选项
   * @description 为指定元素添加滚动监听
   */
  public addElementScrollListener(
    id: string,
    element: HTMLElement,
    handler: (data: ScrollInfoData) => void,
    directlyHandler: (data: { scrollTop: number; scrollLeft: number; scrollData: ScrollInfoData }) => void,
    options: Partial<ScrollListenerOptions> = {}
  ): void {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid element provided for scroll listening");
      return;
    }
    const debounceTime = options.debounceTime || this.options.debounceTime;
    const debouncedHandler = throttle(
      (data: ScrollInfoData) => {
        handler(data);
      },
      debounceTime,
      { trailing: true }
    );
    if (!this.lastScrollPositions.has(element)) {
      this.lastScrollPositions.set(element, {
        scrollTop: element.scrollTop,
        scrollLeft: element.scrollLeft
      });
    }
    const scrollHandler = this.createScrollHandler(element, debouncedHandler, directlyHandler);
    element.addEventListener("scroll", scrollHandler);
    this.listeners.set(id, {
      handler,
      debouncedHandler,
      element,
      scrollHandler
    });
  }
  /**
   * 创建滚动处理函数
   * @param element - 监听的元素
   * @param debouncedHandler - 防抖处理函数
   * @param directlyHandler - 直接处理函数
   * @returns 滚动事件处理函数
   * @description 创建元素的滚动事件处理函数
   */
  private createScrollHandler(
    element: HTMLElement,
    debouncedHandler: (data: ScrollInfoData) => void,
    directlyHandler: (data: { scrollTop: number; scrollLeft: number; scrollData: ScrollInfoData }) => void
  ): (event: Event) => void {
    return () => {
      const scrollData = this.getScrollData(element);
      debouncedHandler(scrollData);
      directlyHandler({ scrollTop: element.scrollTop, scrollLeft: element.scrollLeft, scrollData });
    };
  }
  /**
   * 获取元素滚动数据
   * @param element - 要获取滚动数据的元素
   * @returns 元素的滚动信息数据
   * @description 获取指定元素的滚动位置和方向等数据
   */
  private getScrollData(element: HTMLElement): ScrollInfoData {
    const scrollTop = element.scrollTop;
    const scrollLeft = element.scrollLeft;
    const clientHeight = element.clientHeight;
    const clientWidth = element.clientWidth;
    const scrollHeight = element.scrollHeight;
    const scrollWidth = element.scrollWidth;
    const lastPosition = this.lastScrollPositions.get(element) || { scrollTop, scrollLeft };
    let scrollDirectionY: "down" | "none" | "up" = "none";
    let scrollDirectionX: "left" | "none" | "right" = "none";
    if (scrollTop > lastPosition.scrollTop) {
      scrollDirectionY = "down";
    } else if (scrollTop < lastPosition.scrollTop) {
      scrollDirectionY = "up";
    }
    if (scrollLeft > lastPosition.scrollLeft) {
      scrollDirectionX = "right";
    } else if (scrollLeft < lastPosition.scrollLeft) {
      scrollDirectionX = "left";
    }
    this.lastScrollPositions.set(element, { scrollTop, scrollLeft });
    const isAtTop = scrollTop <= 10;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const isAtLeft = scrollLeft <= 10;
    const isAtRight = scrollLeft + clientWidth >= scrollWidth - 10;
    return {
      scrollTop,
      scrollLeft,
      isAtTop,
      isAtBottom,
      isAtLeft,
      isAtRight,
      scrollDirectionY,
      scrollDirectionX,
      element
    };
  }
  /**
   * 移除指定的元素滚动监听器
   * @param id - 监听器唯一标识
   * @description 移除指定 ID 的滚动监听器
   */
  public removeElementScrollListener(id: string): void {
    const listenerInfo = this.listeners.get(id);
    if (listenerInfo) {
      const { element, scrollHandler } = listenerInfo;
      element.removeEventListener("scroll", scrollHandler);
      const newListeners = new Map(this.listeners);
      newListeners.delete(id);
      this.listeners = newListeners;
      let hasOtherListeners = false;
      this.listeners.forEach(info => {
        if (info.element === element) {
          hasOtherListeners = true;
        }
      });
      if (!hasOtherListeners) {
        this.lastScrollPositions.delete(element);
      }
    }
  }
  /**
   * 手动设置指定元素的滚动位置
   * @param element - 要设置滚动位置的 DOM 元素
   * @param options - 滚动位置选项
   * @returns void
   * @description 手动设置指定元素的滚动位置
   */
  public setElementScrollPosition(
    element: HTMLElement,
    options: {
      scrollTop?: number;
      scrollLeft?: number;
      behavior?: "auto" | "smooth";
      callback?: () => void;
      offsetX?: number;
      offsetY?: number;
    }
  ): void {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid element provided for scroll position setting");
      if (options.callback) {
        options.callback();
      }
      return;
    }
    const offsetX = options.offsetX || 0;
    const offsetY = options.offsetY || 0;
    const currentScrollTop = element.scrollTop;
    const currentScrollLeft = element.scrollLeft;
    const targetScrollTop = options.scrollTop !== undefined ? options.scrollTop : currentScrollTop;
    const targetScrollLeft = options.scrollLeft !== undefined ? options.scrollLeft : currentScrollLeft;
    const shouldScroll = targetScrollTop !== currentScrollTop || targetScrollLeft !== currentScrollLeft;
    if (!shouldScroll && options.callback) {
      options.callback();
      return;
    }
    if (options.behavior === "smooth" && "scrollTo" in element) {
      const scrollTimeout = setTimeout(() => {
        element.removeEventListener("scroll", scrollHandler);
        if (options.callback) {
          options.callback();
        }
      }, 2000);
      const handleScrollEnd = () => {
        const isAtTargetPosition =
          element.scrollTop == 0 ||
          element.scrollLeft == 0 ||
          (Math.abs(element.scrollTop - offsetY - targetScrollTop) < 1 &&
            Math.abs(element.scrollLeft - offsetX - targetScrollLeft) < 1);
        if (isAtTargetPosition) {
          element.removeEventListener("scroll", scrollHandler);
          if (options.callback) {
            options.callback();
          }
          clearTimeout(scrollTimeout);
        }
      };
      const scrollHandler = debounce(handleScrollEnd, 5, { trailing: true });
      element.addEventListener("scroll", scrollHandler);
      handleScrollEnd();
      setTimeout(() => {
        element.scrollTo({
          top: targetScrollTop,
          left: targetScrollLeft,
          behavior: "smooth"
        });
        if (this.lastScrollPositions.has(element)) {
          this.lastScrollPositions.set(element, {
            scrollTop: targetScrollTop,
            scrollLeft: targetScrollLeft
          });
        }
      }, 0);
    } else {
      element.scrollTop = targetScrollTop;
      element.scrollLeft = targetScrollLeft;
      if (this.lastScrollPositions.has(element)) {
        this.lastScrollPositions.set(element, {
          scrollTop: targetScrollTop,
          scrollLeft: targetScrollLeft
        });
      }
      if (options.callback) {
        options.callback();
      }
    }
  }
  /**
   * 开始拖拽滑块以变更滚动值
   * @param element - 要拖拽的滑块元素
   * @param targetElement - 要滚动的目标元素
   * @param direction - 拖拽方向
   * @param options - 拖拽配置选项
   * @returns 包含 stop 方法的对象，用于停止拖拽监听
   * @description 开始拖拽滑块以变更滚动值
   */
  public startDrag(
    element: HTMLElement,
    targetElement: HTMLElement,
    direction: "horizontal" | "vertical",
    options: {
      onDragStart?: () => void;
      onDragMove?: () => void;
      onDragEnd?: () => void;
    } = {}
  ): { stop: () => void } {
    if (!element || !(element instanceof HTMLElement) || !targetElement || !(targetElement instanceof HTMLElement)) {
      console.warn("Invalid elements provided for drag operation");
      return {
        stop: () => {
          //
        }
      };
    }
    let isDragging = false;
    let startClientPos = 0;
    let startScrollPos = 0;
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      startClientPos = direction === "vertical" ? e.clientY : e.clientX;
      startScrollPos = direction === "vertical" ? targetElement.scrollTop : targetElement.scrollLeft;
      if (options.onDragStart) {
        options.onDragStart();
      }
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const clientPos = direction === "vertical" ? e.clientY : e.clientX;
      const delta = clientPos - startClientPos;
      const targetSize = direction === "vertical" ? targetElement.clientHeight : targetElement.clientWidth;
      const contentSize = direction === "vertical" ? targetElement.scrollHeight : targetElement.scrollWidth;
      const maxScroll = contentSize - targetSize;
      const newScrollPos = startScrollPos + (delta * contentSize) / targetSize;
      const clampedScrollPos = Math.max(0, Math.min(maxScroll, newScrollPos));
      if (direction === "vertical") {
        targetElement.scrollTop = clampedScrollPos;
      } else {
        targetElement.scrollLeft = clampedScrollPos;
      }
      if (this.lastScrollPositions.has(targetElement)) {
        const current = this.lastScrollPositions.get(targetElement)!;
        this.lastScrollPositions.set(targetElement, {
          scrollTop: direction === "vertical" ? clampedScrollPos : current.scrollTop,
          scrollLeft: direction === "horizontal" ? clampedScrollPos : current.scrollLeft
        });
      }
      if (options.onDragMove) {
        options.onDragMove();
      }
    };
    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      if (options.onDragEnd) {
        options.onDragEnd();
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    element.addEventListener("mousedown", handleMouseDown);
    const stop = () => {
      isDragging = false;
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    return { stop };
  }
  /**
   * 移除所有滚动监听器
   * @description 清除所有已注册的滚动监听器
   */
  public removeAllListeners(): void {
    this.listeners.clear();
    this.lastScrollPositions.clear();
  }
  /**
   * 销毁监听器
   * @description 销毁滚动监听器实例，清除所有监听器和观察器
   */
  public destroy(): void {
    this.removeAllListeners();
    this.resizeObservers.forEach(observer => {
      observer.disconnect();
    });
    this.resizeObservers.clear();
  }
  /**
   * 监听元素尺寸变化
   * @param id - 观察器唯一标识
   * @param element - 要观察的 DOM 元素
   * @param handler - 尺寸变化处理函数
   * @returns 包含 stop 方法的对象，用于停止观察
   * @description 使用 ResizeObserver 监听元素尺寸变化
   */
  public observeElementResize(id: string, element: HTMLElement, handler: (data: ResizeData) => void): { stop: () => void } {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid element provided for resize observation");
      return {
        stop: () => {
          //
        }
      };
    }
    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const rect = entry.contentRect;
          handler({
            width: rect.width,
            height: rect.height,
            element
          });
        }
      });
      resizeObserver.observe(element);
      this.resizeObservers.set(id, resizeObserver);
      const rect = element.getBoundingClientRect();
      handler({
        width: rect.width,
        height: rect.height,
        element
      });
      return {
        stop: () => {
          resizeObserver.unobserve(element);
          resizeObserver.disconnect();
          this.resizeObservers.delete(id);
        }
      };
    } else {
      console.warn("ResizeObserver is not supported. Using fallback method.");
      let lastWidth = element.offsetWidth;
      let lastHeight = element.offsetHeight;
      let pollingInterval: number | null = null;
      pollingInterval = (window as Window & typeof globalThis).setInterval(() => {
        const currentWidth = element.offsetWidth;
        const currentHeight = element.offsetHeight;
        if (currentWidth !== lastWidth || currentHeight !== lastHeight) {
          handler({
            width: currentWidth,
            height: currentHeight,
            element
          });
          lastWidth = currentWidth;
          lastHeight = currentHeight;
        }
      }, 200);
      return {
        stop: () => {
          if (pollingInterval !== null) {
            clearInterval(pollingInterval);
          }
        }
      };
    }
  }
}
/**
 * 监听指定元素滚动的便捷函数
 * @param element - 要监听的 DOM 元素
 * @param handler - 滚动处理函数
 * @param directlyHandler - 直接滚动处理函数
 * @param options - 配置选项
 * @returns 包含 listener、remove、update 等方法的对象
 * @description 监听指定元素滚动的便捷函数
 */
export function listenElementScroll(
  element: HTMLElement,
  handler: (data: ScrollInfoData) => void,
  directlyHandler: (data: { scrollTop: number; scrollLeft: number; scrollData: ScrollInfoData }) => void,
  options: ScrollListenerOptions = { defaultScrollHorizontalThumb: 0, defaultScrollVerticalThumb: 0 }
): {
  listener: ScrollListener;
  bodyHeight: number;
  bodyWidth: number;
  useHorizontal: boolean;
  useVertical: boolean;
  remove: () => void;
  update: (parentBoxRef: HTMLElement | undefined) => ScrollUserInfo;
} {
  const listener = new ScrollListener(options);
  const id = `element-scroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  listener.addElementScrollListener(id, element, handler, directlyHandler, options);
  const { clientWidth, clientHeight, scrollWidth, scrollHeight } = element;

  return {
    listener,
    bodyHeight: clientHeight,
    bodyWidth: clientWidth,
    useHorizontal: scrollWidth != clientWidth,
    useVertical: scrollHeight != clientHeight,
    remove: () => {
      listener.removeElementScrollListener(id);
    },
    update: (parentBoxRef: HTMLElement | undefined) => {
      return listener.update(element, parentBoxRef);
    }
  };
}
/**
 * 监听多个指定元素的滚动状态
 * @param elements - 要监听的 DOM 元素数组
 * @param handler - 滚动处理函数
 * @param directlyHandler - 直接滚动处理函数
 * @param options - 配置选项
 * @returns 包含 remove 方法的对象，用于移除所有监听
 * @description 监听多个指定元素的滚动状态
 */
export function listenMultipleElementsScroll(
  elements: Array<HTMLElement>,
  handler: (data: ScrollInfoData) => void,
  directlyHandler: (data: { scrollTop: number; scrollLeft: number }) => void,
  options: ScrollListenerOptions = { defaultScrollHorizontalThumb: 0, defaultScrollVerticalThumb: 0 }
): { remove: () => void } {
  const listener = new ScrollListener(options);
  const ids: Array<string> = [];

  elements.forEach((element, index) => {
    if (element instanceof HTMLElement) {
      const id = `multi-element-scroll-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`;
      listener.addElementScrollListener(id, element, handler, directlyHandler, options);
      ids.push(id);
    }
  });

  return {
    remove: () => {
      ids.forEach(id => {
        listener.removeElementScrollListener(id);
      });
    }
  };
}
/**
 * 检查元素是否在视口中
 * @param element - 要检查的元素
 * @param options - IntersectionObserver 选项
 * @returns 包含 isInViewport 状态和停止观察方法的对象
 * @description 检查指定元素是否在视口中
 */
export function isElementInViewport(
  element: HTMLElement,
  options: IntersectionObserverInit = {}
): { isInViewport: boolean; stopObserving: () => void } {
  let isInViewport = false;
  let observer: IntersectionObserver | null = null;

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      isInViewport = entry.isIntersecting;
    }, options);

    observer.observe(element);
  } else {
    const rect = element.getBoundingClientRect();
    const win: Window & typeof globalThis = window;
    const doc = document.documentElement;
    isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (win.innerHeight || doc.clientHeight) &&
      rect.right <= (win.innerWidth || doc.clientWidth);
  }

  return {
    isInViewport,
    stopObserving: () => {
      if (observer) {
        observer.unobserve(element);
        observer.disconnect();
      }
    }
  };
}
/**
 * 全局滚动监听器实例
 * @type ScrollListener
 * @description 创建全局滚动监听器实例
 */
export const scrollListener = new ScrollListener();
/**
 * 手动设置指定元素的滚动位置
 * @param element - 要设置滚动位置的 DOM 元素
 * @param options - 滚动位置选项
 * @returns void
 * @description 手动设置指定元素的滚动位置的便捷函数
 */
export function setElementScrollPosition(
  element: HTMLElement,
  options: {
    scrollTop?: number;
    scrollLeft?: number;
    behavior?: "auto" | "smooth";
    callback?: () => void;
    offsetX?: number;
    offsetY?: number;
  }
): void {
  if (!element || !(element instanceof HTMLElement)) {
    console.warn("Invalid element provided for scroll position setting");
    if (options.callback) {
      options.callback();
    }
    return;
  }
  const listener = new ScrollListener();
  listener.setElementScrollPosition(element, options);
}
/**
 * 开始拖拽滑块以变更滚动值的便捷函数
 * @param element - 要拖拽的滑块元素
 * @param targetElement - 要滚动的目标元素
 * @param direction - 拖拽方向
 * @param options - 拖拽配置选项
 * @returns 包含 stop 方法的对象，用于停止拖拽监听
 * @description 开始拖拽滑块以变更滚动值的便捷函数
 */
export function startDrag(
  element: HTMLElement,
  targetElement: HTMLElement,
  direction: "horizontal" | "vertical",
  options: {
    onDragStart?: () => void;
    onDragMove?: () => void;
    onDragEnd?: () => void;
  } = {}
): { stop: () => void } {
  if (!element || !(element instanceof HTMLElement) || !targetElement || !(targetElement instanceof HTMLElement)) {
    console.warn("Invalid elements provided for drag operation");
    return {
      stop: () => {
        //
      }
    };
  }

  const listener = new ScrollListener();
  return listener.startDrag(element, targetElement, direction, options);
}
/**
 * 监听元素尺寸变化的便捷函数
 * @param element - 要观察的 DOM 元素
 * @param handler - 尺寸变化处理函数
 * @returns 包含 stop 方法的对象，用于停止观察
 * @description 监听元素尺寸变化的便捷函数
 */
export function observeElementResize(element: HTMLElement, handler: (data: ResizeData) => void): { stop: () => void } {
  if (!element || !(element instanceof HTMLElement)) {
    console.warn("Invalid element provided for resize observation");
    return {
      stop: () => {
        //
      }
    };
  }

  const listener = new ScrollListener();
  const id = `resize-observe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return listener.observeElementResize(id, element, handler);
}
/**
 * 模块导出
 * @description 导出默认的滚动监听器实例
 */
export default scrollListener;
