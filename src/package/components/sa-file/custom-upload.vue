<template>
  <div class="upload-container">
    <!-- 基础上传区域 -->
    <slot name="reference">
      <div
        class="upload-area"
        :class="{ 'upload-area-drag': drag }"
        @click="handleClick"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- 上传图标 -->
        <div class="upload-icon">
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path d="M469.333333 682.666667l-128 128-96-96 224-224 224 224-96 96z" fill="currentColor" />
            <path
              d="M426.666667 384h170.666666c8.362667 0 16-7.637333 16-16V213.333333c0-8.362667-7.637333-16-16-16H426.666667c-8.362667 0-16 7.637333-16 16v154.666667c0 8.362667 7.637333 16 16 16z"
              fill="currentColor"
            />
            <path
              d="M725.333333 810.666667H298.666667c-47.317333 0-85.333333-38.016-85.333333-85.333334V330.666667c0-47.317333 38.016-85.333333 85.333333-85.333333h426.666666c47.317333 0 85.333333 38.016 85.333333 85.333333v394.666667c0 47.317334-38.016 85.333334-85.333333 85.333334zM298.666667 298.666667c-23.552 0-42.666667 19.114667-42.666667 42.666667v394.666667c0 23.552 19.114667 42.666666 42.666667 42.666666h426.666666c23.552 0 42.666667-19.114666 42.666667-42.666666V341.333334c0-23.552-19.114667-42.666667-42.666667-42.666667H298.666667z"
              fill="currentColor"
            />
          </svg>
        </div>

        <!-- 上传文本 -->
        <div class="upload-text">
          <div class="upload-title">{{ dragText || "点击上传" }}</div>
          <div v-if="showTip" class="upload-tip">{{ tipText || "支持单个或批量上传" }}</div>
          <div v-if="fileSizeLimit" class="upload-tip">{{ `文件大小不超过${formatSize(fileSizeLimit)}` }}</div>
          <div v-if="fileTypeLimit" class="upload-tip">{{ `支持格式：${fileTypeLimit.join("、")}` }}</div>
        </div>

        <!-- 文件输入 -->
        <input
          ref="fileInput"
          type="file"
          :multiple="multiple"
          :accept="fileTypeLimit ? fileTypeLimit.join(',') : '*'"
          class="upload-input"
          @change="handleFileChange"
        />
      </div>
    </slot>

    <!-- 文件列表 -->
    <div v-if="showFileList && fileList.length > 0" class="file-list">
      <div v-for="(file, index) in fileList" :key="file.uid || index" class="file-item">
        <!-- 文件信息 -->
        <div class="file-info">
          <div class="file-icon">
            <svg v-if="isImage(file)" viewBox="0 0 1024 1024" width="16" height="16">
              <path
                d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32z m-40 656H184V460h656v380zM184 392V256h176v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h176v136H184z"
                fill="currentColor"
              />
            </svg>
            <svg v-else-if="isVideo(file)" viewBox="0 0 1024 1024" width="16" height="16">
              <path
                d="M912 309.9L648.3 47.8c-6-6-14.2-9.4-22.7-9.4H152c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h656c17.7 0 32-14.3 32-32V360.9c0-17.7-14.3-32-32-32zM500.7 537.5L329.6 444.9c-10.7-6.3-23.5-5.3-33.5 2.8L152 545.3V176h531.8l-192.6 184.1c-12.2 11.6-31.3 11.6-43.5 0zM784 808H240c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h544c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8z"
                fill="currentColor"
              />
            </svg>
            <svg v-else-if="isAudio(file)" viewBox="0 0 1024 1024" width="16" height="16">
              <path
                d="M812.7 400.2h-56.8c-4.4 0-8 3.6-8 8v207.6c0 4.4 3.6 8 8 8h56.8c4.4 0 8-3.6 8-8V408.2c0-4.4-3.6-8-8-8zm-165.2 0h-56.9c-4.4 0-8 3.6-8 8v207.6c0 4.4 3.6 8 8 8h56.9c4.4 0 8-3.6 8-8V408.2c0-4.4-3.6-8-8-8zm-165 0h-57c-4.4 0-8 3.6-8 8v207.6c0 4.4 3.6 8 8 8h57c4.4 0 8-3.6 8-8V408.2c0-4.4-3.6-8-8-8zm-165.1 0H253c-4.4 0-8 3.6-8 8v207.6c0 4.4 3.6 8 8 8h56.8c4.4 0 8-3.6 8-8V408.2c0-4.4-3.6-8-8-8zm-123.5 59.5c0-42.4 25.6-80 65.2-96.4v192.8c-39.6-16.5-65.2-54-65.2-96.4zM952 480c0 141.1-114.9 256-256 256S440 621.1 440 480 554.9 224 704 224s256 114.9 256 256zm-48 0c0-110.5-89.5-200-208-200s-208 89.5-208 200 89.5 200 208 200 208-89.5 208-200z"
                fill="currentColor"
              />
            </svg>
            <svg v-else-if="isPdf(file)" viewBox="0 0 1024 1024" width="16" height="16">
              <path
                d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-40 824H232V136h560v752z"
                fill="currentColor"
              />
            </svg>
            <svg v-else viewBox="0 0 1024 1024" width="16" height="16">
              <path
                d="M896 480H128V192h768v288zm0 448H128V640h768v288zM896 128c17.7 0 32-14.3 32-32s-14.3-32-32-32H128C110.3 64 96 78.3 96 96v832c0 17.7 14.3 32 32 32h768c17.7 0 32-14.3 32-32V128z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatSize(file.size) }}</div>
        </div>

        <!-- 上传状态 -->
        <div v-if="file.status === 'uploading'" class="file-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: file.percentage + '%' }"></div>
          </div>
          <span class="progress-text">{{ file.percentage }}%</span>
        </div>

        <!-- 预览按钮 -->
        <button
          v-if="file.status === 'success' && canPreview(file)"
          class="file-action file-preview"
          @click.stop="handlePreview(file)"
          title="预览"
        >
          <svg viewBox="0 0 1024 1024" width="14" height="14">
            <path
              d="M942.1 518.3C937 515.4 838.8 480 713.8 480c-98.7 0-189 39.1-252.9 102.4-13.5 13.5-25.7 27.6-36.4 42.1l-28.3-28.3c-16.9-16.9-44.1-16.9-61 0l-85.4 85.5c-16.9 16.9-16.9 44.1 0 61l28.3 28.3c16.9 16.9 44.1 16.9 61 0l85.4-85.5c16.9-16.9 16.9-44.1 0-61l-10.7-10.7c11.3-16.3 23.1-32.8 35-49.5C419.1 645.9 464 601 518.3 576c161.3-68 416.1-91.4 424 92.3 1 1.8 1.7 3.5 1.7 5.3v3.1c0 1.8-.7 3.5-1.9 5.3-1.2 1.9-4.4 5.1-9.1 8.9C943.8 703.2 944 703 944 702.8V527.4c0-2.7-.7-5.3-2-7.6l-1.9-2.5zM672 400c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm-600 544h416v-32H72v32z"
              fill="currentColor"
            />
          </svg>
        </button>

        <!-- 删除按钮 -->
        <button class="file-action file-delete" @click.stop="handleRemove(file, index)" title="删除">
          <svg viewBox="0 0 1024 1024" width="14" height="14">
            <path
              d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-17.7-14.3-32-32-32H352c-17.7 0-32 14.3-32 32v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h696c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32zm-8 656H168V320h688v616z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 预览对话框 -->
    <div v-if="previewVisible" class="preview-modal" @click="handlePreviewClose">
      <div class="preview-content" @click.stop>
        <div class="preview-header">
          <span class="preview-title">{{ previewFile?.name }}</span>
          <button class="preview-close" @click="handlePreviewClose">×</button>
        </div>
        <div class="preview-body">
          <img v-if="isImage(previewFile)" :src="previewFile.url" class="preview-image" />
          <video v-else-if="isVideo(previewFile)" :src="previewFile.url" controls class="preview-video"></video>
          <audio v-else-if="isAudio(previewFile)" :src="previewFile.url" controls class="preview-audio"></audio>
          <div v-else class="preview-unsupported">暂不支持预览此文件类型</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Props
