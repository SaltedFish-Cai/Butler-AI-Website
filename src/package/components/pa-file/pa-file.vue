<template>
  <div class="pa-file" :class="[props.class, { 'is-disabled': props.disabled }]" :style="{ ...props.style }">
    <!-- <template v-if="fileConfigData.fileApi?.url">    </template> -->
    <div class="flex-center-start" v-if="!display" style="flex-wrap: wrap">
      <div class="flex-center-start" style="width: 1px; flex: 1">
        <slot name="reference-before"></slot>
        <pa-button-group>
          <pa-button
            :title="languagePackage['uploadText']"
            class="pa-file_upload-btn"
            position="left"
            is="upload"
            :loading="loading"
            :disabled="disabled || (fileMultiple ? fileMultiple == inValue?.length : false)"
          >
            <div class="flex-center">
              <div style="word-wrap: break-word">{{ computedPlaceholder }}</div>
              <div class="ml-size" v-if="fileMultiple && fileMultiple > 1">
                (<span class="light-text"> {{ inValue?.length || 0 }}</span
                >/{{ fileMultiple }})
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              :multiple="fileMultiple ? fileMultiple > 1 : false"
              :accept="accept"
              class="pa-file_upload-btn_inner"
              :disabled="disabled || (fileMultiple ? fileMultiple == inValue?.length : false)"
              @change="handleFileChange"
            />
          </pa-button>

          <pa-button v-if="downloadTemplate" is="download" :disabled="disabled" @click="downloadTemplate">
            {{ languagePackage["downloadTemplate"] }}
          </pa-button>
        </pa-button-group>
      </div>

      <pa-button
        v-if="inValue?.length && !display"
        :title="languagePackage['clearAddedfiles']"
        style="--pa-size-font: 12px; --pa-size-height: 24px"
        class="btn-width ml-size"
        is="trash"
        :disabled="disabled"
        @click="cleanFiles"
      >
        {{ languagePackage["clean"] }}
      </pa-button>
    </div>
    <div v-if="$slots['downloadTemplate'] && !disabled" class="flex-center-start">
      <slot name="downloadTemplate"></slot>
    </div>

    <div class="tips-box" v-if="!display && (accept || excludeType || fileSingleSize || fileAllSize)">
      <span v-if="accept">
        {{ languagePackage["canUploaded"] }} <span class="light-text">{{ accept }}</span> {{ languagePackage["typeFile"] }}
      </span>

      <span v-if="excludeType">
        {{ languagePackage["noCanUploaded"] }} <span class="light-text">{{ excludeType }}</span>
        {{ languagePackage["typeFile"] }}
      </span>

      <!-- <span v-if="fileMultiple && fileMultiple > 1">
        {{ languagePackage["uploadMost"] }} <span class="light-text">{{ fileMultiple }}{{ languagePackage["piece"] }}</span>
        {{ languagePackage["file"] }}
      </span> -->

      <span v-if="fileSingleSize">
        {{ languagePackage["singleMax"] }}
        <span class="light-text">{{ fileSingleSize ? (fileSingleSize / 1024).toFixed(2) : 1 }}M</span>
      </span>

      <span v-if="fileAllSize">
        {{ languagePackage["singleMaxAll"] }}
        <span class="light-text">{{ fileAllSize ? (fileAllSize / 1024).toFixed(2) : 1 }}M</span>
      </span>
    </div>

    <div class="file-item-box">
      <template v-if="inValue?.length">
        <template v-for="(file, index) in inValue" :key="file.FileId">
          <pa-media-view-item v-if="file.FileUrl" :filePath="file.FileUrl" :file="file">
            <div>{{ file?.OriginalName || file?.FileName }}</div>
            <pa-icon
              v-if="!display && !disabled"
              :title="languagePackage['del']"
              class="file-item-box__del-hand ml-size"
              name="close_circle_line"
              @click="removeFile(index)"
            />
          </pa-media-view-item>
        </template>
      </template>
      <!-- class="m-display_style"
        :class="[size == 'small' ? 'm-display_style_small' : '', size == 'large' ? 'm-display_style_large' : '']" -->
      <div v-else-if="!inValue?.length && display" class="tips-box">{{ languagePackage["noFile"] }}</div>
    </div>

    <div
      class="file-item-box"
      :class="['pa-contrast-style']"
      v-if="(alwaysContrast && contrastData?.length) || (contrastData?.length && eq(inValue, contrastData))"
    >
      <template v-if="contrastData.length">
        <template v-for="file in contrastData" :key="file.FileId">
          <pa-media-view-item v-if="file.FileUrl" :filePath="file.FileUrl" :file="file">
            <div>{{ file?.OriginalName || file?.FileName }}</div>
          </pa-media-view-item>
          <!-- <div class="flex-center mb3 file-item">
          <div class="flex-center download-file" :class="[size == 'small' ? 'download-file_small' : '']">
          </div>
        </div> -->
        </template>
      </template>
      <div v-else>--</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef, watch, inject } from "vue";
