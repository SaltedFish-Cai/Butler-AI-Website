<template>
  <div :id="ID" class="pa-editor" :style="{ ...props.style }" :class="[props.class]">
    <m-editor-tools
      ref="editorToolsRef"
      :isSourceCodeMode="isSourceCodeMode"
      v-bind="{ ...props, id: ID }"
      :isToolActive="isToolActive"
      :findFontSize="findFontSize"
      :autoFormatCode="autoFormatCode"
      :applySyntaxHighlighting="applySyntaxHighlighting"
      :ex-button="exButton"
      @popver-change="value => (openPopover = value)"
      @source-code-mode-change="value => (isSourceCodeMode = value)"
    >
    </m-editor-tools>
    <pa-scrollbar
      useShadow
      style="flex: 1"
      :useScrollX="false"
      :contentStyle="
        isSourceCodeMode == 'code' ? { background: isDarkTheme ? 'var(--pa-color-dark-bg)' : 'var(--pa-color-white)' } : {}
      "
    >
      <div v-if="isSourceCodeMode == 'visible'" v-html="editorRef?.innerHTML"></div>
      <div
        :id="'editor-content'"
        v-show="isSourceCodeMode == 'edit'"
        class="editor-content"
        :class="[openPopover ? 'popver-active' : '']"
        :style="{ '--pa-color-font': 'var(--pa-color-font)' }"
        contenteditable
        ref="editorRef"
        @input="onContentChange"
        @paste="onPaste"
        @contextmenu.prevent="handleContextMenu"
      ></div>
      <div v-show="isSourceCodeMode == 'code'" class="source-code-container" :class="[isDarkTheme ? 'github-dark' : 'github']">
        <div class="line-numbers" ref="lineNumbersRef"></div>
        <div class="source-code-editor-container" ref="sourceCodeEditorContainerRef" @scroll="onSourceCodeScroll">
          <div class="source-code-overlay" ref="sourceCodeOverlayRef"></div>
          <textarea ref="sourceCodeRef" class="source-code-editor" @input="onSourceCodeChange"></textarea>
        </div>
        <pa-switch
          class="theme-toggle-btn"
          v-model="isDarkTheme"
          :style="{
            '--pa-size-height': '25px',
            '--pa-color-primary': 'var(--pa-color-source-code-toggle)'
          }"
          :iconStyle="{
            color: isDarkTheme ? 'var(--pa-color-white)' : 'var(--pa-color-black)',
            backgroundColor: isDarkTheme ? 'var(--pa-color-source-code-toggle)' : 'var(--pa-color-white)'
          }"
          @change="toggleTheme"
          :activeText="''"
          :inActiveText="''"
          :activeIcon="'moon_line'"
          :inActiveIcon="'sun_line'"
        >
        </pa-switch>
      </div>
    </pa-scrollbar>
    <div class="editor-footer" v-show="isSourceCodeMode != 'visible' && isSourceCodeMode != 'code'">
      <div></div>
      <span class="word-count">{{ wordCount }} 字</span>
    </div>
    <edit-image :id="ID" ref="editImageRef"></edit-image>
    <edit-table ref="editTableRef"></edit-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, Ref, provide, nextTick, useTemplateRef } from "vue";
import type { ComponentProps, ComponentEmits } from "./types";
import EditImage from "./edit-images.vue";
import EditTable from "./edit-table.vue";
import MEditorTools from "./m-editor-tools.vue";
import { randChar } from "../tools/rand-char";
import { useToolsHooks } from "./use-tools-hooks";
import * as prettier from "prettier/standalone";
import * as prettierHtmlParser from "prettier/parser-html";
import hljs from "highlight.js";
import _ from "lodash";

const { debounce } = _;

/**
 * @description 组件 props 定义
 */
const props = withDefaults(defineProps<ComponentProps>(), {});

/**
 * @description 编辑器唯一 ID
 */
const ID = ref(props.id || randChar(6));

/**
 * @description 图片编辑组件引用
 */
const editImageRef = ref();

