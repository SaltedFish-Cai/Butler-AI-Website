// # 固定 ID 生成
import { getCurrentInstance, type ComponentInternalInstance, type VNode } from "vue";

function djb2(str: string, seed = 5381): number {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash >>> 0;
}

// 单 DJB2 哈希 → 6~7 位 base36，配合 vnode 签名碰撞概率极低
// registry 缓存保证同一 path 输出一致
const registry = new Map<string, string>();

function resolvePath(path: string): string {
  const cached = registry.get(path);
  if (cached) return cached;

  const id = djb2(path).toString(36);

  registry.set(path, id);
  return id;
}

// 从 vnode 提取可区分的 props + 文本特征（与创建顺序无关）
function getNodeSignature(vnode: VNode): string {
  const parts: string[] = [];

  if (vnode.props) {
    const entries: string[] = [];
    for (const [k, v] of Object.entries(vnode.props)) {
      // 跳过 Vue 内部属性、事件处理器、可变样式、scoped hash
      if (k === "key" || k === "ref" || k === "ref_for" || k === "ref_key") continue;
      if (/^on[A-Z]/.test(k)) continue;
      if (k.startsWith("data-v-")) continue;
      if (k === "class" || k === "style") continue;
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        entries.push(`${k}:${v}`);
      }
    }
    if (entries.length) {
      parts.push(entries.sort().join("&"));
    }
  }

  // 文本子节点（如按钮文字），slot 内容越深越可靠
  if (typeof vnode.children === "string") {
    const t = vnode.children.trim();
    if (t) parts.push(`[${t.slice(0, 50)}]`);
  }

  return parts.join("|");
}

// 路由包装组件以 route.fullPath 作为 name/key，query 部分（如 ?tabName=xx）变化时
// 会导致同一页面生成不同的 renderId（SPA 内部导航与整页刷新两条路径不一致）。
// 这里对 URL 形态的段去掉 query，保证同一路径的页面 id 稳定，同时路径参数仍参与区分。
function stripRouteQuery(segment: string): string {
  if (!segment.startsWith("/")) return segment;
  const idx = segment.indexOf("?");
  return idx > -1 ? segment.slice(0, idx) : segment;
}

// 遍历组件树构建稳定路径
// - v-for 场景自动带上 vnode.key
// - 无 key 时基于 vnode props + 文本内容签名区分，与创建顺序无关
function buildPath(instance: ComponentInternalInstance): string {
  const segments: string[] = [];
  let current: ComponentInternalInstance | null = instance;

  while (current) {
    const name = stripRouteQuery((current.type as any)?.__name ?? (current.type as any)?.name ?? "anonymous");
    const key = current.vnode?.key;
    const keyStr = key != null && typeof key !== "symbol" ? String(key) : null;

    if (keyStr != null) {
      segments.unshift(`${name}[${stripRouteQuery(keyStr)}]`);
    } else {
      const sig = getNodeSignature(current.vnode);
      segments.unshift(sig ? `${name}|${sig}` : name);
    }

    current = current.parent;
  }

  return segments.join("/");
}

// 自动生成组件唯一标识，同一组件树路径固定输出相同的短 hash
export function useRenderId(prefix = ""): string {
  const instance = getCurrentInstance();
  if (!instance) return `${prefix}i_0`;

  return `${prefix}${resolvePath(buildPath(instance))}`;
}

// 传入 key 手动指定 id，用于 v-for 等需显式控制 ID 的场景
export function renderId(key: string): string {
  return `pa_${key}`;
}

export default useRenderId;
