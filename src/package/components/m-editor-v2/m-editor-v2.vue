<template>
  <div :id="ID" class="m-editor-v2" :style="{ ...props.style }" :class="[props.class]">
    <!-- 工具栏配置 -->
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
    ></m-editor-tools>

    <m-scrollbar-v2
      useShadow
      style="flex: 1"
      :useScrollX="false"
      :contentStyle="isSourceCodeMode == 'code' ? { background: isDarkTheme ? '#1b1b1f' : '#fff' } : {}"
    >
      <div v-if="isSourceCodeMode == 'visible'" v-html="editorRef?.innerHTML"></div>
      <!-- 可视化编辑模式 -->
      <div
        :id="'editor-content'"
        v-show="isSourceCodeMode == 'edit'"
        class="editor-content"
        :class="[openPopover ? 'popver-active' : '']"
        :style="{ '--m-color-v2-font': '#1d1d1d' }"
        contenteditable
        ref="editorRef"
        @input="onContentChange"
        @paste="onPaste"
        @contextmenu.prevent="handleContextMenu"
      ></div>
      <!-- 源码编辑模式 -->
      <div v-show="isSourceCodeMode == 'code'" class="source-code-container" :class="[isDarkTheme ? 'github-dark' : 'github']">
        <div class="line-numbers" ref="lineNumbersRef"></div>
        <div class="source-code-editor-container" ref="sourceCodeEditorContainerRef" @scroll="onSourceCodeScroll">
          <div class="source-code-overlay" ref="sourceCodeOverlayRef"></div>
          <textarea ref="sourceCodeRef" class="source-code-editor" @input="onSourceCodeChange"></textarea>
        </div>
        <m-switch-v2
          class="theme-toggle-btn"
          v-model="isDarkTheme"
          :style="{
            '--m-size-v2-height': '25px',
            '--m-color-v2-primary': '#3c414a'
          }"
          :iconStyle="{
            color: isDarkTheme ? '#fff' : '#000',
            backgroundColor: isDarkTheme ? '#3c414a' : '#fff'
          }"
          @change="toggleTheme"
          :activeText="''"
          :inActiveText="''"
          :activeIcon="'moon_line'"
          :inActiveIcon="'sun_line'"
        ></m-switch-v2>
      </div>
    </m-scrollbar-v2>
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
import { MEditorV2Type } from "./type";

import EditImage from "./edit-images.vue";
import EditTable from "./edit-table.vue";
import MEditorTools from "./m-editor-tools.vue";

import { randChar } from "../tools/rand-char";
import { useToolsHooks } from "./use-tools-hooks";
import * as prettier from "prettier/standalone";
import * as prettierHtmlParser from "prettier/parser-html";
import hljs from "highlight.js";

import { debounce } from "lodash";

// 定义props
const props = withDefaults(defineProps<MEditorV2Type>(), {});

const ID = ref(props.id || randChar(6));
const editImageRef = ref();
const editTableRef = ref();

const editorToolsRef = useTemplateRef("editorToolsRef");
// 源码编辑相关
const sourceCodeRef = ref<HTMLTextAreaElement | null>(null);
const lineNumbersRef = ref<HTMLDivElement | null>(null);

// 定义emits
const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

// 编辑器引用
const editorRef = ref<HTMLElement | null>(null);
const sourceCodeOverlayRef = ref<HTMLDivElement | null>(null);
const sourceCodeEditorContainerRef = ref<HTMLDivElement | null>(null);
const openPopover = ref(false);

// 自定义撤销栈和恢复栈
const undoStack: string[] = [];
const redoStack: string[] = [];
const MAX_STACK_SIZE = 50;

// 保存当前编辑器状态到撤销栈
const saveToUndoStack = () => {
  if (!editorRef.value) return;

  // 保存当前编辑器内容到撤销栈
  const currentState = editorRef.value.innerHTML;
  undoStack.push(currentState);

  // 限制栈的大小
  if (undoStack.length > MAX_STACK_SIZE) {
    undoStack.shift();
  }

  // 清空恢复栈
  redoStack.length = 0;
};