/**
 * @description 表格编辑组件引用
 */
const editTableRef = ref();

/**
 * @description 工具栏组件引用
 */
const editorToolsRef = useTemplateRef("editorToolsRef");

/**
 * @description 源码编辑 textarea 引用
 */
const sourceCodeRef = ref<HTMLTextAreaElement | null>(null);

/**
 * @description 行号容器引用
 */
const lineNumbersRef = ref<HTMLDivElement | null>(null);

/**
 * @description 组件事件定义
 */
const emit = defineEmits<ComponentEmits>();

/**
 * @description 编辑器主内容区域引用
 */
const editorRef = ref<HTMLElement | null>(null);

/**
 * @description 源码高亮覆盖层引用
 */
const sourceCodeOverlayRef = ref<HTMLDivElement | null>(null);

/**
 * @description 源码编辑器容器引用
 */
const sourceCodeEditorContainerRef = ref<HTMLDivElement | null>(null);

/**
 * @description 弹出层是否打开状态
 */
const openPopover = ref(false);

/**
 * @description 撤销栈
 */
const undoStack: string[] = [];

/**
 * @description 恢复栈
 */
const redoStack: string[] = [];

/**
 * @description 栈最大容量
 */
const MAX_STACK_SIZE = 50;

/**
 * @description 保存当前编辑器状态到撤销栈
 */
function saveToUndoStack(): void {
  if (!editorRef.value) return;
  const currentState = editorRef.value.innerHTML;
  undoStack.push(currentState);
  if (undoStack.length > MAX_STACK_SIZE) {
    undoStack.shift();
  }
  redoStack.length = 0;
}

/**
 * @description 撤销操作
 */
function undo(): void {
  if (!editorRef.value || undoStack.length === 0) return;
  const currentState = editorRef.value.innerHTML;
  redoStack.push(currentState);
  if (redoStack.length > MAX_STACK_SIZE) {
    redoStack.shift();
  }
  const previousState = undoStack.pop();
  if (previousState) {
    editorRef.value.innerHTML = previousState;
    onContentChange();
  }
}

/**
 * @description 恢复操作
 */
function redo(): void {
  if (!editorRef.value || redoStack.length === 0) return;
  const currentState = editorRef.value.innerHTML;
  undoStack.push(currentState);
  if (undoStack.length > MAX_STACK_SIZE) {
    undoStack.shift();
  }
  const nextState = redoStack.pop();
  if (nextState) {
    editorRef.value.innerHTML = nextState;
    onContentChange();
  }
}

/**
 * @description 是否为暗色主题
 */
const isDarkTheme = ref(true);

/**
 * @description 源码编辑模式状态
 */
const isSourceCodeMode: Ref<"code" | "edit" | "visible"> = ref("edit");

/**
 * @description 全屏状态
 */
const isFullscreen = ref(false);

/**
 * @description 保存的光标范围
 */
let savedCursorRange: Range | null = null;

/**
 * @description 切换全屏功能
 */
function toggleFullscreen(): void {
  const editorElement: any = document.getElementById(ID.value);
  if (!editorElement) return;
  if (!isFullscreen.value) {
    if (editorElement.requestFullscreen) {
      editorElement.requestFullscreen();
    } else if (editorElement.webkitRequestFullscreen) {
      (editorElement as any).webkitRequestFullscreen();
    } else if (editorElement.mozRequestFullScreen) {
      (editorElement as any).mozRequestFullScreen();
    } else if (editorElement.msRequestFullscreen) {
      (editorElement as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
}

/**
 * @description 处理全屏变化事件
 */
function handleFullscreenChange(): void {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}

/**
 * @description 保存光标位置
 */
function saveCursorPosition(): void {
  if (!editorRef.value) return;
  const selection = typeof window !== "undefined" ? window.getSelection() : null();
  if (selection && selection.rangeCount > 0) {
    savedCursorRange = selection.getRangeAt(0).cloneRange();
  }
}

/**
 * @description 组件挂载时注册全屏变化事件监听器
 */
onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);
  if (editorRef.value) {
    editorRef.value.addEventListener("blur", saveCursorPosition);
  }
});

