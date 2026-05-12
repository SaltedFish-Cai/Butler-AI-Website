/**
 * 判断值是否为 null 或 undefined
 * @param val - 任意值
 * @returns boolean 是否为空
 * @description 判断值是否为 null 或 undefined
 */
function isNil(val: unknown): boolean {
  return val === null || val === undefined;
}
export default isNil;