const props = defineProps({
  // 是否支持多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 文件大小限制，单位为字节
  fileSizeLimit: {
    type: Number,
    default: 0
  },
  // 文件类型限制，如['image/jpeg', 'image/png']
  fileTypeLimit: {
    type: Array,
    default: () => []
  },
  // 最大上传数量
  limit: {
    type: Number,
    default: 0
  },
  // 是否显示文件列表
  showFileList: {
    type: Boolean,
    default: true
  },
  // 是否支持拖拽上传
  drag: {
    type: Boolean,
    default: false
  },
  // 拖拽提示文本
  dragText: {
    type: String,
    default: ""
  },
  // 是否显示提示信息
  showTip: {
    type: Boolean,
    default: true
  },
  // 提示文本
  tipText: {
    type: String,
    default: ""
  }
});

// Emits
const emit = defineEmits([
  "change", // 文件状态变化时触发
  "success", // 文件上传成功时触发
  "error", // 文件上传失败时触发
  "remove", // 文件被移除时触发
  "preview" // 文件预览时触发
]);

// Refs
const fileInput = ref(null);
const fileList = ref([]);
const previewVisible = ref(false);
const previewFile = ref(null);
const isDragging = ref(false);

// 格式化文件大小
const formatSize = bytes => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 检查是否为图片文件
const isImage = file => {
  return file.type && file.type.startsWith("image/");
};