import { ComponentProps, FileDataType } from "./type";
import { ajaxUpload } from "./ajax";
import { M_Message, M_MessageBox } from "../feedback";
import { PancakeGlobalConfigType } from "../pa-manager/type";
// import { useDownload } from "../m-media-view/use-download";
import _ from "lodash";
const { isEqual, debounce, isNil } = _;

const props = withDefaults(defineProps<ComponentProps>(), {});

const inValue = ref(props.modelValue);
let oldValue = props.modelValue;

const emits = defineEmits(["update:modelValue", "change", "changeState"]);

const uploadRef = ref();
const loading = ref(false);
const uploadFilesList: { name: string; size: number }[] = [];
const ajaxFileList: Record<string, string>[] = [];

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["file"] || {};
});

const computedPlaceholder: ComputedRef<string> = computed(() => {
  const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`uploadText`]
    : props.placeholder || languagePackage.value[`uploadText`];
});

// @ computed 上传配置
const fileConfigData = computed(() => {
  const headerData = PancakeGlobalConfig.value?.requestHeader || {};
  const fileApi = PancakeGlobalConfig.value?.file_config;
  const apiBaseUrl = PancakeGlobalConfig.value?.baseHost;
  return { headerData, fileApi, apiBaseUrl };
});

// @ computed 文件数量
const fileMultiple = computed(() => {
  let multiple: number | undefined = undefined;
  const { fileMultiple } = props;
  if (fileMultiple) multiple = fileMultiple;
  return multiple;
});

// @ computed 允许类型
const accept = computed(() => {
  let accept: string | undefined = undefined;
  const { fileIncludeType } = props;
  if (fileIncludeType && Array.isArray(fileIncludeType)) accept = fileIncludeType.join(",");
  return accept?.toLowerCase() || "";
});

// @ computed 不允许类型
const excludeType = computed(() => {
  let exType: string | undefined = undefined;
  const { fileExcludeType } = props;
  if (fileExcludeType && Array.isArray(fileExcludeType)) exType = fileExcludeType.join(",");
  return exType?.toLowerCase() || "";
});

function changeEvent(value) {
  emits("change", { value, oldValue });
  emits("update:modelValue", value);
}

const requestHeader = computed(() => {
  const data = {};
  if (fileConfigData.value.headerData) {
    for (const key in fileConfigData.value.headerData) {
      data[key] = fileConfigData.value.headerData[key];
    }
  }
  return data;
});

// @ computed 上传成功
const handleSuccess = (response: { Code: Number; Data: FileDataType; Message?: string }) => {
  if (!response) return;

  const { Code, Data, Message } = response;
  if (Code == 200) {
    if (!inValue.value) {
      inValue.value = [];
    }
    if (Array.isArray(Data)) {
      const _Data = Data.map(item => {
        return {
          ...item,
          FileName: item?.OriginalName || item?.FileName,
          FullPath: fileConfigData.value.apiBaseUrl + item.FileUrl
        };
      });
      inValue.value.push(..._Data);
    } else {
      inValue.value.push({
        ...Data,
        FileName: Data?.OriginalName || Data?.FileName,
        FullPath: fileConfigData.value.apiBaseUrl || "" + Data.FileUrl
      });
    }

    changeEvent(inValue.value);
    uploadFilesList.length = 0;
    ajaxFileList.length = 0;
    uploadRef?.value?.clearFiles();
    loading.value = false;
  } else {
    M_Message.danger({ message: Code != 500 && Message ? Message : `${languagePackage.value["upFail"]}` });
    uploadFilesList.length = 0;
    ajaxFileList.length = 0;
    uploadRef?.value?.clearFiles();
    loading.value = false;
  }
};

// @ computed 上传失败
const handleError = () => {
  uploadFilesList.length = 0;
  ajaxFileList.length = 0;
  uploadRef?.value?.clearFiles();
  M_Message.danger({ message: `${languagePackage.value["upFail"]}(02)` });
  loading.value = false;
};

// @ computed 文件选择
const handleFileChange = event => {
  const files: any = Array.from(event.target.files);
  if (loading.value) return;
  uploadFilesList.push(...files);
  fetchUpload();
  // 清空input值，以便可以重复选择同一个文件
  event.target.value = "";
};

