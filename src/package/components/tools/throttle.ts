/**
 * 节流函数
 * @param fn - 要节流的函数
 * @param wait - 等待时间（毫秒）
 * @param options - 配置选项
 * @returns 节流后的函数
 * @description trailing 模式节流实现
 */
function throttle(
  fn: (...args: unknown[]) => void,
  wait: number,
  options?: { trailing?: boolean }
): (...args: unknown[]) => void {
  let lastTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const trailing = options?.trailing ?? true;
  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    } else if (trailing && !timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, wait - (now - lastTime));
    }
  };
}
export default throttle;
