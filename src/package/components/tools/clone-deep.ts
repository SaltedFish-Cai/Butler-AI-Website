/**
 * 深拷贝函数
 * @type {(value: unknown) => unknown}
 * @description 使用 structuredClone 实现深拷贝，支持循环引用、Map、Set、Date 等
 */

function safeStructuredClone(obj) {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(obj);
    } catch (err: any) {
      if (err.name === "DataCloneError") {
        throw new Error(`无法克隆对象：包含不支持的类型 ${err.message}`);
      }
      throw err;
    }
  }
  // 降级到 JSON（注意：会丢失 Date、Map、函数等）
  return JSON.parse(JSON.stringify(obj));
}
export default safeStructuredClone;