/**
 * @description 组件卸载时移除事件监听器
 */
onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
  document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
  if (editorRef.value) {
    editorRef.value.removeEventListener("blur", saveCursorPosition);
  }
});

/**
 * @description 切换主题
 */
function toggleTheme(): void {
  isDarkTheme.value = !isDarkTheme.value;
  applySyntaxHighlighting();
}

/**
 * @description 处理源码编辑器滚动事件
 */
function onSourceCodeScroll(): void {
  if (!sourceCodeEditorContainerRef.value) return;
  if (lineNumbersRef.value) {
    lineNumbersRef.value.style.marginTop = `-${sourceCodeEditorContainerRef.value.scrollTop}px`;
  }
  if (sourceCodeRef.value) {
    sourceCodeRef.value.scrollTop = sourceCodeEditorContainerRef.value.scrollTop;
    sourceCodeRef.value.scrollLeft = sourceCodeEditorContainerRef.value.scrollLeft;
  }
}

/**
 * @description 更新源码模式下的行号
 */
function updateLineNumbers(): void {
  if (!sourceCodeRef.value || !lineNumbersRef.value) return;
  const content = sourceCodeRef.value.value;
  const lines = content.split("\n");
  const lineCount = lines.length - 1;
  let lineNumbersHTML = "";
  for (let i = 1; i <= lineCount; i++) {
    lineNumbersHTML += `<div class="line-number">${i}</div>`;
  }
  lineNumbersRef.value.innerHTML = lineNumbersHTML;
}

/**
 * @description 更新字数统计
 */
const updateWordCount = (): void => {
  if (!editorRef.value) return;
  const content = editorRef.value.innerText || editorRef.value.textContent || "";
  wordCount.value = content.length;
};

/**
 * @description 源码模式下的字数统计
 */
function updateWordCountInSourceMode(): void {
  if (!sourceCodeRef.value) return;
  const content = sourceCodeRef.value.value || "";
  const textContent = content.replace(/<[^>]*>/g, "");
  wordCount.value = textContent.length;
  updateLineNumbers();
}

const { wordCount, isToolActive, findFontSize } = useToolsHooks(
  ID.value,
  isSourceCodeMode,
  editorRef,
  sourceCodeRef,
  lineNumbersRef,
  sourceCodeEditorContainerRef
);

provide("provideEditorRef", editorRef);
provide("provideSourceCodeRef", sourceCodeRef);
provide("updateLineNumbers", updateLineNumbers);
provide("saveToUndoStack", saveToUndoStack);
provide("undo", undo);
provide("redo", redo);
provide("toggleFullscreen", toggleFullscreen);

/**
 * @description 自动格式化代码
 * @param isFormat - 是否执行格式化
 */
