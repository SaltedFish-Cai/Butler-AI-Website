import { computed, ComputedRef, ref, Ref } from "vue";
import { debounce } from "lodash";
import { M_Message } from "../feedback";
import { MFileV2DataType } from "../m-file-v2/type";
import { ajaxUpload } from "../m-file-v2/ajax";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";
import { MEditorV2Type } from "./type";

export const useUpFileHooks = (
  props: MEditorV2Type,
  fileInput: Ref<any>,
  ManagerGlobalConfig: ComputedRef<ManagerGlobalConfigType>,
  editorRef: Ref<any>
) => {
  const upImageLoading = ref(false);
  const uploadFilesList: { name: string; size: number }[] = [];
  const ajaxFileList: Record<string, string>[] = [];

  // @ computed 上传配置
  const fileConfigData = computed(() => {
    const headerData = ManagerGlobalConfig.value?.requestHeader || {};
    const fileApi = ManagerGlobalConfig.value?.file_config;
    const apiBaseUrl = ManagerGlobalConfig.value?.baseHost;
    return { headerData, fileApi, apiBaseUrl };
  });

  // @ computed 语言包
  const languagePackage = computed(() => {
    return ManagerGlobalConfig.value?.language?.package?.["file"] || {};
  });

  const requestHeader = computed(() => {
    const data = {};
    if (fileConfigData.value.headerData) {
      for (const key in fileConfigData.value.headerData) {
        data[key] = fileConfigData.value.headerData[key];
      }
    }
    return data;
  });

  // @ computed 文件选择
  const fileChange = event => {
    const files: any = Array.from(event.target.files);
    if (upImageLoading.value) return;
    uploadFilesList.push(...files);
    fetchUpload();
    // 清空input值，以便可以重复选择同一个文件
    event.target.value = "";
  };

  // @ 接口请求
  const fetchUpload = debounce(
    () => {
      if (!uploadFilesList.length) return;
      actionRequest(uploadFilesList.map(item => ({ filename: item.name, file: item })));
    },
    300,
    { trailing: true }
  );

  // @ 上传成功
  const handleSuccess = (response: { Code: Number; Data: MFileV2DataType; Message?: string }) => {
    if (!response) return;
    // 确保编辑器存在并获得焦点
    if (!editorRef.value) return;
    editorRef.value.focus();

    const { Code, Data, Message } = response;
    if (Code == 200) {
      if (Array.isArray(Data)) {
        Data.map(item => {
          // 创建图片元素
          const img = document.createElement("img");
          img.src = item.FileUrl;
          img.alt = item?.OriginalName || item?.FileName;

          // 创建div元素并将图片放入其中
          const div = document.createElement("div");
          div.appendChild(img);

          // 插入到编辑器中
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(div);

            // 将光标移动到div后面
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
        // 创建图片元素
        const img = document.createElement("img");
        if (Data?.FileUrl) {
          img.src = Data?.FileUrl;
          img.alt = Data?.OriginalName || Data?.FileName || Data?.FileUrl;
        }

        // 创建div元素并将图片放入其中
        const div = document.createElement("div");
        div.appendChild(img);

        // 插入到编辑器中
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(div);

          // 将光标移动到div后面
          const newRange = document.createRange();
          newRange.setStartAfter(div);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
      fileInput.value.value = null;
      uploadFilesList.length = 0;
      ajaxFileList.length = 0;
      upImageLoading.value = false;
    } else {
      M_Message.danger({ message: Code != 500 && Message ? Message : `${languagePackage.value["upFail"]}` });
      fileInput.value.value = null;
      uploadFilesList.length = 0;
      ajaxFileList.length = 0;
      upImageLoading.value = false;
    }
  };

  // @ computed 上传失败
  const handleError = () => {
    uploadFilesList.length = 0;
    ajaxFileList.length = 0;
    M_Message.danger({ message: `${languagePackage.value["upFail"]}(02)` });
    upImageLoading.value = false;
  };

  function actionRequest(ajaxFileList) {
    const apiBaseUrl = fileConfigData.value?.apiBaseUrl || "";

    const ajaxOptions = {
      headers: requestHeader.value,
      withCredentials: false,
      data: props.config.uploadImage?.attachedData || {},
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
};
