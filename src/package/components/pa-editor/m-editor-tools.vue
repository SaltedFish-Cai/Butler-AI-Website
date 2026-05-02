<template>
  <div class="editor-toolbar">
    <template v-for="tool in toolbarTools" :key="tool.command">
      <pa-popover
        v-if="tool.children?.length || tool.command == 'backColor' || tool.command == 'foreColor' || tool.command == 'createLink'"
        :ref="ref => (popoverReferenceRef[tool.command] = ref)"
        :popover-class="'pa-editor-toolbar'"
        trigger="click"
        :disabled="isSourceCodeMode != 'edit'"
        @change="
          value => {
            popoverVisible = value;
            emit('popverChange', value);
          }
        "
      >
        <template #reference>
          <button
            :class="[
              tool.command == 'unorderedLst' || tool.command == 'backColor' || tool.command == 'createLink' ? 'ml15' : '',
              tool.isActive ? 'active' : ''
            ]"
            :title="tool.title"
            :disabled="isSourceCodeMode != 'edit'"
            :style="
              isSourceCodeMode == 'edit'
                ? {
                    width: tool.command == 'fontSizeArray' ? '60px' : '',
                    color: tool.foreColor,
                    backgroundColor: `${tool.backColor} !important`,
                    '--icon-color': tool.foreColor || (tool.command == 'formatBlockArray' ? '' : 'inherit')
                  }
                : {}
            "
          >
            <template v-if="tool.command == 'fontSizeArray'">{{ tool.icon }}</template>
            <pa-icon v-else :name="tool.icon"></pa-icon>
          </button>
        </template>
        <pa-color-item
          v-if="tool.command == 'foreColor'"
          :value="tool.value"
          @change="value => throttleExecuteCommand(tool.command, value)"
          :presetColors="presetColors"
        >
        </pa-color-item>
        <pa-color-item
          v-else-if="tool.command == 'backColor'"
          :value="tool.value"
          @change="value => throttleExecuteCommand(tool.command, value)"
          :presetColors="presetColors"
        >
        </pa-color-item>
        <div class="pa-editor-toolbar_input" v-else-if="tool.command == 'createLink'">
          <input
            v-model="tool.linkString"
            placeholder="请输入链接"
            @mousedown="executeCommand(tool.command, true)"
            @blur="executeCommand(tool.command, false)"
          />
          <div
            @click="
              executeCommand('confirmLink', tool.linkString);
              popoverReferenceRef?.[tool.command]?.hidePopover();
            "
          >
            确认
          </div>
          <div
            class="pa-editor-toolbar_input-del"
            @click="
              executeCommand('deleteLink', tool.linkString);
              popoverReferenceRef?.[tool.command]?.hidePopover();
            "
            @mouseover="executeCommand('createLink', true)"
          >
            删除
          </div>
        </div>
        <div v-else class="pa-editor-toolbar_array">
          <template v-for="child in tool.children" :key="child.command + child.value">
            <button
              v-if="child.command == 'fontSize'"
              :class="{ active: child.isActive }"
              :disabled="isSourceCodeMode != 'edit'"
              @click="executeCommand(child.command, child.value)"
              :title="child.title"
            >
              {{ child.title }}
            </button>
            <button
              v-else
              :class="{ active: child.isActive }"
              :disabled="isSourceCodeMode != 'edit'"
              @click="executeCommand(child.command, child.value)"
              :title="child.title"
            >
              <pa-icon :name="child.icon"></pa-icon>
            </button>
          </template>
        </div>
      </pa-popover>
      <button
        v-else-if="tool.command == 'insertImage'"
        :title="tool.title"
        class="file_upload-btn"
        :disabled="isSourceCodeMode != 'edit'"
      >
        <pa-icon :name="tool.icon"></pa-icon>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          :disabled="isSourceCodeMode != 'edit'"
          :multiple="config?.uploadImage?.fileMultiple ? config.uploadImage.fileMultiple > 1 : false"
          class="file_upload-btn_inner"
          @change="fileChange"
        />
      </button>
      <button
        v-else
        :class="[
          tool.command == 'bold' ||
          tool.command == 'justifyLeft' ||
          tool.command == 'unorderedLst' ||
          tool.command == 'undo' ||
          tool.command == 'sourceCode' ||
          tool.command == 'removeFormat'
            ? 'ml15'
            : '',
          tool.isActive ? 'active' : ''
        ]"
        @click="executeCommand(tool.command, tool.value)"
        :title="tool.title"
        :disabled="
          (isSourceCodeMode == 'code' && tool.command != 'sourceCode') ||
          (isSourceCodeMode == 'visible' && tool.command != 'visible')
        "
      >
        <pa-icon :name="tool.icon"></pa-icon>
      </button>
    </template>
    <template v-if="exButton">
      <button
        v-for="tool in exButton"
        :key="tool.name"
        :class="[tool.isActive ? 'active' : '']"
        @click="tool.target()"
        :title="tool.name"
        :disabled="isSourceCodeMode == 'code' || isSourceCodeMode == 'visible'"
      >
        <pa-icon :name="tool.icon"></pa-icon>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, inject, nextTick, onMounted, onUnmounted, ref, Ref } from "vue";