function autoFormatCode(isFormat = true): void {
  try {
    if (!sourceCodeRef.value) return;
    const cursorPosition = sourceCodeRef.value.selectionStart;
    const content = sourceCodeRef.value.value;
    const wasNewLine = cursorPosition > 0 && content.charAt(cursorPosition - 1) === "\n";
    const nextChar = content.charAt(cursorPosition);
    const isEditingEmptyLine = wasNewLine && (nextChar === "\n" || nextChar === "");
    if (isEditingEmptyLine && !isFormat) {
      return;
    }
    const formattedContent = prettier.format(content, {
      printWidth: 9999,
      parser: "html",
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      preserveNewlines: false,
      htmlWhitespaceSensitivity: "ignore",
      endOfLine: "auto",
      wrapAttributes: "preserve",
      singleAttributePerLine: true,
      trailingComma: "none",
      bracketSpacing: true,
      bracketSameLine: true,
      plugins: [prettierHtmlParser]
    });
    if (formattedContent === content) {
      if (sourceCodeRef.value) {
        sourceCodeRef.value.style.width = `${(sourceCodeOverlayRef.value?.clientWidth || 0) + 5}px`;
        sourceCodeRef.value.style.height = `${sourceCodeOverlayRef.value?.clientHeight}px`;
      }
      return;
    }
    let newCursorPosition;
    if (wasNewLine) {
      const linesBeforeCursor = content.substring(0, cursorPosition).split("\n");
      const lineNumber = linesBeforeCursor.length;
      const formattedLines = formattedContent.split("\n");
      if (lineNumber <= formattedLines.length) {
        newCursorPosition = formattedLines.slice(0, lineNumber - 1).join("\n").length + 1;
      } else {
        const ratio = cursorPosition / content.length;
        newCursorPosition = Math.round(formattedContent.length * ratio);
      }
    } else {
      const searchLength = 20;
      const startSearchIndex = Math.max(0, cursorPosition - searchLength);
      const searchString = content.substring(startSearchIndex, cursorPosition);
      const foundIndex = formattedContent.indexOf(searchString, startSearchIndex - 5);
      if (foundIndex !== -1) {
        newCursorPosition = foundIndex + searchString.length;
      } else {
        const ratio = cursorPosition / content.length;
        newCursorPosition = Math.round(formattedContent.length * ratio);
      }
    }
    newCursorPosition = Math.max(0, Math.min(newCursorPosition, formattedContent.length));
    sourceCodeRef.value.value = formattedContent;
    setTimeout(() => {
      if (sourceCodeRef.value) {
        sourceCodeRef.value.selectionStart = sourceCodeRef.value.selectionEnd = newCursorPosition;
      }
      nextTick(() => {
        applySyntaxHighlighting();
        onSourceCodeScroll();
        if (sourceCodeRef.value) {
          sourceCodeRef.value.style.width = `${(sourceCodeOverlayRef.value?.clientWidth || 0) + 5}px`;
          sourceCodeRef.value.style.height = `${sourceCodeOverlayRef.value?.clientHeight}px`;
        }
      });
    }, 0);
    emit("update:modelValue", formattedContent);
    emit("change", formattedContent);
    updateWordCountInSourceMode();
  } catch (error) {
    console.error("自动格式化失败:", error);
  }
}

const debouncedFormatCode = debounce(autoFormatCode, 500);

/**
 * @description 内容变化事件处理
 */
function onContentChange(): void {
  if (editorRef.value) {
    const content = editorRef.value.innerHTML;
    emit("update:modelValue", content);
    emit("change", content);
  }
  editorToolsRef.value?.isToolActiveArrayFn();
  updateWordCount();
}

provide("onContentChange", onContentChange);

/**
 * @description 应用语法高亮
 */
function applySyntaxHighlighting(): void {
  if (!sourceCodeRef.value || !sourceCodeOverlayRef.value) return;
  const content = sourceCodeRef.value.value;
  const highlighted = hljs.highlight(content, { language: "xml" }).value;
  sourceCodeOverlayRef.value.innerHTML = highlighted;
  const sourceCodeContainer = sourceCodeRef.value.closest(".source-code-container");
  const lineNumbers = lineNumbersRef.value;
  const sourceCodeEditor = sourceCodeRef.value;
  const sourceCodeOverlay = sourceCodeOverlayRef.value;
  if (isDarkTheme.value) {
    sourceCodeContainer?.classList.add("dark-theme");
    lineNumbers?.classList.add("dark-theme");
    sourceCodeEditor.classList.add("dark-theme");
    sourceCodeOverlay.classList.add("dark-theme");
    sourceCodeContainer?.classList.remove("light-theme");
    lineNumbers?.classList.remove("light-theme");
    sourceCodeEditor.classList.remove("light-theme");
    sourceCodeOverlay.classList.remove("light-theme");
  } else {
    sourceCodeContainer?.classList.add("light-theme");
    lineNumbers?.classList.add("light-theme");
    sourceCodeEditor.classList.add("light-theme");
    sourceCodeOverlay.classList.add("light-theme");
    sourceCodeContainer?.classList.remove("dark-theme");
    lineNumbers?.classList.remove("dark-theme");
    sourceCodeEditor.classList.remove("dark-theme");
    sourceCodeOverlay.classList.remove("dark-theme");
  }
  onSourceCodeScroll();
}

