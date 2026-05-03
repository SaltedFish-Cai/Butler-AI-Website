<template>
  <div class="pa-file-custom">
    <slot name="reference">
      <div
        class="upload-area"
        :class="{ 'upload-area-drag': isDragging }"
        @click="handleClick"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="(event: DragEvent) => handleDrop('drop', event)"
      >
        <pa-icon class="upload-icon" name="upload_clound_line" />

        <div class="upload-text">
          <div class="upload-title">将文件拖到此处，或 <span class="light-text">点击上传</span></div>
        </div>

        <input
          ref="fileInput"
          type="file"
          :multiple="fileMultiple ? fileMultiple > 1 : false"
          :accept="accept"
          class="upload-input"
          @change="(event: Event) => handleDrop('change', event)"
        />
      </div>
    </slot>

    <div class="tips-box" v-if="!display && (accept || excludeType || fileSingleSize || fileAllSize)">
      <span v-if="accept" class="light-text_box">
        {{ languagePackage["canUploaded"] }}
        <span class="light-text_block" v-for="item in acceptText" :key="item">{{ item }}</span>
        {{ languagePackage["typeFile"] }}
      </span>

      <span v-if="excludeType" class="light-text_box">
        {{ languagePackage["noCanUploaded"] }}
        <span class="light-text_block" v-for="item in excludeText" :key="item">{{ item }}</span>
        {{ languagePackage["typeFile"] }}
      </span>

      <span v-if="fileSingleSize" class="light-text_box">
        {{ languagePackage["singleMax"] }}
        <span class="light-text">{{ fileSingleSize ? (fileSingleSize / 1024).toFixed(2) : 1 }}M</span>
      </span>

      <span v-if="fileAllSize" class="light-text_box">
        {{ languagePackage["singleMaxAll"] }}
        <span class="light-text">{{ fileAllSize ? (fileAllSize / 1024).toFixed(2) : 1 }}M</span>
      </span>
    </div>

    <div v-if="uploadFilesList.length > 0" class="file-list">
      <div v-for="(file, index) in uploadFilesList" :key="file.name || index" class="file-item">
        <div class="file-info">
          <pa-icon class="file-icon" name="file_upload_line" />

          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatSize(file.size) }}</div>
        </div>

        <pa-icon v-if="file.status === 'wait'" class="file-icon loading-icon" name="loading_line" />

        <pa-icon v-else class="file-icon close-icon" name="close_circle_line" @click.stop="handleRemove(index)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 全局配置类型导入
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";

/**
 * 模块导入
 * @description Vue 响应式 API 导入
 */
import { computed, ComputedRef, inject, ref, useTemplateRef } from "vue";

/**
 * 模块导入
 * @description 文件组件类型定义导入
 */
import { ComponentProps, FileDataType, ComponentEmits } from "./types";

/**
 * 模块导入
 * @description 消息提示组件导入
 */
import { M_Message } from "../feedback";

/**
 * 模块导入
 * @description Ajax 上传函数导入
 */
import { ajaxUpload } from "./ajax";

/**
 * 组件属性定义
 * @type ComponentProps
 * @description 定义 PaFileCustom 组件的接收属性
 */
const props = withDefaults(defineProps<ComponentProps>(), {});

/**
 * 组件事件定义
 * @type ComponentEmits
 * @description 定义 PaFileCustom 组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();

/**
 * 文件输入框引用
 * @type Ref<HTMLInputElement | null>
 * @description 引用隐藏的文件输入框元素
 */
const fileInput = useTemplateRef<HTMLInputElement>("fileInput");

/**
 * 拖拽状态标记
 * @type Ref<boolean>
 * @description 标记当前是否处于拖拽文件状态
 */
const isDragging = ref<boolean>(false);

/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 从父组件注入的全局配置信息
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * 语言包计算属性
 * @type ComputedRef<Record<string, string>>
 * @description 根据当前语言设置返回对应的文件模块语言包
 */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["file"] || {};
});

/**
 * 组件内部值
 * @type Ref<Array<FileDataType> | undefined>
 * @description 组件内部维护的文件列表数据
 */
const inValue = ref<Array<FileDataType> | undefined>(props.modelValue);

/**
 * 旧值备份
 * @type Array<FileDataType> | undefined
 * @description 用于记录上一次的绑定值，支持变更事件回传
 */
const oldValue: Array<FileDataType> | undefined = props.modelValue;

/**
 * 上传加载状态
 * @type Ref<boolean>
 * @description 标记当前是否正在上传文件
 */
const loading = ref<boolean>(false);

/**
 * 待上传文件列表项类型
 * @type UploadFileItem
 * @description 定义待上传文件列表中每个文件项的类型结构
 */
