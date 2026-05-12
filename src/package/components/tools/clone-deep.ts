/**
 * 深拷贝函数
 * @type {(value: unknown) => unknown}
 * @description 使用 structuredClone 实现深拷贝，支持循环引用、Map、Set、Date 等
 */
function cloneDeep<T>(value: T): T {
  return structuredClone(value);
}
export default cloneDeep;
