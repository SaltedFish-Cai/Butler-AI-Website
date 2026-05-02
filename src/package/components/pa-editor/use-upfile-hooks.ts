/**
 * @description 导入 Vue 相关类型
 */
import { computed, ComputedRef, ref, Ref } from "vue";
/**
 * @description 导入消息提示组件
 */
import { M_Message } from "../feedback";
/**
 * @description 导入文件数据类型
 */
import type { PaFileDataType } from "../pa-file/type";
/**
 * @description 导入文件上传请求
 */
import { ajaxUpload } from "../pa-file/ajax";
/**
 * @description 导入全局配置类型
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * @description 导入编辑器类型
 */
import type { ComponentProps } from "./types";
/**
 * @description 导入 lodash 防抖函数
 */
import _ from "lodash";

const { debounce } = _;

/**
 * @description 文件上传钩子函数
 * @param props - 组件 props
 * @param fileInput - 文件输入引用
 * @param PancakeGlobalConfig - 全局配置
 * @param editorRef - 编辑器引用
 * @returns 文件上传相关方法
 */
export function useUpFileHooks(
  props: ComponentProps,
  fileInput: Ref<any>,
  PancakeGlobalConfig: ComputedRef<PancakeGlobalConfigType>,
  editorRef: Ref<any>
) {
  /**
   * @description 上传中状态
   */
  const upImageLoading = ref(false);

  /**
   * @description 待上传文件列表
   */
  const uploadFilesList: Array<{ name: string; size: number }> = [];

  /**
   * @description 上传配置数据（计算属性）
   */
  const fileConfigData = computed(() => {
    const headerData = PancakeGlobalConfig.value?.requestHeader || {};
    const fileApi = PancakeGlobalConfig.value?.file_config;
    const apiBaseUrl = PancakeGlobalConfig.value?.baseHost;
    return { headerData, fileApi, apiBaseUrl };
  });

  /**
   * @description 语言包（计算属性）
   */
  const languagePackage = computed(() => {
    return PancakeGlobalConfig.value?.language?.package?.["file"] || {};
  });

  /**
   * @description 请求头（计算属性）
   */
  const requestHeader = computed(() => {
    const data: Record<string, string> = {};
    if (fileConfigData.value.headerData) {
      for (const key in fileConfigData.value.headerData) {
        data[key] = fileConfigData.value.headerData[key];
      }
    }
    return data;
  });

  /**
   * @description 文件选择处理
   * @param event - 变更事件
   */
  function fileChange(event: any): void {
    const files: any = Array.from(event.target.files);
    if (upImageLoading.value) return;
    uploadFilesList.push(...files);
    fetchUpload();
    event.target.value = "";
  }

  /**
   * @description 上传请求（防抖）
   */
  const fetchUpload = debounce(
    () => {
      if (!uploadFilesList.length) return;
      actionRequest(uploadFilesList.map(item => ({ filename: item.name, file: item })));
    },
    300,
    { trailing: true }
  );

  /**
   * @description 上传成功处理
   * @param response - 响应数据
   */
  function handleSuccess(response: { Code: Number; Data: PaFileDataType; Message?: string }): void {
    if (!response) return;
    if (!editorRef.value) return;
    editorRef.value.focus();
    const { Code, Data, Message } = response;
    if (Code == 200) {
      if (Array.isArray(Data)) {
        Data.map(item => {
          const img = document.createElement("img");
          img.src = item.FileUrl;
          img.alt = item?.OriginalName || item?.FileName;
          const div = document.createElement("div");
          div.appendChild(img);
          const selection = typeof window !== "undefined" ? window.getSelection() : null();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(div);
            const newRange = document.createRange();
            newRange.setStartAfter(div);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
          return {
            ...item,
            FileName: item?.OriginalName || item?.FileName,
            FullPath: item.FileUrl
          };
        });
      } else if (Data) {
        const img = document.createElement("img");
        if (Data?.FileUrl) {
          img.src = Data?.FileUrl;
          img.alt = Data?.OriginalName || Data?.FileName || Data?.FileUrl;
        }
        const div = document.createElement("div");
        div.appendChild(img);
        const selection = typeof window !== "undefined" ? window.getSelection() : null();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(div);
          const newRange = document.createRange();
          newRange.setStartAfter(div);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
      fileInput.value.value = null;
      uploadFilesList.length = 0;
      upImageLoading.value = false;
    } else {
      M_Message.danger({ message: Code != 500 && Message ? Message : `${languagePackage.value["upFail"]}` });
      fileInput.value.value = null;
      uploadFilesList.length = 0;
      upImageLoading.value = false;
    }
  }

  /**
   * @description 上传失败处理
   */
  function handleError(): void {
    uploadFilesList.length = 0;
    M_Message.danger({ message: `${languagePackage.value["upFail"]}(02)` });
    upImageLoading.value = false;
  }

  /**
   * @description 执行上传请求
   * @param ajaxFileList - 文件列表
   */
  function actionRequest(ajaxFileList: Array<{ filename: string; file: any }>): void {
    const apiBaseUrl = fileConfigData.value?.apiBaseUrl || "";
    const ajaxOptions = {
      headers: requestHeader.value,
      withCredentials: false,
      data: props.config?.uploadImage?.attachedData || {},
      method: "post",
      action: apiBaseUrl + "/newapi/UploadFile/UploadFiles",
      ajaxFileList: ajaxFileList,
      onProgress: (progressEvent: any) => {
        console.log(progressEvent);
      },
      onError: () => {
        handleError();
      },
      onSuccess: (response: any) => {
        handleSuccess(response);
      }
    };
    ajaxUpload(ajaxOptions);
  }

  return { upImageLoading, fileChange };
}
