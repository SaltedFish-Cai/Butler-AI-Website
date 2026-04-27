<template>
  <div class="upload-container">
    <!-- 基础上传区域 -->
    <slot name="reference">
      <div
        class="upload-area"
        :class="{ 'upload-area-drag': isDragging }"
        @click="handleClick"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="event => handleDrop('drop', event)"
      >
        <!-- 上传图标 -->
        <pa-icon class="upload-icon" name="upload_clound_line" />

        <!-- 上传文本 -->
        <div class="upload-text">
          <div class="upload-title">将文件拖到此处，或 <span class="light-text">点击上传</span></div>
        </div>

        <!-- 文件输入 -->
        <input
          ref="fileInput"
          type="file"
          :multiple="fileMultiple ? fileMultiple > 1 : false"
          :accept="accept"
          class="upload-input"
          @change="event => handleDrop('change', event)"
        />
      </div>
    </slot>

    <div class="tips-box" v-if="!display && (accept || excludeType || fileSingleSize || fileAllSize)">
      <span v-if="accept">
        {{ languagePackage["canUploaded"] }} <span class="light-text">{{ acceptText }}</span> {{ languagePackage["typeFile"] }}
      </span>

      <span v-if="excludeType">
        {{ languagePackage["noCanUploaded"] }} <span class="light-text">{{ excludeText }}</span>
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

    <!-- 文件列表 -->
    <div v-if="uploadFilesList.length > 0" class="file-list">
      <div v-for="(file, index) in uploadFilesList" :key="file.name || index" class="file-item">
        <!-- 文件信息 -->
        <div class="file-info">
          <pa-icon class="file-icon" name="file_upload_line" />

          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatSize(file.size) }}</div>
        </div>

        <!-- 加载图标 -->
        <pa-icon v-if="file.status === 'wait'" class="file-icon loading-icon" name="loading_line" />

        <!-- 删除按钮 -->
        <pa-icon v-else class="file-icon close-icon" name="close_circle_line" @click.stop="handleRemove(index)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PancakeGlobalConfigType } from "../pa-manager/type";
import { computed, ComputedRef, inject, ref, useTemplateRef } from "vue";
import { ComponentProps, FileDataType, ComponentEmits } from "./types";
import { M_Message } from "../feedback";
import { ajaxUpload } from "./ajax";

// Props
const props = withDefaults(defineProps<ComponentProps>(), {});

// Emits
const emits = defineEmits<ComponentEmits>();

// Refs
const fileInput = useTemplateRef("fileInput");
const isDragging = ref(false);

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["file"] || {};
});

const inValue = ref(props.modelValue);
const oldValue = props.modelValue;

const loading = ref(false);
const uploadFilesList = ref<{ name: string; size: number; type: string; status: string; file: any }[]>([]);

