/**
 * 判断两个值是否相等
 * @param value - 值1
 * @param other - 值2
 * @returns boolean 是否相等
 * @description 简单的值相等判断，将值转为字符串后比较
 */
function isEqual(value: unknown, other: unknown): boolean {
  const _val = typeof value === "object" ? JSON.stringify(value) : String(value);
  const _other = typeof other === "object" ? JSON.stringify(other) : String(other);
  return _val === _other;
}
export default isEqual;
