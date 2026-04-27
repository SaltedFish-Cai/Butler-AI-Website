/**
 * **模块导入**
 * @description 导入 lodash 工具库
 * */
import _ from "lodash";

/**
 * **模块导入**
 * @description 导入文件数据类型定义
 * */
import { FileDataType } from "./types";

/**
 * **模块导入**
 * @description 从 lodash 中解构 isNil 函数
 * */
const { isNil } = _;

/**
 * **上传作用域常量**
 * @type `string`
 * @description 用于日志标识的上传模块名称
 * */
const SCOPE = "ElUpload";

/**
 * **上传请求错误类**
 * @description 封装 XMLHttpRequest 上传过程中的错误信息
 * @extends Error
 * */
export class UploadAjaxError extends Error {
  /**
   * **错误名称**
   * @type `string`
   * @description 固定为 "UploadAjaxError"
   * */
  name = "UploadAjaxError";

  /**
   * **HTTP 状态码**
   * @type `number`
   * @description 服务器返回的 HTTP 状态码
   * */
  status: number;

  /**
   * **请求方法**
   * @type `string`
   * @description 使用的 HTTP 请求方法（如 GET、POST）
   * */
  method: string;

  /**
   * **请求 URL**
   * @type `string`
   * @description 发起请求的目标地址
   * */
  url: string;

  /**
   * **构造函数**
   * @param `message` `string` 错误消息
   * @param `status` `number` HTTP 状态码
   * @param `method` `string` 请求方法
   * @param `url` `string` 请求 URL
   * @description 初始化上传错误实例
   * */
  constructor(message: string, status: number, method: string, url: string) {
    super(message);
    this.status = status;
    this.method = method;
    this.url = url;
  }
}

/**
 * **获取上传错误对象**
 * @param `action` `string` 请求地址
 * @param `option` `{ method: string }` 请求配置
 * @param `xhr` `XMLHttpRequest` XMLHttpRequest 实例
 * @returns `UploadAjaxError` 上传错误实例
 * @description 根据 XMLHttpRequest 响应信息构建错误对象
 * */
function getError(action: string, option: { method: string }, xhr: XMLHttpRequest): UploadAjaxError {
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
 * **获取响应体**
 * @param `xhr` `XMLHttpRequest` XMLHttpRequest 实例
 * @returns `XMLHttpRequestResponseType` 解析后的响应体
 * @description 尝试解析响应体为 JSON，失败则返回原始文本
 * */
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
 * **Ajax 文件上传函数**
 * @param `option` `AjaxUploadOptions` 上传配置选项
 * @returns `XMLHttpRequest | undefined` XMLHttpRequest 实例
 * @description 使用 XMLHttpRequest 执行文件上传，支持进度回调
 * */
interface AjaxUploadOptions {
  ajaxFileList?: Array<{ file: File }>;
  action?: string;
  method?: string;
  data?: Record<string, unknown>;
  onProgress?: (event: ProgressEvent & { percent: number }) => void;
  onError?: (error: UploadAjaxError) => void;
  onSuccess?: (response: string | { Code: number; Data: Array<FileDataType> | FileDataType; Message?: string }) => void;
  withCredentials?: boolean;
  headers?: Headers | Record<string, unknown>;
}

export const ajaxUpload = (option: AjaxUploadOptions): XMLHttpRequest | undefined => {
  if (!option.ajaxFileList) return;
  if (typeof XMLHttpRequest === "undefined") window.log.error(SCOPE, "XMLHttpRequest is undefined");

  const xhr = new XMLHttpRequest();
  const action = option.action ?? "";

  if (xhr.upload) {
    xhr.upload.addEventListener("progress", (evt: ProgressEvent) => {
      const progressEvt: ProgressEvent & { percent: number } = Object.assign(evt, {
        percent: evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0
      });
      option.onProgress?.(progressEvt);
    });
  }

  const formData: FormData = new FormData();
  if (option.data) {
    for (const [key, value] of Object.entries(option.data)) {
      if (Array.isArray(value) && value.length) {
        value.forEach(item => {
          formData.append(key, String(item));
        });
      } else formData.append(key, String(value));
    }
  }
  for (let index = 0; index < (option.ajaxFileList?.length ?? 0); index++) {
    const opt = option.ajaxFileList![index];
    formData.append(opt.file.name, opt.file, opt.file.name);
  }

  xhr.addEventListener("error", () => {
    option.onError?.(getError(action, { method: option.method ?? "POST" }, xhr));
  });

  xhr.addEventListener("load", () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError?.(getError(action, { method: option.method ?? "POST" }, xhr));
    }
    option.onSuccess?.(getBody(xhr));
  });

  xhr.open(option.method ?? "POST", action, true);

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
};
