<template>
  <div
    v-if="showContextMenu"
    ref="contextMenuRef"
    class="image-context-menu"
    :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
    @mousedown.prevent
  >
    <div class="menu-item" @click="executeImageCommand('imageResize', '50%')">
      <pa-icon name="desktop"></pa-icon>
      <span>调整为窗口大小</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageResize', '100%')">
      <pa-icon name="loop"></pa-icon>
      <span>恢复原始大小</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageResize', '+25%')">
      <pa-icon name="zoom-in"></pa-icon>
      <span>放大25%</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageResize', '-25%')">
      <pa-icon name="zoom-out"></pa-icon>
      <span>缩小25%</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeImageCommand('imageRotate', '90')">
      <pa-icon name="rotate-right"></pa-icon>
      <span>旋转90°</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageRotate', '-90')">
      <pa-icon name="rotate-left"></pa-icon>
      <span>旋转-90°</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeImageCommand('imageFlip', 'horizontal')">
      <pa-icon name="switch_horizontal_line"></pa-icon>
      <span>水平翻转</span>
    </div>
    <div class="menu-item" @click="executeImageCommand('imageFlip', 'vertical')">
      <pa-icon name="switch_vertical_line"></pa-icon>
      <span>垂直翻转</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";

/**
 * @description 是否显示右键菜单
 */
const showContextMenu = ref(false);

/**
 * @description 右键菜单位置
 */
const contextMenuPosition = ref({ x: 0, y: 0 });

/**
 * @description 右键菜单元素引用
 */
const contextMenuRef = ref<HTMLElement | null>(null);

/**
 * @description 选中的图片元素
 */
const selectedImageElement = ref<HTMLImageElement | null>(null);

/**
 * @description 内容变化函数注入
 */
const onContentChange = inject("onContentChange") as () => void;

/**
 * @description 编辑器引用注入
 */
const editorRef = inject("provideEditorRef") as Ref<HTMLDivElement | null>;

/**
 * @description 保存撤销栈函数注入
 */
const saveToUndoStack = inject("saveToUndoStack") as () => void;

/**
 * @description 组件 props
 */
const props = withDefaults(defineProps<{ id: string }>(), {});

/**
 * @description 执行图片编辑命令
 * @param command - 命令名称
 * @param value - 命令参数
 */
function executeCommand(command: string, value?: any): void {
  editorRef?.value?.focus?.();
  if (command === "imageResize" && value) {
    saveToUndoStack();
    const selection: any = typeof window !== "undefined" ? window.getSelection() : null();
    const anchorNode = selection?.anchorNode;
    let imageElement: any = null;
    if (anchorNode instanceof HTMLImageElement) {
      imageElement = anchorNode;
    } else if (anchorNode?.parentNode instanceof HTMLImageElement) {
      imageElement = anchorNode.parentNode;
    } else {
      const images: any = document.querySelectorAll(`#${props.id} .editor-content img`);
      for (const img of images) {
        if (selection.containsNode(img, true)) {
          imageElement = img;
          break;
        }
      }
    }
    if (imageElement) {
      const currentWidth = imageElement.clientWidth;
      let newWidth = currentWidth;
      imageElement.style.display = "inline-block";
      if (value.endsWith("%") && value !== "100%") {
        if (value.startsWith("+")) {
          const scale = parseFloat(value) / 100;
          newWidth = currentWidth * (1 + scale);
        } else if (value.startsWith("-")) {
          const scale = parseFloat(value) / 100;
          newWidth = currentWidth * (1 + scale);
        } else {
          newWidth = editorRef?.value?.clientWidth || currentWidth;
        }
      } else if (value === "100%") {
        imageElement.style.width = "";
        imageElement.style.height = "";
        onContentChange();
        return;
      }
      imageElement.style.width = `${newWidth}px`;
      imageElement.style.height = "auto";
      onContentChange();
    }
  }
  if (command === "imageRotate") {
    saveToUndoStack();
    const selection: any = typeof window !== "undefined" ? window.getSelection() : null();
    const anchorNode = selection?.anchorNode;
    let imageElement: any = null;
    if (anchorNode instanceof HTMLImageElement) {
      imageElement = anchorNode;
    } else if (anchorNode?.parentNode instanceof HTMLImageElement) {
      imageElement = anchorNode.parentNode;
    } else {
      const images: any = document.querySelectorAll(`#${props.id} .editor-content img`);
      for (const img of images) {
        if (selection.containsNode(img, true)) {
          imageElement = img;
          break;
        }
      }
    }
    if (imageElement) {
      const currentTransform = imageElement.style.transform || "";
      const rotateMatch = currentTransform.match(/rotate\((-?\d+)deg\)/);
      let currentRotation = 0;
      if (rotateMatch) {
        currentRotation = parseInt(rotateMatch[1]);
      }
      const newRotation = currentRotation + parseInt(value);
      const newTransform = currentTransform.replace(/rotate\((-?\d+)deg\)/, "");
      imageElement.style.transform = `${newTransform} rotate(${newRotation}deg)`;
      onContentChange();
    }
  }
  if (command === "imageFlip" && value) {
    saveToUndoStack();
    const selection: any = typeof window !== "undefined" ? window.getSelection() : null();
    const anchorNode = selection?.anchorNode;
    let imageElement: any = null;
    if (anchorNode instanceof HTMLImageElement) {
      imageElement = anchorNode;
    } else if (anchorNode?.parentNode instanceof HTMLImageElement) {
      imageElement = anchorNode.parentNode;
    } else {
      const images: any = document.querySelectorAll(`#${props.id} .editor-content img`);
      for (const img of images) {
        if (selection.containsNode(img, true)) {
          imageElement = img;
          break;
        }
      }
    }
    if (imageElement) {
      const currentTransform = imageElement.style.transform || "";
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
      if (value === "horizontal") {
        scaleX = -scaleX;
      } else if (value === "vertical") {
        scaleY = -scaleY;
      }
      let newTransform = currentTransform.replace(/scaleX\((-?\d+)\)/g, "");
      newTransform = newTransform.replace(/scaleY\((-?\d+)\)/g, "");
      newTransform = `${newTransform} scaleX(${scaleX}) scaleY(${scaleY})`;
      imageElement.style.transform = newTransform.trim();
      onContentChange();
    }
  }
  onContentChange();
  editorRef?.value?.focus?.();
}

/**
 * @description 执行图片命令
 * @param command - 命令名称
 * @param value - 命令参数
 */
function executeImageCommand(command: string, value?: string): void {
  if (!selectedImageElement.value) return;
  const range = document.createRange();
  range.selectNode(selectedImageElement.value);
  const selection = typeof window !== "undefined" ? window.getSelection() : null();
  selection?.removeAllRanges();
  selection?.addRange(range);
  executeCommand?.(command, value);
  showContextMenu.value = false;
}

/**
 * @description 处理右键菜单显示
 * @param e - 鼠标事件
 */
function handleContextMenu(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const imgElement = target.closest("img") as HTMLImageElement;
  if (imgElement) {
    showContextMenu.value = true;
    contextMenuPosition.value = { x: e.clientX, y: e.clientY };
    selectedImageElement.value = imgElement;
    e.preventDefault();
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
}

defineExpose({
  handleContextMenu
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
