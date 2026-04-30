<template>
  <div class="pa-file" :class="[props.class, { 'is-disabled': props.disabled }]" :style="{ ...props.style }">
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
      <span v-if="accept" class="light-text_box">
        {{ languagePackage["canUploaded"] }} <span class="light-text_block">{{ accept }}</span
        >{{ languagePackage["typeFile"] }}
      </span>

      <span v-if="excludeType" class="light-text_box">
        {{ languagePackage["noCanUploaded"] }} <span class="light-text_block">{{ excludeType }}</span>
        {{ languagePackage["typeFile"] }}
      </span>

      <span v-if="fileSingleSize" class="light-text_box">
        {{ languagePackage["singleMax"] }}
        <span class="light-text_block">{{ fileSingleSize ? (fileSingleSize / 1024).toFixed(2) : 1 }}M</span>
      </span>

      <span v-if="fileAllSize" class="light-text_box">
        {{ languagePackage["singleMaxAll"] }}
        <span class="light-text_block">{{ fileAllSize ? (fileAllSize / 1024).toFixed(2) : 1 }}M</span>
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
        </template>
      </template>
      <div v-else>--</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description Vue 响应式 API 导入
 * */
import { ref, computed, ComputedRef, watch, inject } from "vue";

/**
 * **模块导入**
 * @description 文件组件类型定义导入
 * */
import { ComponentProps, FileDataType, ComponentEmits } from "./types";

/**
 * **模块导入**
 * @description Ajax 上传函数导入
 * */
import { ajaxUpload } from "./ajax";

/**
 * **模块导入**
 * @description 消息提示和对话框组件导入
 * */
import { M_Message, M_MessageBox } from "../feedback";

/**
 * **模块导入**
 * @description 全局配置类型导入
 * */
import { PancakeGlobalConfigType } from "../pa-manager/types";

/**
 * **模块导入**
 * @description lodash 工具库导入
 * */
import _ from "lodash";

/**
 * **模块导入**
 * @description 从 lodash 中解构常用工具函数
 * */
const { isEqual, debounce, isNil } = _;

/**
 * **组件属性定义**
 * @type `ComponentProps`
 * @description 定义 PaFile 组件的接收属性
 * */
const props = withDefaults(defineProps<ComponentProps>(), {});

/**
 * **组件内部值**
 * @type `Ref<Array<FileDataType> | undefined>`
 * @description 组件内部维护的文件列表数据
 * */
const inValue = ref<Array<FileDataType> | undefined>(props.modelValue);

/**
 * **旧值备份**
 * @type `Array<FileDataType> | undefined`
 * @description 用于记录上一次的绑定值，支持变更事件回传
 * */
let oldValue: Array<FileDataType> | undefined = props.modelValue;

/**
 * **组件事件定义**
 * @type `ComponentEmits`
 * @description 定义 PaFile 组件可触发的事件
 * */
const emits = defineEmits<ComponentEmits>();

/**
 * **上传组件引用**
 * @type `Ref<unknown>`
 * @description 引用子组件 PaUpload
 * */
const uploadRef = ref<unknown>();

/**
 * **上传加载状态**
 * @type `Ref<boolean>`
 * @description 标记当前是否正在上传文件
 * */
const loading = ref<boolean>(false);

/**
 * **待上传文件列表**
 * @type `Array<{ name: string; size: number }>`
 * @description 缓存待上传的文件信息
 * */
const uploadFilesList: Array<File> = [];

/**
 * **Ajax 请求文件列表**
 * @type `Array<Record<string, string>>`
 * @description 缓存用于 Ajax 请求的文件数据
 * */
const ajaxFileList: Array<Record<string, string>> = [];

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置信息
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **语言包计算属性**
 * @type `ComputedRef<Record<string, string>>`
 * @description 根据当前语言设置返回对应的文件模块语言包
 * */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["file"] || {};
});

/**
 * **计算占位符文本**
 * @type `ComputedRef<string>`
 * @description 根据语言和属性设置返回上传按钮的占位符文本
 * */
const computedPlaceholder: ComputedRef<string> = computed(() => {
  const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`uploadText`]
    : props.placeholder || languagePackage.value[`uploadText`];
});