// 撤销操作
const undo = () => {
  if (!editorRef.value || undoStack.length === 0) return;

  // 保存当前状态到恢复栈
  const currentState = editorRef.value.innerHTML;
  redoStack.push(currentState);

  // 限制恢复栈大小
  if (redoStack.length > MAX_STACK_SIZE) {
    redoStack.shift();
  }

  // 从撤销栈中弹出并恢复上一个状态
  const previousState = undoStack.pop();
  if (previousState) {
    editorRef.value.innerHTML = previousState;
    // 触发内容变化事件
    onContentChange();
  }
};

// 恢复操作
const redo = () => {
  if (!editorRef.value || redoStack.length === 0) return;

  // 保存当前状态到撤销栈
  const currentState = editorRef.value.innerHTML;
  undoStack.push(currentState);

  // 限制撤销栈大小
  if (undoStack.length > MAX_STACK_SIZE) {
    undoStack.shift();
  }

  // 从恢复栈中弹出并恢复下一个状态
  const nextState = redoStack.pop();
  if (nextState) {
    editorRef.value.innerHTML = nextState;
    // 触发内容变化事件
    onContentChange();
  }
};

// 主题管理
const isDarkTheme = ref(true);
const isSourceCodeMode: Ref<"code" | "edit" | "visible"> = ref("edit");

// 全屏状态
const isFullscreen = ref(false);

// 保存光标位置的变量
let savedCursorRange: Range | null = null;

// 切换全屏功能
const toggleFullscreen = () => {
  const editorElement: any = document.getElementById(ID.value);
  if (!editorElement) return;

  if (!isFullscreen.value) {
    // 进入全屏
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
    // 退出全屏
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
};

// 监听全屏变化事件
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

// 注册全屏变化事件监听器
onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);

  // 为编辑器添加blur事件监听器，保存光标位置
  if (editorRef.value) {
    editorRef.value.addEventListener("blur", saveCursorPosition);
  }
});

// 保存光标位置的函数
const saveCursorPosition = () => {
  if (!editorRef.value) return;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    // 保存当前选中的范围
    savedCursorRange = selection.getRangeAt(0).cloneRange();
  }
};

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
  document.removeEventListener("MSFullscreenChange", handleFullscreenChange);

  // 移除编辑器的blur事件监听器
  if (editorRef.value) {
    editorRef.value.removeEventListener("blur", saveCursorPosition);
  }
});

// 切换主题
const toggleTheme = () => {
  // 重新应用语法高亮以更新主题
  nextTick(() => {
    applySyntaxHighlighting();
  });
};

// 调用工具hooks
const {
  wordCount,
  isToolActive,
  findFontSize,
  updateWordCount,
  updateWordCountInSourceMode,
  updateLineNumbers,
  onSourceCodeScroll
} = useToolsHooks(ID.value, isSourceCodeMode, editorRef, sourceCodeRef, lineNumbersRef, sourceCodeEditorContainerRef);
provide("provideEditorRef", editorRef);
provide("provideSourceCodeRef", sourceCodeRef);
provide("updateLineNumbers", updateLineNumbers);
provide("saveToUndoStack", saveToUndoStack);
provide("undo", undo);
provide("redo", redo);
provide("toggleFullscreen", toggleFullscreen);

