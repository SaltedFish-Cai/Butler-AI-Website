import { debounce, throttle } from "lodash";

/**
 * 滚动数据接口
 */
export interface ScrollData {
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
 */
export interface ScrollListenerOptions {
  debounceTime?: number;
  root?: HTMLElement | null;
  threshold?: number;
  defaultScrollHorizontalThumb: number;
  defaultScrollVerticalThumb: number;
}

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
 */
export interface ResizeData {
  width: number;
  height: number;
  element: HTMLElement;
}

/**
 * 滚动监听器类 - 用于监听指定元素的滚动状态
 */
export class ScrollListener {
  private listeners: Map<
    string,
    {
      handler: (data: ScrollData) => void;
      debouncedHandler: (data: ScrollData) => void;
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
   * @param options 配置选项
   */
  constructor(options: ScrollListenerOptions = { defaultScrollHorizontalThumb: 0, defaultScrollVerticalThumb: 0 }) {
    this.options = { ...this.options, ...options };
  }

  /**
   * 更新滚动条状态
   */
  public update(element: HTMLElement, parentBoxRef: HTMLElement | null): ScrollUserInfo {
    // 为每个已注册的元素重新初始化滚动位置
    const MAX_THUMB_SIZE = 60;

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

    return {
      horizontalThumb,
      verticalThumb,
      horizontalThumbScale:
        _h < MAX_THUMB_SIZE
          ? (clientWidth - (MAX_THUMB_SIZE * clientWidth) / scrollWidth) / scrollWidth
          : clientWidth / scrollWidth,
      verticalThumbScale:
        _v < MAX_THUMB_SIZE
          ? (clientHeight - (MAX_THUMB_SIZE * clientHeight) / scrollWidth) / scrollHeight
          : clientHeight / scrollHeight,
      useHorizontal: scrollWidth - _clientWidth > 2,
      useVertical: scrollHeight - _clientHeight > 2
    };
  }
  public reinitialize(): void {
    // 重置所有元素的上次滚动位置记录
    this.lastScrollPositions.clear();

    // 为每个已注册的元素重新初始化滚动位置
    this.listeners.forEach(listenerInfo => {
      const { element } = listenerInfo;
      if (element instanceof HTMLElement) {
        // 重新初始化元素的上次滚动位置
        this.lastScrollPositions.set(element, {
          scrollTop: element.scrollTop,
          scrollLeft: element.scrollLeft
        });
      }
    });
    console.log(`ScrollListener reinitialized: ${this.listeners.size} listeners retained`);
  }
  /**
   * 添加元素滚动监听器
   * @param id 监听器唯一标识
   * @param element 要监听的DOM元素
   * @param handler 滚动处理函数
   * @param options 配置选项（可选）
   */
  public addElementScrollListener(
    id: string,
    element: HTMLElement,
    handler: (data: ScrollData) => void,
    directlyHandler: (data: { scrollTop: number; scrollLeft: number; scrollData: ScrollData }) => void,
    options: Partial<ScrollListenerOptions> = {}
  ): void {
    // 检查元素是否有效
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid element provided for scroll listening");
      return;
    }

    const debounceTime = options.debounceTime || this.options.debounceTime;
    // 创建防抖处理函数
    const debouncedHandler = throttle(
      (data: ScrollData) => {
        handler(data);
      },
      debounceTime,
      { trailing: true }
    );

    // 初始化元素的上次滚动位置
    if (!this.lastScrollPositions.has(element)) {
      this.lastScrollPositions.set(element, {
        scrollTop: element.scrollTop,
        scrollLeft: element.scrollLeft
      });
    }

    // 添加滚动事件监听器
    const scrollHandler = this.createScrollHandler(element, debouncedHandler, directlyHandler);
    element.addEventListener("scroll", scrollHandler);
    // 存储监听器信息
    this.listeners.set(id, {
      handler,
      debouncedHandler,
      element,
      scrollHandler
    });
  }