interface UploadFileItem {
  name: string;
  size: number;
  type: string;
  status: string;
  file: File;
}

/**
 * 待上传文件列表
 * @type Ref<Array<UploadFileItem>>
 * @description 缓存待上传的文件信息及状态
 */
const uploadFilesList = ref<Array<UploadFileItem>>([]);

/**
 * 请求头配置
 * @type ComputedRef<Record<string, unknown>>
 * @description 返回 HTTP 请求头配置
 */
const requestHeader = computed(() => {
  const data: Record<string, unknown> = {};
  if (fileConfigData.value.headerData) {
    for (const key in fileConfigData.value.headerData) {
      data[key] = fileConfigData.value.headerData[key];
    }
  }
  return data;
});

/**
 * 上传配置数据
 * @type ComputedRef<{ headerData: Record<string, unknown>; fileApi: unknown; apiBaseUrl: string }>
 * @description 从全局配置中提取文件上传相关的配置信息
 */
const fileConfigData = computed(() => {
  const headerData = PancakeGlobalConfig.value?.requestHeader || {};
  const fileApi = PancakeGlobalConfig.value?.file_config;
  const apiBaseUrl = PancakeGlobalConfig.value?.baseHost;
  return { headerData, fileApi, apiBaseUrl };
});

/**
 * 文件上传数量限制
 * @type ComputedRef<number | undefined>
 * @description 返回允许的最大文件上传数量
 */
const fileMultiple = computed(() => {
  let multiple: number | undefined = undefined;
  const { fileMultiple } = props;
  if (fileMultiple) multiple = fileMultiple;
  return multiple;
});

/**
 * 允许的文件类型
 * @type ComputedRef<string>
 * @description 返回允许上传的文件类型（逗号分隔的小写字符串）
 */
const accept = computed(() => {
  let accept: string | undefined = undefined;
  const { fileIncludeType } = props;
  if (fileIncludeType && Array.isArray(fileIncludeType)) accept = fileIncludeType.join(",");
  return accept?.toLowerCase() || "";
});

/**
 * 允许的文件类型文本
 * @type ComputedRef<Array<string>>
 * @description 返回允许上传的文件类型的显示文本
 */
const acceptText = computed(() => {
  let accept: Array<string> | undefined = undefined;
  const { fileIncludeType, fileIncludeText } = props;
  if (fileIncludeType && Array.isArray(fileIncludeType)) accept = fileIncludeText || fileIncludeType;
  return accept || [];
});

/**
 * 排除的文件类型
 * @type ComputedRef<string>
 * @description 返回不允许上传的文件类型（逗号分隔的小写字符串）
 */
const excludeType = computed(() => {
  let exType: string | undefined = undefined;
  const { fileExcludeType } = props;
  if (fileExcludeType && Array.isArray(fileExcludeType)) exType = fileExcludeType.join(",");
  return exType?.toLowerCase() || "";
});

/**
 * 排除的文件类型文本
 * @type ComputedRef<string>
 * @description 返回不允许上传的文件类型的显示文本
 */
const excludeText = computed(() => {
  let exType: Array<string> | undefined = undefined;
  const { fileExcludeType, fileExcludeText } = props;
  if (fileExcludeType && Array.isArray(fileExcludeType)) exType = fileExcludeText || fileExcludeType;
  return exType || [];
});

/**
 * 格式化文件大小
 * @param bytes - 文件大小（字节）
 * @returns string 格式化后的文件大小字符串
 * @description 将字节数转换为人类可读的文件大小格式
 */
const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 处理点击上传区域
 * @description 触发隐藏的文件输入框点击事件
 */
const handleClick = (): void => {
  if (isDragging.value) return;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

/**
 * 处理拖拽或选择文件
 * @param type - 事件类型（'drop' 或 'change'）
 * @param event - 拖拽或变更事件
 * @description 处理文件拖拽放下或文件选择事件，添加文件到上传列表
 */
const handleDrop = (type: string, event: DragEvent | Event): void => {
  isDragging.value = false;
  const files: Array<File> = Array.from(
    type === "drop" ? (event as DragEvent).dataTransfer?.files ?? [] : ((event as Event).target as HTMLInputElement).files ?? []
  );
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
      uploadFilesList.value.push({
        name: file.name,
        size: file.size,
        type: file.type,
        status: "wait",
        file
      });
    });

    uploadFiles();
  }
};

/**
 * 处理拖拽进入
 * @description 设置拖拽状态为进入
 */
const handleDragOver = (): void => {
  isDragging.value = true;
};

/**
 * 处理拖拽离开
 * @description 设置拖拽状态为离开
 */
const handleDragLeave = (): void => {
  isDragging.value = false;
};