const requestHeader = computed(() => {
  const data = {};
  if (fileConfigData.value.headerData) {
    for (const key in fileConfigData.value.headerData) {
      data[key] = fileConfigData.value.headerData[key];
    }
  }
  return data;
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

const acceptText = computed(() => {
  let accept: string | undefined = undefined;
  const { fileIncludeType, fileIncludeText } = props;
  if (fileIncludeType && Array.isArray(fileIncludeType)) accept = (fileIncludeText || fileIncludeType).join(", ");
  return accept?.toLowerCase() || "";
});

// @ computed 不允许类型
const excludeType = computed(() => {
  let exType: string | undefined = undefined;
  const { fileExcludeType } = props;
  if (fileExcludeType && Array.isArray(fileExcludeType)) exType = fileExcludeType.join(",");
  return exType?.toLowerCase() || "";
});

// @ computed 不允许文本
const excludeText = computed(() => {
  let exType: string | undefined = undefined;
  const { fileExcludeType, fileExcludeText } = props;
  if (fileExcludeType && Array.isArray(fileExcludeType)) exType = (fileExcludeText || fileExcludeType).join(",");
  return exType?.toLowerCase() || "";
});

// 格式化文件大小
const formatSize = bytes => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 处理点击上传区域
const handleClick = () => {
  if (isDragging.value) return;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理拖拽释放
const handleDrop = (type: string, event) => {
  isDragging.value = false;
  const files: any[] = Array.from(type === "drop" ? event.dataTransfer.files : event.target.files);
  if (fileMultiple.value && fileMultiple.value == 1) {
    const file = files[0];
    uploadFilesList.value = [{ name: file.name, size: file.size, type: file.type, status: "wait", file }];
    uploadFiles();
    return;
  }
  if (fileMultiple.value && fileMultiple.value > 1 && [...uploadFilesList.value, ...files].length > fileMultiple.value) {
    M_Message.warning({ message: `${languagePackage.value["msg"]}${fileMultiple.value} ` });
    return;
  }

  if (files.length > 0) {
    files.forEach(file => {
      uploadFilesList.value.push({ name: file.name, size: file.size, type: file.type, status: "wait", file });
    });

    uploadFiles();
  }
};

// 处理拖拽进入
const handleDragOver = () => {
  isDragging.value = true;
};

// 处理拖拽离开
const handleDragLeave = () => {
  isDragging.value = false;
};

// @ computed 上传前钩子
const beforeUpload = (fileList: { name: string; size: number; type: string }[]) => {
  loading.value = true;
  if (!fileConfigData.value.fileApi) {
    M_Message.danger({ message: `${languagePackage.value["fail"]}` });
    return false;
  }
  const { fileIncludeText, fileExcludeText } = props;

  for (let i = 0; i < fileList.length; i++) {
    const files = fileList[i];
    //获取最后一个.的位置
    const index = files.name.lastIndexOf(".");
    //获取文件后缀
    const type = files.type;
    const ext = files.name.substring(index + 1).toLowerCase();
    const size = files.size;

    const _excludeType = excludeType.value.split(",");
    if (
      !!excludeType.value &&
      _excludeType &&
      _excludeType.length &&
      _excludeType.indexOf(fileExcludeText ? type : String(ext)) > -1
    ) {
      M_Message.danger({
        message: `${languagePackage.value["noCanUploaded"]}${_excludeType.join(" ")}${languagePackage.value["typeFile"]}`
      });
      return false;
    }

    const _includeType = accept.value.split(",");
    if (!!accept.value && _includeType && _includeType.length && _includeType.indexOf(fileIncludeText ? type : String(ext)) < 0) {
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
};

// 上传文件
const uploadFiles = () => {
  const list = uploadFilesList.value.filter(item => item.status === "wait");
  if (!list.length) return;
  if (!beforeUpload(list)) {
    loading.value = false;
    return;
  } else {
    // fileList.value.push(fileObj);

    actionRequest(uploadFilesList.value);
  }
};

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

// 处理文件删除
const handleRemove = index => {
  uploadFilesList.value.splice(index, 1);
};

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
    loading.value = false;
  } else {
    M_Message.danger({ message: Code != 500 && Message ? Message : `${languagePackage.value["upFail"]}` });
    loading.value = false;
  }
};

function changeEvent(value) {
  const names = value.map(item => item.OriginalName);
  uploadFilesList.value = uploadFilesList.value.map(item => ({
    ...item,
    status: names.includes(item.name) ? "success" : "wait"
  }));
  emits("change", { value, oldValue });
  emits("update:modelValue", value);
}

// @ computed 上传失败
const handleError = () => {
  uploadFilesList.value.length = 0;
  M_Message.danger({ message: `${languagePackage.value["upFail"]}(02)` });
  loading.value = false;
};
</script>

<style scoped lang="scss">
/* 上传容器 */
.upload-container {
  position: relative;
  width: 100%;
}

/* 上传区域 */
.upload-area {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  border: 1px dashed var(--pa-color-border);
  border-radius: var(--pa-size-radius);
  cursor: pointer;
  background-color: var(--pa-color-send-bg);
  transition: border-color 0.3s;
  &:hover {
    border-color: var(--pa-color-primary);
  }
}

.upload-area-drag {
  border-color: #409eff;
  background-color: #f0f9ff;
}

/* 上传图标 */
.upload-icon {
  margin-bottom: 15px;
  font-size: calc(var(--pa-size-font) + 35px);
  color: var(--pa-color-send-font);
}

/* 上传文本 */
.upload-text {
  text-align: center;
}

.tips-box {
  padding-top: var(--pa-size-padding);
  font-size: var(--pa-size-font);
  color: var(--pa-color-font);
}

.light-text {
  color: var(--pa-color-primary);
}

.upload-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

/* 文件输入 */
.upload-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  cursor: pointer;
}

/* 文件列表 */
.file-list {
  display: flex;
  flex-direction: column;

  /* 文件项 */
  .file-item {
    display: flex;
    align-items: center;
    margin-top: var(--pa-size-padding, 10px);
    padding: calc(var(--pa-size-padding, 10px) / 2) var(--pa-size-padding, 10px);
    background-color: var(--pa-color-send-bg);
    border: 1px solid var(--pa-color-border);
    border-radius: var(--pa-size-radius);
    font-size: var(--pa-size-font);

    /* 文件信息 */
    .file-info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
      .file-name {
        flex: 1;
        color: var(--pa-color-font);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-size {
        margin-right: calc(var(--pa-size-padding, 10px) / 2);
        color: var(--pa-color-send-font);
        font-size: calc(var(--pa-size-font) - 2px);
        flex-shrink: 0;
      }
    }

    .file-icon {
      margin-right: calc(var(--pa-size-padding, 10px) / 2);
      transition: var(--pa-animation-time, 0.2s);
      font-size: calc(var(--pa-size-font, 13px) + 2px);
    }

    .close-icon {
      margin-right: 0;
      margin-left: calc(var(--pa-size-padding, 10px) / 2);

      &:hover {
        color: var(--pa-color-danger);
        cursor: pointer;
      }
    }

    .loading-icon {
      margin-right: 0;
      animation: loadings 1s linear infinite;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  }
}

@keyframes loadings {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 预览对话框 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.preview-content {
  background-color: white;
  border-radius: 4px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.preview-title {
  font-size: 16px;
  color: #303133;
}

.preview-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #909399;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-close:hover {
  color: #606266;
}

.preview-body {
  flex: 1;
  padding: 16px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image,
.preview-video,
.preview-audio {
  max-width: 100%;
  max-height: 100%;
}

.preview-unsupported {
  color: #909399;
  font-size: 14px;
}
</style>
