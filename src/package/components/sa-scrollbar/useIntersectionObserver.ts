import { ref } from "vue";

/**
 * 监听元素是否进入视窗的自定义Hook
 * @param target 要监听的DOM元素或ref
 * @param options IntersectionObserver配置选项
 * @returns 包含isIntersecting状态和停止观察方法的对象
 */
export function useIntersectionObserver(target: Element, options: IntersectionObserverInit = {}) {
  // 状态：元素是否在视窗内
  const isIntersecting = ref(false);

  // IntersectionObserver实例
  let observer: IntersectionObserver | null = null;

  // 初始化观察器
  const initObserver = () => {
    // 如果浏览器不支持IntersectionObserver，则直接返回
    if (!("IntersectionObserver" in window)) {
      console.warn("IntersectionObserver is not supported in this browser");
      return;
    }

    // 获取目标元素
    const targetElement = target;
    // 如果没有目标元素，则不初始化
    if (!targetElement) return;

    // 创建观察器
    observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      isIntersecting.value = entry.isIntersecting;
    }, options);

    // 开始观察
    console.log("++++++++++> 开始观察:");
    observer.observe(targetElement);
  };

  // 停止观察
  const stopObserving = () => {
    console.log("++++++++++> 停止观察:");
    if (observer) {
      const targetElement = target;
      if (targetElement) {
        observer.unobserve(targetElement);
      }
      observer.disconnect();
      observer = null;
    }
  };

  initObserver();

  return {
    isIntersecting,
    stopObserving
  };
}

// 导出类型定义
export type IntersectionObserverResult = ReturnType<typeof useIntersectionObserver>;
