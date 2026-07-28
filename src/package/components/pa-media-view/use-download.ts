/**
 * 浏览器环境判断工具
 * @description 检测代码是否在浏览器环境中运行
 */
import inBrowser from "../tools/inBrowser";
/**
 * 消息反馈组件
 * @description 消息、对话框、通知组件
 */
import { M_MessageBox, M_Notification } from "../feedback";
/**
 * 获取文件 Blob 数据
 * @param config - 下载配置
 * @param config.downloadHose - 下载服务器地址
 * @param config.requestHeader - 请求头配置
 * @param path - 文件路径
 * @returns Promise<Blob | undefined>
 * @description 接收数据流生成 blob，创建链接，下载文件
 */
export const useGetBlob = async (config = { downloadHose: "", requestHeader: {} }, path: string): Promise<Blob | undefined> => {
  try {
    const headerData = config.requestHeader;
    const baseURL = config.downloadHose;

    const _path = baseURL + path;
    return await fetch(`${_path}`, {
      method: "GET",
      mode: "cors",
      headers: headerData
    }).then(async (response: any) => {
      if (response.status != 200) {
      } else if (response.headers.get("Content-Type")?.includes("application/json")) {
        response.json().then(json => {
          if (json.Message == "当前页面过期") {
            M_MessageBox({
              message: { "en-US": "Current page has expired, please refresh the page.", "zh-CN": "当前页面已过期，请刷新页面" },
              onConfirm: () => {
                location.reload();
              }
            });
          } else if (json.Message == "批量导出") {
            M_Notification({
              message: {
                "en-US": "Data volume is too large, please check the export progress in the export management - export records.",
                "zh-CN": "数据量过大，请至【导出管理-导出记录】中进行查看导出进度"
              },
              type: "warning",
              duration: 10000
            });
          } else {
            M_Notification({
              title: "下载出错",
              message: json.Message,
              type: "danger",
              duration: 3000
            });
          }
        });
      } else {
      }
      return response.blob();
    });
  } catch (error) {
    window.log.error(String(error));
  }
};
/**
 * 下载文件
 * @param config - 下载配置
 * @param config.downloadHose - 下载服务器地址
 * @param config.requestHeader - 请求头配置
 * @param path - 文件路径
 * @param exFileName - 下载时的文件名
 * @returns Promise<void>
 * @description 根据文件路径下载文件，支持自定义文件名
 */
export const useDownload = async (
  config = { downloadHose: "", requestHeader: {} },
  path: string,
  exFileName?: string
): Promise<void> => {
  const megNotify: any = M_Notification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message:
      "<div class='download-message'><span class='pa-icon_font icon-loading_line'></span>如果数据庞大会导致下载缓慢，请您耐心等待！</div>",
    type: "info",
    duration: 0,
    customClass: "download-message-info"
  });

  try {
    const headerData = config.requestHeader;
    const baseURL = config.downloadHose;

    const headers: Record<string, string> = {};
    if (headerData) {
      for (const key in headerData) {
        headers[key] = headerData[key];
      }
    }
    const _path = baseURL + path;
    fetch(`${_path}`, {
      method: "GET",
      mode: "cors",
      headers
    }).then(response => {
      const fileNameEncode = response.headers.get("content-disposition")?.split("filename=")[1];
      const fileName = (fileNameEncode && decodeURIComponent(fileNameEncode)) || exFileName || "下载文件";
      if (response.status != 200) {
        megNotify?.close();
        M_Notification({
          title: "下载出错",
          message: response.statusText,
          type: "danger",
          duration: 3000
        });
      } else if (response.headers.get("Content-Type")?.includes("application/json")) {
        response.json().then(json => {
          if (json.Message == "当前页面过期") {
            megNotify?.close();
            M_MessageBox({
              title: "当前页面过期",
              message: "当前页面已过期",
              onConfirm: () => {
                location.reload();
              }
            });
          } else if (json.Message == "批量导出") {
            megNotify?.close();
            M_Notification({
              title: "温馨提示",
              message: "数据量过大，请至【导出管理-导出记录】中进行查看导出进度",
              type: "warning",
              duration: 10000
            });
          } else {
            megNotify?.close();
            M_Notification({
              title: "下载出错",
              message: json.Message,
              type: "danger",
              duration: 3000
            });
          }
        });
      } else {
        megNotify?.close();
        M_Notification({
          title: "下载成功",
          message: `请注意下载文件内容，文件名(${fileName})`,
          type: "success",
          duration: 3000
        });
      }
      if (inBrowser) {
        response.blob().then(res => {
          if ("msSaveOrOpenBlob" in navigator) {
            const _navigator: any = window.navigator;
            return _navigator.msSaveOrOpenBlob(res, `${fileName}` || `${new Date().getTime()}.xlsx`);
          }
          const blobUrl = typeof window !== "undefined" && window.URL.createObjectURL(res);
          const exportFile = typeof window !== "undefined" && window.document.createElement("a");
          exportFile.style.display = "none";
          exportFile.download = `${fileName}` || `${new Date().getTime()}.xlsx`;
          exportFile.href = blobUrl;
          typeof window !== "undefined" && window.document.body.appendChild(exportFile);
          exportFile.click();
          typeof window !== "undefined" && window.document.body.removeChild(exportFile);
          typeof window !== "undefined" && window.URL.revokeObjectURL(blobUrl);
        });
      }
    });
  } catch (error) {
    window.log.error(String(error));
  }
};
