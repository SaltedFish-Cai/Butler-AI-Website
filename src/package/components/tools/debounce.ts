/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @param options - 配置选项
 * @returns 防抖后的函数
 * @description trailing 模式防抖实现，在延迟时间结束后触发最后一次调用
 */
function debounce(fn: (...args: any) => void, delay: number, options?: { trailing?: boolean }): (...args: unknown[]) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const trailing = options?.trailing ?? true;
  return function (this: unknown, ...args: unknown[]) {
    if (timer) clearTimeout(timer);
    if (trailing) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
export default debounce;
