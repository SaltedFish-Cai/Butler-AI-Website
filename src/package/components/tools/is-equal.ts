/**
 * 判断两个值是否相等
 * @param value - 值1
 * @param other - 值2
 * @returns boolean 是否相等
 * @description 简单的值相等判断，将值转为字符串后比较
 */
function isEqual(value: unknown, other: unknown): boolean {
  return String(value) === String(other);
}
export default isEqual;
