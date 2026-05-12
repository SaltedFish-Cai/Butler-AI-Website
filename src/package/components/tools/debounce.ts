/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 * @description 简单的 trailing debounce 实现
 */
function debounce(fn: Function, delay: number): Function {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: unknown[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
export default debounce;