/**
 * **上传配置数据**
 * @type `ComputedRef<{ headerData: Record<string, unknown>; fileApi: unknown; apiBaseUrl: string }>`
 * @description 从全局配置中提取文件上传相关的配置信息
 */
const fileConfigData = computed(() => {
  const headerData = PancakeGlobalConfig.value?.requestHeader || {};
  const fileApi = PancakeGlobalConfig.value?.file_config;
  const apiBaseUrl = PancakeGlobalConfig.value?.baseHost;
  return { headerData, fileApi, apiBaseUrl };
});

/**
 * **文件上传数量限制**
 * @type `ComputedRef<number | undefined>`
 * @description 返回允许的最大文件上传数量
 */
const fileMultiple = computed(() => {
  let multiple: number | undefined = undefined;
  const { fileMultiple } = props;
  if (fileMultiple) multiple = fileMultiple;
  return multiple;
});

/**
 * **允许的文件类型**
 * @type `ComputedRef<string>`
 * @description 返回允许上传的文件类型（逗号分隔的小写字符串）
 */
const accept = computed(() => {
  let accept: string | undefined = undefined;
  const { fileIncludeType } = props;
  if (fileIncludeType && Array.isArray(fileIncludeType)) accept = fileIncludeType.join(",");
  return accept?.toLowerCase() || "";
});

/**
 * **排除的文件类型**
 * @type `ComputedRef<string>`
 * @description 返回不允许上传的文件类型（逗号分隔的小写字符串）
 */
const excludeType = computed(() => {
  let exType: string | undefined = undefined;
  const { fileExcludeType } = props;
  if (fileExcludeType && Array.isArray(fileExcludeType)) exType = fileExcludeType.join(",");
  return exType?.toLowerCase() || "";
});

/**
 * **触发值变更事件**
 * @param `value` `Array<FileDataType> | undefined` 新的绑定值
 * @description 更新 modelValue 并触发 change 事件
 * */
function changeEvent(value: Array<FileDataType> | undefined): void {
  emits("change", { value: value ?? [], oldValue: oldValue ?? [] });
  emits("update:modelValue", value ?? []);
}

/**
 * **请求头配置**
 * @type `ComputedRef<Record<string, unknown>>`
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
 * **上传成功处理函数**
 * @param `response` `{ Code: Number; Data: FileDataType | Array<FileDataType>; Message?: string }` 服务器响应数据
 * @description 处理文件上传成功后的响应，更新组件内部值
 * */
const handleSuccess = (response: string | { Code: Number; Data: Array<FileDataType> | FileDataType; Message?: string }): void => {
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
    uploadFilesList.length = 0;
    ajaxFileList.length = 0;
    (uploadRef?.value as { clearFiles?: () => void })?.clearFiles?.();
    loading.value = false;
  } else {
    M_Message.danger({ message: Code != 500 && Message ? Message : `${languagePackage.value["upFail"]}` });
    uploadFilesList.length = 0;
    ajaxFileList.length = 0;
    (uploadRef?.value as { clearFiles?: () => void })?.clearFiles?.();
    loading.value = false;
  }
};

/**
 * **上传失败处理函数**
 * @description 处理文件上传失败的情况，清空文件列表并显示错误信息
 * */
const handleError = (): void => {
  uploadFilesList.length = 0;
  ajaxFileList.length = 0;
  (uploadRef?.value as { clearFiles?: () => void })?.clearFiles?.();
  M_Message.danger({ message: `${languagePackage.value["upFail"]}(02)` });
  loading.value = false;
};

/**
 * **文件选择处理函数**
 * @param `event` `Event` 文件选择事件对象
 * @description 处理文件 input 的 change 事件，提取选中文件并触发上传
 * */
const handleFileChange = (event: Event): void => {
  const files: Array<File> = Array.from((event.target as HTMLInputElement).files ?? []);
  if (loading.value) return;
  uploadFilesList.push(...files);
  fetchUpload();
  (event.target as HTMLInputElement).value = "";
};