import type { ComponentProps, ComponentEmits, ComponentTool } from "./types";
import { toolsConfig } from "./tools-config";
import { useUpFileHooks } from "./use-upfile-hooks";
import type { PancakeGlobalConfigType } from "../pa-manager/types";
import _ from "lodash";

const { throttle } = _;

/**
 * @description 组件 props 类型定义
 */
interface MEditorToolsProps extends ComponentProps {
  id: string;
  isSourceCodeMode: "code" | "edit" | "visible";
  isToolActive: (tool: ComponentTool) => boolean;
  findFontSize: () => string;
  autoFormatCode: (isFormat: boolean) => void;
  applySyntaxHighlighting: () => void;
}

/**
 * @description 组件 props
 */
const props = withDefaults(defineProps<MEditorToolsProps>(), { isSourceCodeMode: "edit" });

/**
 * @description 源码模式状态
 */
const sourceCodeMode = ref(props.isSourceCodeMode);

/**
 * @description 组件事件定义
 */
const emit = defineEmits<ComponentEmits>();

/**
 * @description 全局配置注入
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * @description 文件输入引用
 */
const fileInput = ref();

/**
 * @description 弹出层引用字典
 */
const popoverReferenceRef = ref({});

/**
 * @description 预设颜色数组
 */
const presetColors = ["#64605b", "#67c23a", "#e6a23c", "#f56c6c", "#909399", "#bdbdc0", "#f9f8fd", "#ffffff"];

/**
 * @description 编辑器引用注入
 */
const injectEditorRef = inject("provideEditorRef") as Ref<any>;

/**
 * @description 源码编辑器引用注入
 */
const injectSourceCodeRef = inject("provideSourceCodeRef") as Ref<any>;

/**
 * @description 更新行号函数注入
 */
const updateLineNumbers = inject("updateLineNumbers") as () => void;

/**
 * @description 文件上传钩子
 */
const { fileChange } = useUpFileHooks(props, fileInput, PancakeGlobalConfig, injectEditorRef);

/**
 * @description 工具栏配置数据
 */
const toolbarTools: Ref<ComponentTool[]> = ref(toolsConfig);

/**
 * @description 弹出层可见状态
 */
const popoverVisible = ref(false);

/**
 * @description 内容变化函数注入
 */
const onContentChange = inject("onContentChange") as () => void;

/**
 * @description 编辑器引用
 */
const editorRef = inject("provideEditorRef") as Ref<HTMLDivElement | null>;

/**
 * @description 更新工具栏工具的激活状态
 */
function isToolActiveArrayFn(): void {
  if (!toolbarTools.value) return;
  toolbarTools.value.forEach(tool => {
    if (tool.children && tool.children.length > 0) {
      tool.children.forEach(child => {
        if (child.command !== "fontSize") {
          child.isActive = props.isToolActive(child);
        }
      });
    } else {
      if (tool.command !== "fontSizeArray" && tool.command !== "formatBlockArray") {
        tool.isActive = props.isToolActive(tool);
      }
    }
    if (tool.command === "fontSizeArray") {
      const currentFontSize = props.findFontSize();
      if (tool.children) {
        tool.children.forEach(fontSize => {
          fontSize.isActive = currentFontSize === fontSize.value;
        });
      }
    }
  });
}

