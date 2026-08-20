/**
 * 深拷贝函数（保留函数）
 * @type {(value: unknown) => unknown}
 * @description 优先使用 structuredClone 拷贝纯数据对象（性能好、保留 Date/Map/Set/RegExp 等）；
 * 当对象内包含函数（如表单校验规则里的 validator）导致 structuredClone 抛错时，
 * 降级为「保留函数与特殊类型的递归深拷贝」，避免 JSON 序列化丢弃函数字段。
 * 适用于表单数据、配置项、校验规则（含 validator 函数）等对象。
 */
function cloneDeep<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  // 基本类型（含 function）原样返回，函数直接保留引用
  if (value === null || typeof value !== "object") return value;

  // 处理循环引用：命中已拷贝过的对象直接返回其副本
  if (seen.has(value)) return seen.get(value) as T;

  // 直接复用 structuredClone 的快速路径：遇函数抛错时再走下方递归
  try {
    // 先探测纯数据：若整个对象树不含函数，structuredClone 可胜任且更高效
    // 这里不直接调用，避免对含函数对象重复探测开销，改由下方统一处理
    if (!hasFunction(value)) {
      return structuredClone(value) as T;
    }
  } catch {
    // 意外情况（如不可序列化对象）走递归兜底
  }

  // --- 保留特殊类型（structuredClone 能力等价） ---
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof RegExp) return new RegExp(value.source, value.flags) as T;
  if (value instanceof Map) {
    const map = new Map();
    seen.set(value, map);
    value.forEach((v, k) => map.set(cloneDeep(k, seen), cloneDeep(v, seen)));
    return map as unknown as T;
  }
  if (value instanceof Set) {
    const set = new Set();
    seen.set(value, set);
    value.forEach(v => set.add(cloneDeep(v, seen)));
    return set as unknown as T;
  }

  if (Array.isArray(value)) {
    const arr: unknown[] = new Array(value.length);
    seen.set(value, arr);
    value.forEach((item, index) => {
      arr[index] = cloneDeep(item, seen);
    });
    return arr as unknown as T;
  }

  // --- 普通对象：深拷贝所有可枚举自有属性（含 symbol 键），函数属性保留原引用 ---
  const output: Record<PropertyKey, unknown> = {};
  seen.set(value, output);
  const keys = Reflect.ownKeys(value);
  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(value, key);
    if (desc && desc.enumerable) {
      output[key] = cloneDeep((value as Record<PropertyKey, unknown>)[key], seen);
    }
  }
  return output as T;
}

/**
 * 检测对象（或其嵌套子节点）中是否包含函数
 * @description 用于决定走 structuredClone 快速路径，还是走「保留函数」的递归深拷贝
 */
function hasFunction(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null || typeof value !== "object") return typeof value === "function";
  if (seen.has(value)) return false;
  seen.add(value);
  if (value instanceof Map) {
    for (const [k, v] of value) {
      if (hasFunction(k, seen) || hasFunction(v, seen)) return true;
    }
    return false;
  }
  if (value instanceof Set) {
    for (const v of value) {
      if (hasFunction(v, seen)) return true;
    }
    return false;
  }
  for (const key of Reflect.ownKeys(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, key);
    if (desc && hasFunction(desc.value, seen)) return true;
  }
  return false;
}

export default cloneDeep;
