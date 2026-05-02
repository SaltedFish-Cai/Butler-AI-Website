/**
 * **模块导入**
 * @description 导入 Vue 响应式 API
 * */
import { ref } from "vue";
/**
 * **监听元素是否进入视窗的自定义Hook**
 * @param `target` `Element` 要监听的DOM元素
 * @param `options` `IntersectionObserverInit` IntersectionObserver配置选项
 * @returns `IntersectionObserverResult` 包含isIntersecting状态和停止观察方法的对象
 * @description 监听元素是否进入视窗
 * */
export function useIntersectionObserver(target: Element, options: IntersectionObserverInit = {}) {
  /**
   * **状态：元素是否在视窗内**
   * @type `Ref<boolean>`
   * @description 元素是否在视窗内
   * */
  const isIntersecting = ref(false);
  /**
   * **IntersectionObserver实例**
   * @type `IntersectionObserver | null`
   * @description IntersectionObserver实例
   * */
  let observer: IntersectionObserver | null = null;
  /**
   * **初始化观察器**
   * @description 初始化 IntersectionObserver
   * */
  function initObserver(): void {
    if (!("IntersectionObserver" in window)) {
      console.warn("IntersectionObserver is not supported in this browser");
      return;
    }
    const targetElement = target;
    if (!targetElement) return;
    observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      isIntersecting.value = entry.isIntersecting;
    }, options);
    observer.observe(targetElement);
  }
  /**
   * **停止观察**
   * @description 停止观察元素
   * */
  function stopObserving(): void {
    if (observer) {
      const targetElement = target;
      if (targetElement) {
        observer.unobserve(targetElement);
      }
      observer.disconnect();
      observer = null;
    }
  }
  initObserver();
  return {
    isIntersecting,
    stopObserving
  };
}
/**
 * **IntersectionObserver结果类型**
 * @description IntersectionObserver返回结果类型
 * */
export type IntersectionObserverResult = ReturnType<typeof useIntersectionObserver>;