  /**
   * 创建滚动处理函数
   * @param element 监听的元素
   * @param debouncedHandler 防抖处理函数
   */
  private createScrollHandler(
    element: HTMLElement,
    debouncedHandler: (data: ScrollData) => void,
    directlyHandler: (data: { scrollTop: number; scrollLeft: number; scrollData: ScrollData }) => void
  ): (event: Event) => void {
    return () => {
      const scrollData = this.getScrollData(element);
      debouncedHandler(scrollData);
      directlyHandler({ scrollTop: element.scrollTop, scrollLeft: element.scrollLeft, scrollData });
    };
  }

  /**
   * 获取元素滚动数据
   * @param element 要获取滚动数据的元素
   */
  private getScrollData(element: HTMLElement): ScrollData {
    const scrollTop = element.scrollTop;
    const scrollLeft = element.scrollLeft;
    const clientHeight = element.clientHeight;
    const clientWidth = element.clientWidth;
    const scrollHeight = element.scrollHeight;
    const scrollWidth = element.scrollWidth;

    // 获取上次滚动位置
    const lastPosition = this.lastScrollPositions.get(element) || { scrollTop, scrollLeft };

    // 计算滚动方向
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

    // 更新上次滚动位置
    this.lastScrollPositions.set(element, { scrollTop, scrollLeft });

    // 判断是否到达边界（增加10px的容差）
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
   * @param id 监听器唯一标识
   */
  public removeElementScrollListener(id: string): void {
    const listenerInfo = this.listeners.get(id);
    if (listenerInfo) {
      const { element, scrollHandler } = listenerInfo;
      element.removeEventListener("scroll", scrollHandler);

      // 移除所有与该元素相关的滚动事件监听器
      // 注意：这里我们需要更精确地移除，但由于JavaScript的限制，我们只能这样处理
      // 实际项目中可能需要优化此部分
      const newListeners = new Map(this.listeners);
      newListeners.delete(id);
      this.listeners = newListeners;

      // 如果没有其他监听器使用该元素，则清理上次滚动位置记录
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
   * @param element 要设置滚动位置的DOM元素
   * @param options 滚动位置选项
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
    // 检查元素是否有效
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid element provided for scroll position setting");
      if (options.callback) {
        options.callback();
      }
      return;
    }

    // 提取偏移量，默认值为0
    const offsetX = options.offsetX || 0;
    const offsetY = options.offsetY || 0;

    // 获取当前滚动位置
    const currentScrollTop = element.scrollTop;
    const currentScrollLeft = element.scrollLeft;

    // 使用新的位置或保持当前位置
    const targetScrollTop = options.scrollTop !== undefined ? options.scrollTop : currentScrollTop;
    const targetScrollLeft = options.scrollLeft !== undefined ? options.scrollLeft : currentScrollLeft;

    // 判断是否需要滚动（目标位置与当前位置相同）
    const shouldScroll = targetScrollTop !== currentScrollTop || targetScrollLeft !== currentScrollLeft;
    // 如果不需要滚动，直接调用回调
    if (!shouldScroll && options.callback) {
      options.callback();
      return;
    }

    // 更新滚动位置
    if (options.behavior === "smooth" && "scrollTo" in element) {
      // 使用平滑滚动
      // 对于平滑滚动，我们需要监听滚动事件以检测滚动是否完成

      // 设置一个超时，以防滚动事件没有正确触发
      const scrollTimeout = setTimeout(() => {
        element.removeEventListener("scroll", scrollHandler);
        if (options.callback) {
          options.callback();
        }
      }, 2000); // 2秒超时

      const handleScrollEnd = () => {
        // 检测滚动是否已经到达目标位置（考虑到可能的舍入误差，使用一个小的容差值）
        const isAtTargetPosition =
          element.scrollTop == 0 ||
          element.scrollLeft == 0 ||
          (Math.abs(element.scrollTop - offsetY - targetScrollTop) < 1 &&
            Math.abs(element.scrollLeft - offsetX - targetScrollLeft) < 1);
        if (isAtTargetPosition) {
          // 移除滚动事件监听器
          element.removeEventListener("scroll", scrollHandler);
          // 调用回调函数
          if (options.callback) {
            options.callback();
          }
          clearTimeout(scrollTimeout);
        }
      };

      // 使用防抖来避免频繁检查
      const scrollHandler = debounce(handleScrollEnd, 5, { trailing: true });
      // 添加滚动事件监听器
      element.addEventListener("scroll", scrollHandler);
      handleScrollEnd();

      setTimeout(() => {
        // 执行平滑滚动
        element.scrollTo({
          top: targetScrollTop,
          left: targetScrollLeft,
          behavior: "smooth"
        });

        // 更新上次滚动位置记录
        if (this.lastScrollPositions.has(element)) {
          this.lastScrollPositions.set(element, {
            scrollTop: targetScrollTop,
            scrollLeft: targetScrollLeft
          });
        }
      }, 0);
    } else {
      // 直接设置滚动位置（瞬间滚动）
      element.scrollTop = targetScrollTop;
      element.scrollLeft = targetScrollLeft;

      // 更新上次滚动位置记录
      if (this.lastScrollPositions.has(element)) {
        this.lastScrollPositions.set(element, {
          scrollTop: targetScrollTop,
          scrollLeft: targetScrollLeft
        });
      }

      // 对于瞬间滚动，立即调用回调
      if (options.callback) {
        options.callback();
      }
    }
  }

  /**
   * 开始拖拽滑块以变更滚动值
   * @param element 要拖拽的滑块元素
   * @param targetElement 要滚动的目标元素
   * @param direction 拖拽方向 ('horizontal' | 'vertical')
   * @param options 拖拽配置选项
   * @returns 包含stop方法的对象，用于停止拖拽监听
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
    // 检查元素是否有效
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

    // 鼠标按下事件处理
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      startClientPos = direction === "vertical" ? e.clientY : e.clientX;
      startScrollPos = direction === "vertical" ? targetElement.scrollTop : targetElement.scrollLeft;

      if (options.onDragStart) {
        options.onDragStart();
      }

      // 添加全局事件监听
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    // 鼠标移动事件处理
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const clientPos = direction === "vertical" ? e.clientY : e.clientX;
      const delta = clientPos - startClientPos;

      const targetSize = direction === "vertical" ? targetElement.clientHeight : targetElement.clientWidth;
      const contentSize = direction === "vertical" ? targetElement.scrollHeight : targetElement.scrollWidth;
      const maxScroll = contentSize - targetSize;

      // 计算新的滚动位置
      const newScrollPos = startScrollPos + (delta * contentSize) / targetSize;
      const clampedScrollPos = Math.max(0, Math.min(maxScroll, newScrollPos));

      if (direction === "vertical") {
        targetElement.scrollTop = clampedScrollPos;
      } else {
        targetElement.scrollLeft = clampedScrollPos;
      }

      // 更新上次滚动位置记录
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

    // 鼠标释放事件处理
    const handleMouseUp = () => {
      if (!isDragging) return;

      isDragging = false;

      if (options.onDragEnd) {
        options.onDragEnd();
      }

      // 移除全局事件监听
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // 添加鼠标按下事件监听
    element.addEventListener("mousedown", handleMouseDown);

    // 停止拖拽监听的方法
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
   */
  public removeAllListeners(): void {
    this.listeners.clear();
    this.lastScrollPositions.clear();
  }

  /**
   * 销毁监听器
   */
  public destroy(): void {
    this.removeAllListeners();
    // 清除所有尺寸观察器
    this.resizeObservers.forEach(observer => {
      observer.disconnect();
    });
    this.resizeObservers.clear();
  }

  /**
   * 监听元素尺寸变化
   * @param id 观察器唯一标识
   * @param element 要观察的DOM元素
   * @param handler 尺寸变化处理函数
   * @returns 包含stop方法的对象，用于停止观察
   */
  public observeElementResize(id: string, element: HTMLElement, handler: (data: ResizeData) => void): { stop: () => void } {
    // 检查元素是否有效
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid element provided for resize observation");
      return {
        stop: () => {
          //
        }
      };
    }

    // 使用ResizeObserver监听元素尺寸变化
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

      // 开始观察元素
      resizeObserver.observe(element);
      this.resizeObservers.set(id, resizeObserver);

      // 初始触发一次回调，提供当前尺寸
      const rect = element.getBoundingClientRect();
      handler({
        width: rect.width,
        height: rect.height,
        element
      });

      // 返回停止观察的方法
      return {
        stop: () => {
          resizeObserver.unobserve(element);
          resizeObserver.disconnect();
          this.resizeObservers.delete(id);
        }
      };
    } else {
      // 降级方案：使用轮询方式检测尺寸变化
      console.warn("ResizeObserver is not supported. Using fallback method.");

      let lastWidth = element.offsetWidth;
      let lastHeight = element.offsetHeight;
      let pollingInterval: number | null = null;

      // 定期检查元素尺寸
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
      }, 200); // 每200毫秒检查一次