// 自动格式化代码
const autoFormatCode = (isFormat = true) => {
  try {
    if (!sourceCodeRef.value) return;
    const cursorPosition = sourceCodeRef.value.selectionStart;
    const content = sourceCodeRef.value.value;

    // 检查是否刚刚按下了回车键或正在编辑空行
    const wasNewLine = cursorPosition > 0 && content.charAt(cursorPosition - 1) === "\n";
    const nextChar = content.charAt(cursorPosition);
    const isEditingEmptyLine = wasNewLine && (nextChar === "\n" || nextChar === "");

    // 如果正在编辑空行，暂时不进行格式化，以保持用户的输入意图
    if (isEditingEmptyLine && !isFormat) {
      return;
    }
    // 使用 prettier 格式化代码，强制输出为一行
    const formattedContent = prettier.format(content, {
      printWidth: 9999, // 非常大的打印宽度，防止自动换行
      parser: "html",
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      preserveNewlines: false,
      htmlWhitespaceSensitivity: "ignore",
      endOfLine: "auto",
      wrapAttributes: "preserve", // 保持所有属性在同一行
      singleAttributePerLine: true, // 确保每个元素的属性都在同一行
      trailingComma: "none",
      bracketSpacing: true,
      bracketSameLine: true, // 确保结束标签与内容在同一行
      plugins: [prettierHtmlParser]
    });

    // 如果格式化后的内容和原始内容相同，直接返回
    if (formattedContent === content) {
      if (sourceCodeRef.value) {
        sourceCodeRef.value.style.width = `${(sourceCodeOverlayRef.value?.clientWidth || 0) + 5}px`;
        sourceCodeRef.value.style.height = `${sourceCodeOverlayRef.value?.clientHeight}px`;
      }
      return;
    }
    // 尝试保持光标位置
    // 使用更精确的算法来保持光标位置
    let newCursorPosition;

    if (wasNewLine) {
      // 如果刚刚按下了回车键，我们需要找出光标所在的行
      const linesBeforeCursor = content.substring(0, cursorPosition).split("\n");
      const lineNumber = linesBeforeCursor.length;

      // 在格式化后的内容中找到对应的行
      const formattedLines = formattedContent.split("\n");
      if (lineNumber <= formattedLines.length) {
        // 计算光标应该在的位置
        newCursorPosition = formattedLines.slice(0, lineNumber - 1).join("\n").length + 1;
      } else {
        // 如果行数不匹配，使用基于比例的算法
        const ratio = cursorPosition / content.length;
        newCursorPosition = Math.round(formattedContent.length * ratio);
      }
    } else {
      // 尝试找到与原始内容中相同的字符序列来定位光标
      const searchLength = 20;
      const startSearchIndex = Math.max(0, cursorPosition - searchLength);
      const searchString = content.substring(startSearchIndex, cursorPosition);

      // 在格式化后的内容中查找相同的字符序列
      const foundIndex = formattedContent.indexOf(searchString, startSearchIndex - 5);
      if (foundIndex !== -1) {
        newCursorPosition = foundIndex + searchString.length;
      } else {
        // 如果没有找到，使用基于比例的算法
        const ratio = cursorPosition / content.length;
        newCursorPosition = Math.round(formattedContent.length * ratio);
      }
    }

    // 确保光标位置在有效范围内
    newCursorPosition = Math.max(0, Math.min(newCursorPosition, formattedContent.length));

    // 更新内容
    sourceCodeRef.value.value = formattedContent;

    // 设置光标位置，使用setTimeout确保在内容更新后执行
    setTimeout(() => {
      if (sourceCodeRef.value) {
        sourceCodeRef.value.selectionStart = sourceCodeRef.value.selectionEnd = newCursorPosition;
      }
      // 应用语法高亮
      nextTick(() => {
        applySyntaxHighlighting();
        // 确保滚动位置同步
        onSourceCodeScroll();
        if (sourceCodeRef.value) {
          console.dir(sourceCodeOverlayRef.value?.clientWidth);
          sourceCodeRef.value.style.width = `${(sourceCodeOverlayRef.value?.clientWidth || 0) + 5}px`;
          sourceCodeRef.value.style.height = `${sourceCodeOverlayRef.value?.clientHeight}px`;
        }
      });
    }, 0);

    // 更新内容事件
    emit("update:modelValue", formattedContent);
    emit("change", formattedContent);

    // 更新字数和行号
    updateWordCountInSourceMode();
  } catch (error) {
    console.error("自动格式化失败:", error);
  }
};