/**
 * **上传前校验函数**
 * @param `fileList` `Array<{ name: string; size: number }>` 待校验的文件列表
 * @returns `boolean` 校验是否通过
 * @description 在上传前进行文件类型、大小、数量等校验
 * */
const beforeUpload = (fileList: Array<{ name: string; size: number }>): boolean => {
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

      const index = files.name.lastIndexOf(".");
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

/**
 * **触发上传请求**
 * @description 使用防抖封装上传逻辑，避免频繁触发请求
 * */
const fetchUpload = debounce(
  (): void => {
    if (!uploadFilesList.length) return;
    if (!beforeUpload(uploadFilesList)) {
      uploadFilesList.length = 0;
      ajaxFileList.length = 0;
      (uploadRef?.value as { clearFiles?: () => void })?.clearFiles?.();
      loading.value = false;
      return;
    } else {
      actionRequest(uploadFilesList.map(item => ({ filename: item.name, file: item })));
    }
  },
  300,
  { trailing: true }
);

/**
 * **发起 Ajax 上传请求**
 * @param `ajaxFileList` `Array<{ filename: string; file: File }>` 待上传文件列表
 * @description 构建上传参数并调用 ajaxUpload 执行上传
 * */
function actionRequest(ajaxFileList: Array<{ filename: string; file: File }>): void {
  const ajaxOptions = {
    headers: requestHeader.value,
    withCredentials: false,
    data: props.attachedData || {},
    method: "post",
    action: fileConfigData.value.fileApi?.url,
    ajaxFileList: ajaxFileList,
    onProgress: () => {
      // Progress callback
    },
    onError: () => {
      handleError();
    },
    onSuccess: (response: string | { Code: Number; Data: Array<FileDataType> | FileDataType; Message?: string }) => {
      handleSuccess(response);
    }
  };

  ajaxUpload(ajaxOptions);
}

/**
 * **清空所有文件**
 * @description 弹出确认框，用户确认后清空已上传的文件列表
 * */
const cleanFiles = (): void => {
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

/**
 * **删除指定文件**
 * @param `index` `number` 要删除的文件索引
 * @description 从文件列表中移除指定位置的文件并触发变更事件
 * */
const removeFile = (index: number): void => {
  inValue.value?.splice(index, 1);
  changeEvent(inValue.value);
};

/**
 * **比较数据是否相等**
 * @param `data` `Array<FileDataType> | undefined` 当前数据
 * @param `contrastData` `Array<FileDataType> | undefined` 对比数据
 * @returns `boolean` 数据是否不相等
 * @description 根据配置的对比键比较两个文件数组是否包含相同的文件
 * */
function eq(data: Array<FileDataType> | undefined, contrastData: Array<FileDataType> | undefined): boolean {
  if (!contrastData || !Array.isArray(contrastData)) return false;

  const _contrastData = contrastData.filter(value => value !== null && typeof value !== "undefined");

  if (_contrastData && _contrastData.length == 0) {
    return true;
  }

  const compareKey = PancakeGlobalConfig.value?.file_config?.compareKey || "FileId";

  return !isEqual(
    data?.map?.(item => item[compareKey])?.sort((a, b) => +String(a).replace(/\D/g, "") - +String(b).replace(/\D/g, "")),
    _contrastData?.map?.(item => item[compareKey])?.sort((a, b) => +String(a).replace(/\D/g, "") - +String(b).replace(/\D/g, ""))
  );
}

/**
 * **监听 modelValue 变化**
 * @param `data` `Array<FileDataType> | undefined` 新的绑定值
 * @description 当外部传入的 modelValue 变化时，同步更新内部值
 */
watch(
  () => props.modelValue,
  (data: Array<FileDataType> | undefined) => {
    inValue.value = !isNil(data) ? data : [];
    oldValue = !isNil(data) ? data : [];
  },
  { immediate: true, deep: true }
);

/**
 * **监听 loading 状态变化**
 * @param `data` `boolean` 加载状态
 * @description 当 loading 状态变化时，向上层组件通知当前工作状态
 */
watch(
  () => loading.value,
  (data: boolean) => {
    emits("changeState", data ? "Working" : "Pending");
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