      // 返回停止观察的方法
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
 * @param element 要监听的DOM元素
 * @param handler 滚动处理函数
 * @param options 配置选项
 * @returns 包含remove方法的对象，用于移除监听
 */
export function listenElementScroll(
  element: HTMLElement,
  handler: (data: ScrollData) => void,
  directlyHandler: (data: { scrollTop: number; scrollLeft: number; scrollData: ScrollData }) => void,
  options: ScrollListenerOptions = { defaultScrollHorizontalThumb: 0, defaultScrollVerticalThumb: 0 }
): {
  listener: ScrollListener;
  bodyHeight: number;
  bodyWidth: number;
  useHorizontal: boolean;
  useVertical: boolean;
  remove: () => void;
  update: (parentBoxRef: HTMLElement | null) => ScrollUserInfo;
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
    update: (parentBoxRef: HTMLElement | null) => {
      return listener.update(element, parentBoxRef);
    }
  };
}

/**
 * 监听多个指定元素的滚动状态
 * @param elements 要监听的DOM元素数组
 * @param handler 滚动处理函数
 * @param options 配置选项
 * @returns 包含remove方法的对象，用于移除所有监听
 */
export function listenMultipleElementsScroll(
  elements: HTMLElement[],
  handler: (data: ScrollData) => void,
  directlyHandler: (data: { scrollTop: number; scrollLeft: number }) => void,
  options: ScrollListenerOptions = { defaultScrollHorizontalThumb: 0, defaultScrollVerticalThumb: 0 }
): { remove: () => void } {
  const listener = new ScrollListener(options);
  const ids: string[] = [];

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
 * @param element 要检查的元素
 * @param options IntersectionObserver选项
 * @returns 包含isInViewport状态和停止观察方法的对象
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
    // 降级处理：使用getBoundingClientRect判断
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

// 创建全局滚动监听器实例
export const scrollListener = new ScrollListener();

/**
 * 手动设置指定元素的滚动位置的便捷函数
 * @param element 要设置滚动位置的DOM元素
 * @param options 滚动位置选项
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
  // 检查元素是否有效
  if (!element || !(element instanceof HTMLElement)) {
    console.warn("Invalid element provided for scroll position setting");
    // 如果有回调函数，即使元素无效也要调用
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
 * @param element 要拖拽的滑块元素
 * @param targetElement 要滚动的目标元素
 * @param direction 拖拽方向 ('horizontal' | 'vertical')
 * @param options 拖拽配置选项
 * @returns 包含stop方法的对象，用于停止拖拽监听
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
  // 检查元素是否有效
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
 * @param element 要观察的DOM元素
 * @param handler 尺寸变化处理函数
 * @returns 包含stop方法的对象，用于停止观察
 */
export function observeElementResize(element: HTMLElement, handler: (data: ResizeData) => void): { stop: () => void } {
  // 检查元素是否有效
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

export default scrollListener;