// 创建防抖版本的自动格式化函数
const debouncedFormatCode = debounce(autoFormatCode, 500);

// @ -------------------------------------------------------------------- 执行编辑命令

// 内容变化事件
const onContentChange = () => {
  // 更新内容
  if (editorRef.value) {
    const content = editorRef.value.innerHTML;
    emit("update:modelValue", content);
    emit("change", content);
  }

  // 更新工具栏工具的激活状态
  editorToolsRef.value?.isToolActiveArrayFn();

  // 更新字数统计
  updateWordCount();
};
provide("onContentChange", onContentChange);

// 应用语法高亮
const applySyntaxHighlighting = () => {
  if (!sourceCodeRef.value || !sourceCodeOverlayRef.value) return;

  const content = sourceCodeRef.value.value;
  // 使用highlight.js对HTML代码进行语法高亮
  const highlighted = hljs.highlight(content, { language: "xml" }).value;
  // 更新高亮层内容
  sourceCodeOverlayRef.value.innerHTML = highlighted;

  // 获取所有需要切换主题的元素
  const sourceCodeContainer = sourceCodeRef.value.closest(".source-code-container");
  const lineNumbers = lineNumbersRef.value;
  const sourceCodeEditor = sourceCodeRef.value;
  const sourceCodeOverlay = sourceCodeOverlayRef.value;

  // 根据当前主题更新所有相关元素的类名
  if (isDarkTheme.value) {
    // 应用暗色主题
    sourceCodeContainer?.classList.add("dark-theme");
    lineNumbers?.classList.add("dark-theme");
    sourceCodeEditor.classList.add("dark-theme");
    sourceCodeOverlay.classList.add("dark-theme");

    // 移除浅色主题
    sourceCodeContainer?.classList.remove("light-theme");
    lineNumbers?.classList.remove("light-theme");
    sourceCodeEditor.classList.remove("light-theme");
    sourceCodeOverlay.classList.remove("light-theme");
  } else {
    // 应用浅色主题
    sourceCodeContainer?.classList.add("light-theme");
    lineNumbers?.classList.add("light-theme");
    sourceCodeEditor.classList.add("light-theme");
    sourceCodeOverlay.classList.add("light-theme");

    // 移除暗色主题
    sourceCodeContainer?.classList.remove("dark-theme");
    lineNumbers?.classList.remove("dark-theme");
    sourceCodeEditor.classList.remove("dark-theme");
    sourceCodeOverlay.classList.remove("dark-theme");
  }

  // 内容更新后立即同步滚动位置
  onSourceCodeScroll();
};

// 源码编辑内容变化事件
const onSourceCodeChange = () => {
  // 更新内容
  if (sourceCodeRef.value) {
    const content = sourceCodeRef.value.value;

    // 立即更新内容，确保用户能看到即时变化
    emit("update:modelValue", content);
    emit("change", content);
  }

  // 更新字数统计
  updateWordCountInSourceMode();

  // 应用语法高亮
  nextTick(() => {
    applySyntaxHighlighting();

    // 在高亮内容更新后再次同步滚动位置
    onSourceCodeScroll();
  });

  // 自动格式化代码（防抖）
  debouncedFormatCode();
};

// 设置编辑器内容
const debounceEditorContent = (content: string) => {
  // 将内容包裹在div标签中
  let wrappedContent = content;
  if (content && !content.trim().startsWith("<div") && !content.trim().startsWith("<!DOCTYPE")) {
    wrappedContent = `<div style="color: #1d1d1d;">${content}
      <p>&nbsp;</p>
      </div>`;
  }

  if (editorRef.value && isSourceCodeMode.value !== "code") {
    editorRef.value.innerHTML = wrappedContent;
    updateWordCount();
  }

  // 同时更新源码编辑器内容
  if (sourceCodeRef.value) {
    sourceCodeRef.value.value = wrappedContent;
  }
};

