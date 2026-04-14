<template>
  <!-- 图片右键菜单 -->
  <div
    v-if="showContextMenu"
    ref="contextMenuRef"
    class="image-context-menu"
    :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
    @mousedown.prevent
  >
    <div class="menu-item" @click="executeImageCommand('imageResize', '50%')">
      <m-icon-v2 name="desktop"></m-icon-v2>
      <span>调整为窗口大小</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageResize', '100%')">
      <m-icon-v2 name="loop"></m-icon-v2>
      <span>恢复原始大小</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageResize', '+25%')">
      <m-icon-v2 name="zoom-in"></m-icon-v2>
      <span>放大25%</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageResize', '-25%')">
      <m-icon-v2 name="zoom-out"></m-icon-v2>
      <span>缩小25%</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeImageCommand('imageRotate', '90')">
      <m-icon-v2 name="rotate-right"></m-icon-v2>
      <span>旋转90°</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageRotate', '-90')">
      <m-icon-v2 name="rotate-left"></m-icon-v2>
      <span>旋转-90°</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeImageCommand('imageFlip', 'horizontal')">
      <m-icon-v2 name="switch_horizontal_line"></m-icon-v2>
      <span>水平翻转</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageFlip', 'vertical')">
      <m-icon-v2 name="switch_vertical_line"></m-icon-v2>
      <span>垂直翻转</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";

// 图片右键菜单相关
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuRef = ref<HTMLElement | null>(null);
const selectedImageElement = ref<HTMLImageElement | null>(null);
const onContentChange = inject("onContentChange") as () => void;
const editorRef = inject("provideEditorRef") as Ref<HTMLDivElement | null>;
const saveToUndoStack = inject("saveToUndoStack") as () => void;
const props = withDefaults(defineProps<{ id: string }>(), {});

