/**
 * 比较两个值是否相等
 * @param a 第一个值
 * @param b 第二个值
 * @returns 如果两个值相等，则返回true；否则返回false
 */
export function equalData(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length == b.length && a.every((item, index) => item == b[index]);
  } else if (Array.isArray(a)) {
    return a.includes(b);
  } else if (Array.isArray(b)) {
    return b.includes(a);
  }
  return a == b;
}