/**
 * @description 判断选中文本是否充满父元素内容
 * @returns 包含是否充满和父元素的信息
 */
function isSelectedTextFullTagContent(): { isFull: boolean; parentElement: any } {
  const selection = typeof window !== "undefined" ? window.getSelection() : null();
  if (!selection || selection.rangeCount === 0) {
    return { isFull: false, parentElement: null };
  }
  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();
  if (!selectedText) {
    return { isFull: false, parentElement: null };
  }
  let parentElement: any = range.commonAncestorContainer;
  if (parentElement.nodeType === Node.TEXT_NODE) {
    parentElement = parentElement.parentNode;
  }
  if (!parentElement || !(parentElement instanceof Element)) {
    return { isFull: false, parentElement: null };
  }
  const parentTextContent = parentElement.textContent?.trim() || "";
  const isFull = selectedText === parentTextContent;
  return { isFull, parentElement };
}

/**
 * @description 链接元素引用
 */
let linkElement: any = null;

/**
 * @description 撤销函数注入
 */
const saveToUndoStack = inject("saveToUndoStack") as () => void;

/**
 * @description 撤销函数注入
 */
const undo = inject("undo") as () => void;

/**
 * @description 恢复函数注入
 */
const redo = inject("redo") as () => void;

/**
 * @description 全屏切换函数注入
 */
const toggleFullscreen = inject("toggleFullscreen") as () => void;

/**
 * @description 执行编辑命令
 * @param command - 命令名称
 * @param value - 命令参数
 */
