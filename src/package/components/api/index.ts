// # Import
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useBaseStore as globalState } from "../store/index";
import { CustomAxiosRequestConfig, ResultData } from "./type";

// # Var
const config = {
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
};

// # Axios实例
class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const useGlobalState = globalState();
        const HeaderData = useGlobalState.getRequestHeader;
        config.headers.set("Content-Type", "application/json");
        for (const key in HeaderData) {
          config.headers.set(key, HeaderData[key]);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // # 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        return data;
      },
      async (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }
}

export default new RequestHttp(config);