/**
 * @description 源码编辑内容变化事件处理
 */
function onSourceCodeChange(): void {
  if (sourceCodeRef.value) {
    const content = sourceCodeRef.value.value;
    emit("update:modelValue", content);
    emit("change", content);
  }
  updateWordCountInSourceMode();
  nextTick(() => {
    applySyntaxHighlighting();
    onSourceCodeScroll();
  });
  debouncedFormatCode();
}

/**
 * @description 防抖设置编辑器内容
 * @param content - 内容字符串
 */
function debounceEditorContent(content: string): void {
  let wrappedContent = content;
  if (content && !content.trim().startsWith("<div") && !content.trim().startsWith("<!DOCTYPE")) {
    wrappedContent = `<div style="color: var(--pa-color-font);">${content}
      <p>&nbsp;</p>
      </div>`;
  }
  if (editorRef.value && isSourceCodeMode.value !== "code") {
    editorRef.value.innerHTML = wrappedContent;
    updateWordCount();
  }
  if (sourceCodeRef.value) {
    sourceCodeRef.value.value = wrappedContent;
  }
}

const setEditorContent = debounce(debounceEditorContent, 500);

/**
 * @description 监听 modelValue 变化
 */
watch(
  () => props.modelValue,
  newVal => {
    if (editorRef.value && editorRef.value.innerHTML !== newVal && isSourceCodeMode.value !== "code") {
      setEditorContent(newVal);
    }
  },
  { immediate: true, deep: true }
);

/**
 * @description 粘贴事件处理
 * @param e - 剪贴板事件
 */
function onPaste(e: ClipboardEvent): void {
  e.preventDefault();
  const text = e.clipboardData?.getData("text/plain") || "";
  const selection = typeof window !== "undefined" ? window.getSelection() : null();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  onContentChange();
}

/**
 * @description 处理右键菜单显示
 * @param e - 鼠标事件
 */
function handleContextMenu(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const tableElement = target.closest("td, th") as HTMLTableCellElement;
  const imgElement = target.closest("img") as HTMLImageElement;
  if (tableElement) {
    editTableRef.value?.handleContextMenu(e);
  } else if (imgElement) {
    editImageRef.value?.handleContextMenu(e);
  }
}

/**
 * @description 组件挂载时设置初始内容
 */
onMounted(() => {
  setEditorContent(props.modelValue);
});

/**
 * @description 获取编辑器内容
 * @returns 编辑器 HTML 内容
 */
function getEditorValue(): string {
  return editorRef.value?.innerHTML || "";
}

/**
 * @description 在光标位置插入文本
 * @param text - 要插入的文本
 */
function insertTextAtCursor(text: string): void {
  editorRef.value?.focus?.();
  const selection = typeof window !== "undefined" ? window.getSelection() : null();
  if (selection) {
    try {
      if (savedCursorRange && editorRef.value?.contains(savedCursorRange.startContainer)) {
        selection.removeAllRanges();
        selection.addRange(savedCursorRange);
      }
      if (selection.rangeCount === 0) {
        const range = document.createRange();
        if (editorRef.value && editorRef.value.childNodes.length > 0) {
          const lastNode = editorRef.value.childNodes[editorRef.value.childNodes.length - 1];
          if (lastNode.nodeType === Node.TEXT_NODE && lastNode.textContent?.length) {
            range.setStart(lastNode, lastNode.textContent.length);
          } else {
            range.setStart(editorRef.value, editorRef.value.childNodes.length);
          }
        } else {
          range.setStart(editorRef.value as Node, 0);
        }
        range.collapse(true);
        selection.addRange(range);
      }
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      console.error("恢复光标位置或插入文本失败:", error);
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
}

defineExpose({
  setEditorValue: setEditorContent,
  getEditorValue,
  insertTextAtCursor
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
