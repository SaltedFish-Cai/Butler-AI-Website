/**
 * @description 导入 Vue 相关类型
 */
import { ref, Ref } from "vue";
/**
 * @description 导入工具类型
 */
import type { ComponentTool } from "./types";

/**
 * @description 工具操作钩子函数
 * @param id - 编辑器 ID
 * @param isSourceCodeMode - 源码模式状态引用
 * @param editorRef - 编辑器引用
 * @param sourceCodeRef - 源码编辑器引用
 * @param lineNumbersRef - 行号引用
 * @param sourceCodeEditorContainerRef - 源码编辑器容器引用
 * @returns 工具操作相关方法
 */
export function useToolsHooks(
  id: string,
  isSourceCodeMode: Ref<"code" | "edit" | "visible">,
  editorRef: Ref<any>,
  sourceCodeRef: Ref<any>,
  lineNumbersRef: Ref<any>,
  sourceCodeEditorContainerRef: Ref<any>
) {
  /**
   * @description 字数统计
   */
  const wordCount = ref(0);

  /**
   * @description 检查工具是否激活
   * @param tool - 工具配置
   * @returns 是否激活
   */
  function isToolActive(tool: ComponentTool): boolean {
    if (tool.command === "sourceCode") {
      return isSourceCodeMode.value === "code";
    } else if (tool.command === "visible") {
      return isSourceCodeMode.value === "visible";
    } else if (tool.command === "formatBlock") {
      const block = document.queryCommandValue("formatBlock");
      return block === tool.value?.replace(/[<>]/g, "");
    } else if (tool.command === "backColor") {
      const selection = typeof window !== "undefined" ? window.getSelection() : null();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let currentElement: any = range.startContainer;
        if (currentElement.nodeType === 3) {
          currentElement = currentElement.parentElement;
        }
        while (currentElement && currentElement !== editorRef.value) {
          if (currentElement.style.backgroundColor) {
            const bgColor = currentElement.style.backgroundColor;
            return (
              bgColor.toLowerCase() === tool.value?.toLowerCase() ||
              bgColor.replace(/\s/g, "").toLowerCase() === tool.value?.replace(/\s/g, "").toLowerCase()
            );
          }
          currentElement = currentElement.parentElement;
        }
        return tool.value === "#FFFFFF";
      }
      return false;
    } else if (tool.command === "foreColor") {
      const selection = typeof window !== "undefined" ? window.getSelection() : null();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let currentElement: any = range.startContainer;
        if (currentElement.nodeType === 3) {
          currentElement = currentElement.parentElement;
        }
        while (currentElement && currentElement !== editorRef.value) {
          if (currentElement.style.color) {
            const fontColor = currentElement.style.color;
            return (
              fontColor.toLowerCase() === tool.value?.toLowerCase() ||
              fontColor.replace(/\s/g, "").toLowerCase() === tool.value?.replace(/\s/g, "").toLowerCase()
            );
          }
          currentElement = currentElement.parentElement;
        }
        return tool.value === "#000000";
      }
      return false;
    } else if (tool.command === "fontSize") {
      if (findFontSize() === tool.value) {
        return true;
      }
    } else if (tool.command === "createLink") {
      if (findLinkeText()) {
        return true;
      }
    }
    return document.queryCommandState(tool.command);
  }

  /**
   * @description 查找当前字体大小
   * @returns 字体大小字符串
   */
  function findFontSize(): string {
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let currentElement: any = range.startContainer;
      if (currentElement.nodeType === 3) {
        currentElement = currentElement.parentElement;
      }
      while (currentElement && currentElement !== editorRef.value) {
        if (currentElement.style.fontSize) {
          return currentElement.style.fontSize;
        }
        currentElement = currentElement.parentElement;
      }
      return "14px";
    }
    return "14px";
  }

  /**
   * @description 查找链接文本
   * @returns 是否在链接中
   */
  function findLinkeText(): boolean {
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let currentElement: any = range.startContainer;
      if (currentElement.nodeType === 3) {
        currentElement = currentElement.parentElement;
      }
      return currentElement.tagName === "A";
    }
    return false;
  }

  /**
   * @description 设置内容基础样式
   */
  function setContentBaseStyle(): void {
    if (!document?.querySelector) return;
    const content = document.querySelector(`#${id} #editor-content`);
    if (!content?.childNodes) return;
    setNode(content);
    function setNode(content: any): void {
      const nodes: any = Array.from(content.childNodes);
      for (const node of nodes) {
        if (node.nodeName === "P") {
          node.style.margin = node.style.margin || "0";
        } else if (node.nodeName === "IMG") {
          node.style.display = node.style.display || "initial";
        }
        if (node.childNodes && node.childNodes.length > 0) {
          setNode(node);
        }
      }
    }
  }

  /**
   * @description 更新字数统计
   */
  function updateWordCount(): void {
    if (!editorRef.value) return;
    const content = editorRef.value.innerText || editorRef.value.textContent || "";
    wordCount.value = content.length;
    setContentBaseStyle();
  }

  /**
   * @description 更新行号
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
   * @description 处理源码编辑器滚动事件
   */
  function onSourceCodeScroll(): void {
    if (!sourceCodeEditorContainerRef.value) return;
    if (lineNumbersRef.value) {
      lineNumbersRef.value.style.marginTop = `-${sourceCodeEditorContainerRef.value.scrollTop}px`;
    }
  }

  /**
   * @description 更新源码模式下的字数统计
   */
  function updateWordCountInSourceMode(): void {
    if (!sourceCodeRef.value) return;
    const content = sourceCodeRef.value.value || "";
    const textContent = content.replace(/<[^>]*>/g, "");
    wordCount.value = textContent.length;
    updateLineNumbers();
  }

  return {
    wordCount,
    isToolActive,
    updateWordCount,
    updateWordCountInSourceMode,
    updateLineNumbers,
    onSourceCodeScroll,
    findFontSize
  };
}