// 检查是否为视频文件
const isVideo = file => {
  return file.type && file.type.startsWith("video/");
};

// 检查是否为音频文件
const isAudio = file => {
  return file.type && file.type.startsWith("audio/");
};

// 检查是否为PDF文件
const isPdf = file => {
  return file.type === "application/pdf";
};

// 检查是否可以预览文件
const canPreview = file => {
  return isImage(file) || isVideo(file) || isAudio(file);
};

// 处理点击上传区域
const handleClick = () => {
  if (isDragging.value) return;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件选择
const handleFileChange = event => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    uploadFiles(files);
  }
  // 清空input，以便可以重复选择同一个文件
  event.target.value = "";
};

// 处理拖拽进入
const handleDragOver = () => {
  isDragging.value = true;
};

// 处理拖拽离开
const handleDragLeave = () => {
  isDragging.value = false;
};

// 处理拖拽释放
const handleDrop = event => {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files);
  if (files.length > 0) {
    uploadFiles(files);
  }
};

// 上传文件
const uploadFiles = files => {
  // 检查文件数量限制
  if (props.limit > 0 && fileList.value.length + files.length > props.limit) {
    const maxFiles = props.limit - fileList.value.length;
    files = files.slice(0, maxFiles);
  }

  files.forEach(file => {
    // 检查文件大小
    if (props.fileSizeLimit > 0 && file.size > props.fileSizeLimit) {
      emit("error", file, { message: `文件大小超过限制 ${formatSize(props.fileSizeLimit)}` });
      return;
    }

    // 检查文件类型
    if (props.fileTypeLimit.length > 0 && !props.fileTypeLimit.includes(file.type)) {
      emit("error", file, { message: "文件类型不支持" });
      return;
    }

    // 创建文件对象
    const fileObj = {
      uid: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      percentage: 0,
      raw: file
    };

    // 添加到文件列表
    fileList.value.push(fileObj);
    emit("change", fileObj, fileList.value);

    // 模拟上传进度
    simulateUploadProgress(fileObj);
  });
};

// 模拟上传进度
const simulateUploadProgress = file => {
  const interval = setInterval(() => {
    if (file.percentage >= 100) {
      clearInterval(interval);
      file.status = "success";

      // 为可预览的文件创建临时URL
      if (canPreview(file)) {
        file.url = URL.createObjectURL(file.raw);
      }

      emit("success", file, fileList.value);
    } else {
      file.percentage += Math.floor(Math.random() * 10) + 1;
    }
  }, 200);
};

// 处理文件删除
const handleRemove = (file, index) => {
  // 如果文件有临时URL，释放它
  if (file.url) {
    URL.revokeObjectURL(file.url);
  }

  fileList.value.splice(index, 1);
  emit("remove", file, fileList.value);
};

// 处理文件预览
const handlePreview = file => {
  previewFile.value = file;
  previewVisible.value = true;
  emit("preview", file);
};

// 关闭预览对话框
const handlePreviewClose = () => {
  previewVisible.value = false;
  previewFile.value = null;
};

// 监听fileList变化，触发change事件
watch(
  fileList,
  newVal => {
    emit("change", null, newVal);
  },
  { deep: true }
);
</script>

<style scoped>
/* 上传容器 */
.upload-container {
  display: inline-block;
  position: relative;
}

/* 上传区域 */
.upload-area {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fafafa;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
}

.upload-area-drag {
  border-color: #409eff;
  background-color: #f0f9ff;
}

/* 上传图标 */
.upload-icon {
  margin-bottom: 8px;
  color: #c0c4cc;
}

/* 上传文本 */
.upload-text {
  text-align: center;
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
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 文件项 */
.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  font-size: 14px;
}

/* 文件信息 */
.file-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.file-icon {
  color: #409eff;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #909399;
  font-size: 12px;
  flex-shrink: 0;
}

/* 文件进度 */
.file-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
  width: 120px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #ebeef5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #409eff;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #909399;
  width: 35px;
}

/* 文件操作按钮 */
.file-action {
  background: none;
  border: none;
  padding: 4px;
  margin-left: 4px;
  cursor: pointer;
  color: #909399;
  border-radius: 4px;
  transition: color 0.3s, background-color 0.3s;
}

.file-action:hover {
  color: #409eff;
  background-color: #ecf5ff;
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