// @ computed 上传前钩子
const beforeUpload = (fileList: { name: string; size: number }[]) => {
  loading.value = true;
  if (!fileConfigData.value.fileApi) {
    M_Message.danger({ message: `${languagePackage.value["fail"]}` });
    return false;
  }
  const defaultData = inValue.value || [];
  if (fileMultiple.value && fileMultiple.value > 1 && [...fileList, ...defaultData].length > fileMultiple.value) {
    M_Message.warning({ message: `${languagePackage.value["msg"]}${fileMultiple.value}个` });
    return false;
  } else {
    for (let i = 0; i < fileList.length; i++) {
      const files = fileList[i];

      //获取最后一个.的位置
      const index = files.name.lastIndexOf(".");
      //获取文件后缀
      const ext = files.name.substring(index + 1).toLowerCase();
      const size = files.size;

      const _excludeType = excludeType.value.split(",");
      if (!!excludeType.value && _excludeType && _excludeType.length && _excludeType.indexOf(String(ext)) > -1) {
        M_Message.danger({
          message: `${languagePackage.value["noCanUploaded"]}${_excludeType.join(" ")}${languagePackage.value["typeFile"]}`
        });
        return false;
      }

      const _includeType = accept.value.split(",");
      if (!!accept.value && _includeType && _includeType.length && _includeType.indexOf(String(ext)) < 0) {
        M_Message.danger({
          message: `${languagePackage.value["canUploaded"]}${_includeType.join(" ")}${languagePackage.value["typeFile"]}`
        });
        return false;
      }

      if (props.fileSingleSize && size / 1024 > props.fileSingleSize) {
        M_Message.danger({ message: `${languagePackage.value["tip1"]}：${(size / 1024 / 1024).toFixed(2)}M` });
        return false;
      }

      const allSize = fileList.reduce((prev, cur) => prev + cur.size, 0);
      if (props.fileAllSize && allSize / 1024 > props.fileAllSize) {
        M_Message.danger({ message: `${languagePackage.value["tip2"]}：${(allSize / 1024 / 1024).toFixed(2)}M` });
        return false;
      }
    }
    return true;
  }
};

// @ computed 接口请求
const fetchUpload = debounce(
  () => {
    if (!uploadFilesList.length) return;
    if (!beforeUpload(uploadFilesList)) {
      uploadFilesList.length = 0;
      ajaxFileList.length = 0;
      uploadRef?.value?.clearFiles();
      loading.value = false;
      return;
    } else {
      actionRequest(uploadFilesList.map(item => ({ filename: item.name, file: item })));
    }
  },
  300,
  { trailing: true }
);

function actionRequest(ajaxFileList) {
  const ajaxOptions = {
    headers: requestHeader.value,
    withCredentials: false,
    data: props.attachedData || {},
    method: "post",
    action: fileConfigData.value.fileApi?.url,
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

const cleanFiles = () => {
  M_MessageBox.confirm({
    title: languagePackage.value["tip"],
    message: `${languagePackage.value["isDel"]}`,
    type: "warning",
    confirmButtonText: languagePackage.value["enterDel"],
    onConfirm: () => {
      if (inValue.value) inValue.value.length = 0;
    }
  });
};

// @ computed 删除文件
const removeFile = (index: number) => {
  inValue.value?.splice(index, 1);
  changeEvent(inValue.value);
};

// function openFile(file: FileDataType) {
//   if (file.FileUrl) {
//     useDownload(file.FileUrl, file?.OriginalName || file?.FileName);
//   }
// }

function eq(data, contrastData) {
  if (!contrastData || !Array.isArray(contrastData)) return false;

  const _contrastData = contrastData.filter(value => value !== null && typeof value !== "undefined");

  if (_contrastData && _contrastData.length == 0) {
    return true;
  }

  const compareKey = PancakeGlobalConfig.value?.file_config?.compareKey || "FileId";

  return !isEqual(
    data?.map?.(item => item[compareKey])?.sort((a, b) => a.replace(/\D/g, "") - b.replace(/\D/g, "")),
    _contrastData?.map?.(item => item[compareKey])?.sort((a, b) => a.replace(/\D/g, "") - b.replace(/\D/g, ""))
  );
}

// #Watch modelValue
watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data : [];
    oldValue = !isNil(data) ? data : [];
  },
  { immediate: true, deep: true }
);

watch(
  () => loading.value,
  data => {
    emits("changeState", data ? "Working" : "Pending");
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
