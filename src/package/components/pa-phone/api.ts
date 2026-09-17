// # Import
import { useBaseStore } from "../store/index";
import { resolveApiUrl } from "@/config/env";

interface ApiFetchOptions {
  method?: "DELETE" | "GET" | "POST" | "PUT";
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface ApiResponse<T = unknown> {
  Code: number;
  Data: T;
  Message?: string;
}

/**
 * 通用 API 请求函数（供动态 SFC 组件使用）
 * 自动读取 Pinia store 中的 apiBaseUrl 和请求头配置
 * 并统一经 resolveApiUrl 解析：环境变量 VITE_API_BASE_URL 存在时拼上后端域名，
 * 否则保持同源相对路径（由 vite 代理转发）
 */
export async function apiFetch<T = unknown>(url: string, options: ApiFetchOptions = {}): Promise<ApiResponse<T>> {
  const store = useBaseStore();
  const apiBaseUrl = store.getApiBaseUrl;
  const fullUrl = resolveApiUrl(apiBaseUrl + url);

  const { method = "GET", params, headers } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...store.getRequestHeader,
    ...headers
  };

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include"
  };

  if (params && method !== "GET") {
    fetchOptions.body = JSON.stringify(params);
  }

  let finalUrl = fullUrl;
  if (params && method === "GET") {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    }
    const qs = query.toString();
    if (qs) {
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + qs;
    }
  }

  const response = await fetch(finalUrl, fetchOptions);
  const data = await response.json();
  return data as ApiResponse<T>;
}
