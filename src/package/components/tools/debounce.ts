/**
 * 防抖函数
 * @type {(fn: (...args: any[]) => void, delay: number) => (...args: any[]) => void}
 * @description trailing 模式防抖实现，在延迟时间结束后触发最后一次调用
 */
function debounce(fn: (...args: any[]) => void, delay: number): (...args: any[]) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: unknown[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
export default debounce;