const setEditorContent = debounce(debounceEditorContent, 500);

// 监听modelValue变化
watch(
  () => props.modelValue,
  newVal => {
    if (editorRef.value && editorRef.value.innerHTML !== newVal && isSourceCodeMode.value !== "code") {
      setEditorContent(newVal);
    }
  },
  { immediate: true, deep: true }
);

// 处理Enter键事件
// function keyEnter(e: KeyboardEvent) {
//   if (isSourceCodeMode.value === "code") return;
//   if (e.key === "Enter") {
//     // 阻止默认行为
//   }
// }

// 添加新值
// const addNewVal = () => {
//   // 创建一个新的段落
//   const p = document.createElement("p");
//   p.innerHTML = "&nbsp;";

//   // 插入新的段落
//   const selection = window.getSelection();
//   if (selection && selection.rangeCount > 0) {
//     const range = selection.getRangeAt(0);
//     range.deleteContents();
//     range.insertNode(p);
//     range.setStart(p, 0);
//     range.collapse(true);
//     selection.removeAllRanges();
//     selection.addRange(range);
//   }
// };

// 粘贴事件
const onPaste = (e: ClipboardEvent) => {
  // 阻止默认行为
  e.preventDefault();

  // 获取粘贴的内容
  const text = e.clipboardData?.getData("text/plain") || "";

  // 插入内容
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // 更新内容
  onContentChange();
};

// 处理表格右键菜单显示
const handleContextMenu = (e: MouseEvent) => {
  // 检查点击的是否是表格单元格
  const target = e.target as HTMLElement;
  const tableElement = target.closest("td, th") as HTMLTableCellElement;
  const imgElement = target.closest("img") as HTMLImageElement;

  if (tableElement) {
    // 如果不是点击表格单元格，调用图片右键菜单处理
    editTableRef.value?.handleContextMenu(e);
  } else if (imgElement) {
    // 如果不是点击表格单元格，调用图片右键菜单处理
    editImageRef.value?.handleContextMenu(e);
  }
};

// 组件挂载事件
onMounted(() => {
  setEditorContent(props.modelValue);

  // 设置初始内容
  // if (editorRef.value) {
  //   if (props.modelValue) {
  //     setEditorContent(props.modelValue);
  //   }

  // // 在编辑器最后一行添加空段落
  // const p = document.createElement("p");
  // p.innerHTML = "&nbsp;";
  // editorRef.value.appendChild(p);
  // }

  // 支持placeholder
  // if (editorRef.value && props.placeholder) {
  //   if (editorRef.value.innerHTML === "") {
  //     editorRef.value.innerHTML = `<span class="placeholder">${props.placeholder}</span>`;
  //   }

  //   // 点击编辑器时移除placeholder
  //   const handleClick = () => {
  //     const placeholder = editorRef.value?.querySelector(".placeholder");
  //     if (placeholder) {
  //       placeholder.remove();
  //     }
  //   };

  //   editorRef.value.addEventListener("click", handleClick);
  // }

  // 添加事件监听
  // document.addEventListener("keydown", keyEnter);
});

function getEditorValue() {
  return editorRef.value?.innerHTML || "";
}

function insertTextAtCursor(text: string) {
  console.log("++++++++++> text:", text);
  editorRef.value?.focus?.();
  const selection = window.getSelection();
  if (selection) {
    try {
      // 如果有保存的光标位置，则恢复它
      if (savedCursorRange && editorRef.value?.contains(savedCursorRange.startContainer)) {
        selection.removeAllRanges();
        selection.addRange(savedCursorRange);
      }

      // 如果没有有效的选择范围，创建一个新的范围
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

      // 插入文本
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      console.error("恢复光标位置或插入文本失败:", error);
      // 如果恢复失败，使用默认行为
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

// 暴露方法
defineExpose({
  setEditorValue: setEditorContent,
  getEditorValue,
  insertTextAtCursor
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
