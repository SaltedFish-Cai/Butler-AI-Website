/**
 * 环境变量统一入口
 *
 * 后端服务地址在项目 env/ 目录下的 .env 文件中通过 VITE_API_BASE_URL 配置
 * （vite.config.ts 中 envDir 指定）：
 * - dev（开发）：env/.env.dev → dev-servers.frontend-m.online
 * - prd（生产）：env/.env.prd  → servers.frontend-m.online
 *
 * 请求寻址策略：
 * - 生产构建：直接请求 VITE_API_BASE_URL（后端已开启 CORS）；
 * - 开发环境：保持同源相对路径，由 vite.config.ts 中的代理转发到目标后端。
 */

/** 后端服务地址（原样读取环境变量） */
const rawApiBaseUrl: string = (import.meta.env.VITE_API_BASE_URL as string) || "";

/**
 * 实际使用的后端根地址。
 * - dev / localhost：返回空串 → 请求走同源代理，由 vite.config.ts 转发；
 * - prd（生产）：直接返回配置的后端地址（无论 dev server 还是构建产物），
 *   前端直连域名，避免经 vite 代理转发导致的 502。
 */
export const API_BASE_URL: string = rawApiBaseUrl || "";

/**
 * 将相对接口路径解析为最终请求地址（已是绝对地址则原样返回）。
 */
export function resolveApiUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return API_BASE_URL ? API_BASE_URL + url : url;
}
