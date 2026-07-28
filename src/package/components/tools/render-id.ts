// # 固定 ID 生成
import { getCurrentInstance } from "vue";

// 自动生成组件唯一标识，刷新后同一组件位置的 uid 保持不变，适用于自动化测试
export function useRenderId(prefix = "id"): string {
  const instance = getCurrentInstance();
  return `${prefix}_${instance?.uid ?? 0}`;
}

// 传入 key 手动指定 id，用于 v-for 等需显式控制 ID 的场景
export function renderId(key: string): string {
  return `pa_${key}`;
}

export default useRenderId;