const executeCommand = (command: string, value?: any) => {
  editorRef?.value?.focus?.();
  // 处理图片编辑命令
  if (command === "imageResize" && value) {
    // 在执行图片操作前保存当前状态到撤销栈
    saveToUndoStack();
    // 获取选中的图片
    const selection: any = window.getSelection();
    const anchorNode = selection?.anchorNode;
    let imageElement: any = null;

    // 查找图片元素
    if (anchorNode instanceof HTMLImageElement) {
      imageElement = anchorNode;
    } else if (anchorNode?.parentNode instanceof HTMLImageElement) {
      imageElement = anchorNode.parentNode;
    } else {
      // 查找所有图片元素，检查是否有选中的图片
      const images: any = document.querySelectorAll(`#${props.id} .editor-content img`);
      for (const img of images) {
        if (selection.containsNode(img, true)) {
          imageElement = img;
          break;
        }
      }
    }
    if (imageElement) {
      // 获取当前图片宽度
      const currentWidth = imageElement.clientWidth;
      let newWidth = currentWidth;
      imageElement.style.display = "inline-block";
      // 解析调整值
      if (value.endsWith("%") && value !== "100%") {
        // 处理百分比调整
        if (value.startsWith("+")) {
          console.log("放大指定百分比", value);
          // 放大指定百分比
          const scale = parseFloat(value) / 100;
          newWidth = currentWidth * (1 + scale);
        } else if (value.startsWith("-")) {
          console.log("缩小指定百分比", value);
          // 缩小指定百分比
          const scale = parseFloat(value) / 100;
          newWidth = currentWidth * (1 + scale); // 注意：这里已经是负数了
        } else {
          console.dir(editorRef);

          // 设置为指定百分比
          newWidth = editorRef?.value?.clientWidth || currentWidth;
        }
      } else if (value === "100%") {
        // 恢复原始大小
        imageElement.style.width = "";
        imageElement.style.height = "";
        onContentChange();
        return;
      }
      // 设置新的宽度，保持比例
      imageElement.style.width = `${newWidth}px`;
      imageElement.style.height = "auto";
      onContentChange();
    }
  }

  // 处理图片旋转命令
  if (command === "imageRotate") {
    // 在执行图片操作前保存当前状态到撤销栈
    saveToUndoStack();
    // 获取选中的图片
    const selection: any = window.getSelection();
    const anchorNode = selection?.anchorNode;
    let imageElement: any = null;

    // 查找图片元素
    if (anchorNode instanceof HTMLImageElement) {
      imageElement = anchorNode;
    } else if (anchorNode?.parentNode instanceof HTMLImageElement) {
      imageElement = anchorNode.parentNode;
    } else {
      // 查找所有图片元素，检查是否有选中的图片
      const images: any = document.querySelectorAll(`#${props.id} .editor-content img`);
      for (const img of images) {
        if (selection.containsNode(img, true)) {
          imageElement = img;
          break;
        }
      }
    }

    if (imageElement) {
      // 获取当前旋转角度
      const currentTransform = imageElement.style.transform || "";
      const rotateMatch = currentTransform.match(/rotate\((-?\d+)deg\)/);
      let currentRotation = 0;

      if (rotateMatch) {
        currentRotation = parseInt(rotateMatch[1]);
      }

      // 计算新的旋转角度
      const newRotation = currentRotation + parseInt(value);

      // 移除旧的旋转变换
      const newTransform = currentTransform.replace(/rotate\((-?\d+)deg\)/, "");
      // 添加新的旋转变换
      imageElement.style.transform = `${newTransform} rotate(${newRotation}deg)`;

      onContentChange();
    }
  }

  // 处理图片翻转命令
  if (command === "imageFlip" && value) {
    // 在执行图片操作前保存当前状态到撤销栈
    saveToUndoStack();
    // 获取选中的图片
    const selection: any = window.getSelection();
    const anchorNode = selection?.anchorNode;
    let imageElement: any = null;

    // 查找图片元素
    if (anchorNode instanceof HTMLImageElement) {
      imageElement = anchorNode;
    } else if (anchorNode?.parentNode instanceof HTMLImageElement) {
      imageElement = anchorNode.parentNode;
    } else {
      // 查找所有图片元素，检查是否有选中的图片
      const images: any = document.querySelectorAll(`#${props.id} .editor-content img`);
      for (const img of images) {
        if (selection.containsNode(img, true)) {
          imageElement = img;
          break;
        }
      }
    }

    if (imageElement) {
      // 获取当前变换
      const currentTransform = imageElement.style.transform || "";

      // 检查当前是否已经有翻转变换
      const scaleXMatch = currentTransform.match(/scaleX\((-?\d+)\)/);
      const scaleYMatch = currentTransform.match(/scaleY\((-?\d+)\)/);
      let scaleX = 1;
      let scaleY = 1;

      if (scaleXMatch) {
        scaleX = parseInt(scaleXMatch[1]);
      }
      if (scaleYMatch) {
        scaleY = parseInt(scaleYMatch[1]);
      }

      // 应用翻转
      if (value === "horizontal") {
        scaleX = -scaleX;
      } else if (value === "vertical") {
        scaleY = -scaleY;
      }

      // 移除旧的缩放变换
      let newTransform = currentTransform.replace(/scaleX\((-?\d+)\)/g, "");
      newTransform = newTransform.replace(/scaleY\((-?\d+)\)/g, "");

      // 添加新的缩放变换
      newTransform = `${newTransform} scaleX(${scaleX}) scaleY(${scaleY})`;
      imageElement.style.transform = newTransform.trim();

      onContentChange();
    }
  }

  onContentChange();
  editorRef?.value?.focus?.();
};

// 执行图片编辑命令
const executeImageCommand = (command: string, value?: string) => {
  if (!selectedImageElement.value) return;

  // 先选择图片
  const range = document.createRange();
  range.selectNode(selectedImageElement.value);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  // 执行命令
  executeCommand?.(command, value);

  // 关闭菜单
  showContextMenu.value = false;
};

// 处理右键菜单
const handleContextMenu = (e: MouseEvent) => {
  // 检查点击的是否是图片或图片的子元素
  const target = e.target as HTMLElement;
  const imgElement = target.closest("img") as HTMLImageElement;
  if (imgElement) {
    // 显示右键菜单
    showContextMenu.value = true;
    contextMenuPosition.value = { x: e.clientX, y: e.clientY };
    selectedImageElement.value = imgElement;

    // 阻止默认右键菜单
    e.preventDefault();

    // 点击外部关闭菜单
    setTimeout(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contextMenuRef.value && !contextMenuRef.value.contains(event.target as Node)) {
          showContextMenu.value = false;
          document.removeEventListener("click", handleClickOutside);
        }
      };
      document.addEventListener("click", handleClickOutside);
    }, 0);
  }
};

defineExpose({
  handleContextMenu
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
