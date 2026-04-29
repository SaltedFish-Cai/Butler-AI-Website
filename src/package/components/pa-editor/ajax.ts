/**
 * @description 导入 lodash 的 isNil 函数
 */
import _ from "lodash";

const { isNil } = _;

/**
 * @description 错误作用域名称
 */
const SCOPE = "ElUpload";

/**
 * @description 上传请求错误类
 */
export class UploadAjaxError extends Error {
  name = "UploadAjaxError";
  /**
   * @description HTTP 状态码
   */
  status: number;
  /**
   * @description 请求方法
   */
  method: string;
  /**
   * @description 请求地址
   */
  url: string;

  /**
   * @description 构造函数
   * @param message - 错误消息
   * @param status - HTTP 状态码
   * @param method - 请求方法
   * @param url - 请求地址
   */
  constructor(message: string, status: number, method: string, url: string) {
    super(message);
    this.status = status;
    this.method = method;
    this.url = url;
  }
}

/**
 * @description 获取错误对象
 * @param action - 请求地址
 * @param option - 请求选项
 * @param xhr - XMLHttpRequest 对象
 * @returns 错误对象
 */
function getError(action: string, option: any, xhr: any): UploadAjaxError {
  let msg: string;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to ${option.method} ${action} ${xhr.status}`;
  }
  return new UploadAjaxError(msg, xhr.status, option.method, action);
}

/**
 * @description 获取响应体
 * @param xhr - XMLHttpRequest 对象
 * @returns 解析后的响应体
 */
function getBody(xhr: XMLHttpRequest): XMLHttpRequestResponseType {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * @description 上传文件请求配置
 */
interface AjaxUploadOption {
  /**
   * @description 请求地址
   */
  action: string;
  /**
   * @description 请求方法
   */
  method?: string;
  /**
   * @description 请求头
   */
  headers?: any;
  /**
   * @description 上传数据
   */
  data?: any;
  /**
   * @description 文件列表
   */
  ajaxFileList?: Array<{ filename: string; file: any }>;
  /**
   * @description 是否携带 cookie
   */
  withCredentials?: boolean;
  /**
   * @description 上传进度回调
   */
  onProgress?: (evt: any) => void;
  /**
   * @description 上传成功回调
   */
  onSuccess?: (response: any) => void;
  /**
   * @description 上传失败回调
   */
  onError?: (error: UploadAjaxError) => void;
}

/**
 * @description 执行文件上传请求
 * @param option - 上传配置
 * @returns XMLHttpRequest 对象
 */
export function ajaxUpload(option: AjaxUploadOption): XMLHttpRequest | undefined {
  if (!option.ajaxFileList) {
    return undefined;
  }
  if (typeof XMLHttpRequest === "undefined") {
    window.log.error(SCOPE, "XMLHttpRequest is undefined");
  }
  const xhr = new XMLHttpRequest();
  const action = option.action;
  if (xhr.upload) {
    xhr.upload.addEventListener("progress", evt => {
      const progressEvt: any = evt;
      progressEvt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0;
      option.onProgress?.(progressEvt);
    });
  }
  const formData: any = new FormData();
  if (option.data) {
    for (const [key, value] of Object.entries(option.data)) {
      if (Array.isArray(value) && value.length) formData.append(key, ...value);
      else formData.append(key, value);
    }
  }
  for (let index = 0; index < option.ajaxFileList.length; index++) {
    const opt = option.ajaxFileList[index];
    formData.append(opt.filename, opt.file, opt.filename);
  }
  xhr.addEventListener("error", () => {
    option.onError?.(getError(action, option, xhr));
  });
  xhr.addEventListener("load", () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError?.(getError(action, option, xhr));
    }
    option.onSuccess?.(getBody(xhr));
  });
  xhr.open(option.method || "post", action, true);
  if (option.withCredentials && "withCredentials" in xhr) {
    xhr.withCredentials = true;
  }
  const headers = option.headers || {};
  if (headers instanceof Headers) {
    headers.forEach((value, key) => xhr.setRequestHeader(key, value));
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (isNil(value)) continue;
      xhr.setRequestHeader(key, String(value));
    }
  }
  xhr.send(formData);
  return xhr;
}
