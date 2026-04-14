// # type
import { InternalAxiosRequestConfig } from "axios";

export interface ResultData<T = any> {
  Data: any;
  Code: number;
  Message: string;
  Root: T;
  Status: boolean;
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noLoading?: boolean;
  noMessage?: boolean;
  noLink?: boolean;
  requestHeader?: Record<string, string>;
}

export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface ReqDictionaryParams {
  filter: {
    fieldName: string;
    fieldValue: string;
    conditionalType: string;
  }[];
  page?: {};
  params?: {};
  sort?: [];
}