/**
 * 上传前校验函数
 * @param fileList - 待校验的文件列表
 * @returns boolean 校验是否通过
 * @description 在上传前进行文件类型、大小、数量等校验
 */
const beforeUpload = (fileList: Array<{ name: string; size: number; type: string }>): boolean => {
  loading.value = true;
  if (!fileConfigData.value.fileApi) {
    M_Message.danger({ message: `${languagePackage.value["fail"]}` });
    return false;
  }
  const { fileIncludeText, fileExcludeText } = props;

  for (let i = 0; i < fileList.length; i++) {
    const files = fileList[i];
    const index = files.name.lastIndexOf(".");
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
      M_Message.danger({
        message: `${languagePackage.value["tip1"]}：${(size / 1024 / 1024).toFixed(2)}M`
      });
      return false;
    }

    const allSize = fileList.reduce((prev, cur) => prev + cur.size, 0);
    if (props.fileAllSize && allSize / 1024 > props.fileAllSize) {
      M_Message.danger({
        message: `${languagePackage.value["tip2"]}：${(allSize / 1024 / 1024).toFixed(2)}M`
      });
      return false;
    }
  }
  return true;
};

/**
 * 执行文件上传
 * @description 筛选待上传文件并发起上传请求
 */
const uploadFiles = (): void => {
  const list = uploadFilesList.value.filter(item => item.status === "wait");
  if (!list.length) return;
  if (!beforeUpload(list)) {
    loading.value = false;
    return;
  } else {
    actionRequest(uploadFilesList.value);
  }
};

/**
 * 发起 Ajax 上传请求
 * @param ajaxFileList - 待上传文件列表
 * @description 构建上传参数并调用 ajaxUpload 执行上传
 */
function actionRequest(ajaxFileList: Array<UploadFileItem>): void {
  const ajaxOptions = {
    headers: requestHeader.value,
    withCredentials: false,
    data: props.attachedData || {},
    method: "post",
    action: fileConfigData.value.fileApi?.url,
    ajaxFileList: ajaxFileList.map(item => ({ filename: item.name, file: item.file })),
    onProgress: (progressEvent: ProgressEvent) => {
      console.log(progressEvent);
    },
    onError: () => {
      handleError();
    },
    onSuccess: (response: string | { Code: number; Data: Array<FileDataType> | FileDataType; Message?: string }) => {
      handleSuccess(response);
    }
  };
  ajaxUpload(ajaxOptions);
}

/**
 * 删除指定文件
 * @param index - 要删除的文件索引
 * @description 从上传列表中移除指定位置的文件
 */
const handleRemove = (index: number): void => {
  uploadFilesList.value.splice(index, 1);
};

/**
 * 上传成功处理函数
 * @param response - 服务器响应数据
 * @description 处理文件上传成功后的响应，更新组件内部值
 */
const handleSuccess = (response: string | { Code: number; Data: Array<FileDataType> | FileDataType; Message?: string }): void => {
  if (!response) return;
  if (typeof response === "string") return;
  const { Code, Data, Message } = response;
  if (Code == 200) {
    if (!inValue.value) {
      inValue.value = [];
    }
    if (Array.isArray(Data)) {
      const _Data = Data.map((item: FileDataType) => {
        return {
          ...item,
          FileName: item?.OriginalName || item?.FileName,
          FullPath: (fileConfigData.value.apiBaseUrl || "") + item.FileUrl
        };
      });
      inValue.value.push(..._Data);
    } else {
      inValue.value.push({
        ...Data,
        FileName: Data?.OriginalName || Data?.FileName,
        FullPath: (fileConfigData.value.apiBaseUrl || "") + Data.FileUrl
      });
    }

    changeEvent(inValue.value);
    loading.value = false;
  } else {
    M_Message.danger({
      message: Code != 500 && Message ? Message : `${languagePackage.value["upFail"]}`
    });
    loading.value = false;
  }
};

/**
 * 触发值变更事件
 * @param value - 新的绑定值
 * @description 更新文件上传列表状态，并触发 change 和 update:modelValue 事件
 */
function changeEvent(value: Array<FileDataType> | undefined): void {
  const names = value?.map(item => item.OriginalName);
  uploadFilesList.value = uploadFilesList.value.map(item => ({
    ...item,
    status: names?.includes(item.name) ? "success" : "wait"
  }));
  emits("change", { value: value ?? [], oldValue: oldValue ?? [] });
  emits("update:modelValue", value ?? []);
}

/**
 * 上传失败处理函数
 * @description 处理文件上传失败的情况，清空文件列表并显示错误信息
 */
const handleError = (): void => {
  uploadFilesList.value.length = 0;
  M_Message.danger({ message: `${languagePackage.value["upFail"]}(02)` });
  loading.value = false;
};
</script>

<style lang="scss">
@use "./index.scss";
</style>