function executeCommand(command: string, value?: any): void {
  if (
    !editorRef.value &&
    ![
      "sourceCode",
      "insertTable",
      "insertTableRow",
      "insertTableColumn",
      "deleteTableRow",
      "deleteTableColumn",
      "undo",
      "redo"
    ].includes(command)
  )
    return;
  editorRef.value?.focus?.();
  if (command === "undo") {
    undo();
    return;
  }
  if (command === "redo") {
    redo();
    return;
  }
  if (command === "backColor" && value) {
    saveToUndoStack();
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = value;
      try {
        if (!range.collapsed) {
          const { isFull, parentElement }: any = isSelectedTextFullTagContent();
          if (isFull && parentElement) {
            parentElement.style.backgroundColor = value;
            const newRange = document.createRange();
            setTimeout(() => {
              newRange.setStart(parentElement, 0);
              newRange.setEnd(parentElement, 1);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }, 0);
          } else {
            range.surroundContents(span);
            const newRange = document.createRange();
            newRange.setStart(span, 0);
            newRange.setEnd(span, 1);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      } catch (error) {
        console.error("设置背景色失败:", error);
      }
    }
    return;
  } else if (command === "foreColor" && value) {
    saveToUndoStack();
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.color = value;
      span.style.backgroundColor = "inherit";
      try {
        if (!range.collapsed) {
          const { isFull, parentElement }: any = isSelectedTextFullTagContent();
          if (isFull && parentElement) {
            parentElement.style.color = value;
            const newRange = document.createRange();
            setTimeout(() => {
              newRange.setStart(parentElement, 0);
              newRange.setEnd(parentElement, 1);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }, 0);
          } else {
            range.surroundContents(span);
            const newRange = document.createRange();
            newRange.setStart(span, 0);
            newRange.setEnd(span, 1);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      } catch (error) {
        console.error("设置字体颜色失败:", error);
      }
    }
    return;
  } else if (command === "fontSize" && value) {
    saveToUndoStack();
    document.execCommand("formatBlock", false, "<p>");
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = value;
      try {
        if (!range.collapsed) {
          const { isFull, parentElement }: any = isSelectedTextFullTagContent();
          if (isFull && parentElement) {
            parentElement.style.fontSize = value;
          } else {
            range.surroundContents(span);
          }
          const newRange = document.createRange();
          newRange.setStart(span, 0);
          newRange.setEnd(span, 1);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          span.innerHTML = "&nbsp;";
          range.insertNode(span);
          const newRange = document.createRange();
          newRange.setStartAfter(span);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      } catch (error) {
        console.error("设置字体大小失败:", error);
      }
    }
  } else if (command === "createLink") {
    saveToUndoStack();
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let currentElement: any = range.startContainer;
      if (currentElement.nodeType === 3) {
        currentElement = currentElement.parentElement;
      }
      if (currentElement.tagName === "A") {
        linkElement = currentElement;
      } else {
        const a = document.createElement("a");
        a.target = "_blank";
        try {
          if (!range.collapsed) {
            range.surroundContents(a);
            linkElement = a;
          }
        } catch (error) {
          console.error("设置链接失败:", error);
        }
      }
    }
    return;
  } else if (command === "confirmLink") {
    saveToUndoStack();
    if (linkElement && linkElement.tagName === "A") {
      linkElement.title = value;
      linkElement.href = value;
    }
  } else if (command === "deleteLink") {
    saveToUndoStack();
    if (linkElement && linkElement.tagName === "A") {
      try {
        const textContent = linkElement.textContent || "";
        const textNode = document.createTextNode(textContent);
        if (linkElement.parentNode) {
          linkElement.parentNode.replaceChild(textNode, linkElement);
        }
        linkElement = null;
      } catch (error) {
        console.error("删除链接失败:", error);
        document.execCommand("unlink");
        linkElement = null;
      }
    }
  } else if (command === "insertTable") {
    saveToUndoStack();
    const { rows = 3, cols = 3 } = typeof value === "object" ? value : {};
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      try {
        const boxDiv = document.createElement("div");
        boxDiv.style.display = "inline-block";
        boxDiv.style.maxWidth = "100%";
        boxDiv.style.overflow = "auto";
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "fit-content";
        const tableBody = document.createElement("tbody");
        table.appendChild(tableBody);
        boxDiv.appendChild(table);
        for (let i = 0; i < rows; i++) {
          const tr = document.createElement("tr");
          for (let j = 0; j < cols; j++) {
            const td = document.createElement("td");
            td.style.border = "1px solid var(--pa-color-border)";
            td.style.padding = "8px";
            td.style.textAlign = "left";
            td.style.minWidth = "100px";
            td.innerHTML = "&nbsp;";
            tr.appendChild(td);
          }
          tableBody.appendChild(tr);
        }
        range.insertNode(boxDiv);
        const p = document.createElement("p");
        p.innerHTML = "&nbsp;";
        boxDiv.parentNode?.insertBefore(p, table.nextSibling);
        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } catch (error) {
        console.error("插入表格失败:", error);
      }
    }
  } else if (command === "sourceCode") {
    sourceCodeMode.value = sourceCodeMode.value === "edit" ? "code" : "edit";
    emit("sourceCodeModeChange", sourceCodeMode.value);
    if (sourceCodeMode.value === "code") {
      if (editorRef.value && injectSourceCodeRef.value) {
        injectSourceCodeRef.value.value = editorRef.value.innerHTML;
        updateLineNumbers();
        props.autoFormatCode(true);
        nextTick(() => {
          props.applySyntaxHighlighting();
        });
      }
    } else {
      if (injectSourceCodeRef.value && editorRef.value) {
        editorRef.value.innerHTML = injectSourceCodeRef.value.value;
        onContentChange();
      }
    }
    isToolActiveArrayFn();
    return;
  } else if (command === "visible") {
    sourceCodeMode.value = sourceCodeMode.value === "edit" ? "visible" : "edit";
    emit("sourceCodeModeChange", sourceCodeMode.value);
    isToolActiveArrayFn();
    return;
  } else if (command === "fullscreen") {
    toggleFullscreen();
    return;
  } else {
    if (
      [
        "formatBlock",
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "insertUnorderedList",
        "insertOrderedList",
        "indent",
        "outdent",
        "insertImage"
      ].includes(command)
    ) {
      saveToUndoStack();
    }
    document.execCommand(command, false, value);
  }
  onContentChange();
  editorRef.value?.focus?.();
}

const throttleExecuteCommand = throttle(executeCommand, 1);

/**
 * @description 组件挂载时添加事件监听
 */
onMounted(() => {
  document.addEventListener("mouseup", isToolActiveArrayFn);
  document.addEventListener("keyup", isToolActiveArrayFn);
});

/**
 * @description 组件卸载时移除事件监听
 */
onUnmounted(() => {
  document.removeEventListener("mouseup", isToolActiveArrayFn);
  document.removeEventListener("keyup", isToolActiveArrayFn);
});

defineExpose({
  isToolActiveArrayFn
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
