/**
 * 深拷贝函数
 * @type {(value: unknown) => unknown}
 * @description 优先使用 structuredClone，失败时降级为 JSON 深拷贝。适用于纯数据对象（表单数据、配置项等）。
 */
function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}
export default cloneDeep;
