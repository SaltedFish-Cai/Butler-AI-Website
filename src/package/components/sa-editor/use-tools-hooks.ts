import { ref, Ref } from "vue";
import { Tool } from "./type";

export const useToolsHooks = (
  id: string,
  isSourceCodeMode: Ref<"code" | "edit" | "visible">,
  editorRef: Ref<any>,
  sourceCodeRef: Ref<any>,
  lineNumbersRef: Ref<any>,
  sourceCodeEditorContainerRef: Ref<any>
) => {
  const wordCount = ref(0);

  // 检查工具是否激活
  function isToolActive(tool: Tool): boolean {
    if (tool.command === "sourceCode") {
      // 源码编辑模式的激活状态
      return isSourceCodeMode.value === "code";
    } else if (tool.command === "visible") {
      // 可见编辑模式的激活状态
      return isSourceCodeMode.value === "visible";
    } else if (tool.command === "formatBlock") {
      const block = document.queryCommandValue("formatBlock");
      return block === tool.value?.replace(/[<>]/g, "");
    } else if (tool.command === "backColor") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // 获取当前元素
        let currentElement: any = range.startContainer;
        if (currentElement.nodeType === 3) {
          currentElement = currentElement.parentElement;
        }

        // 查找最近的带有背景色的父元素
        while (currentElement && currentElement !== editorRef.value) {
          if (currentElement.style.backgroundColor) {
            const bgColor = currentElement.style.backgroundColor;
            // 比较背景色，确保格式一致
            return (
              bgColor.toLowerCase() === tool.value?.toLowerCase() ||
              bgColor.replace(/\s/g, "").toLowerCase() === tool.value?.replace(/\s/g, "").toLowerCase()
            );
          }
          currentElement = currentElement.parentElement;
        }

        // 如果没有找到背景色，默认是白色
        return tool.value === "#FFFFFF";
      }
      return false;
    } else if (tool.command === "foreColor") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // 获取当前元素
        let currentElement: any = range.startContainer;
        if (currentElement.nodeType === 3) {
          currentElement = currentElement.parentElement;
        }

        // 查找最近的带有字体颜色的父元素
        while (currentElement && currentElement !== editorRef.value) {
          if (currentElement.style.color) {
            const fontColor = currentElement.style.color;
            // 比较字体颜色，确保格式一致
            return (
              fontColor.toLowerCase() === tool.value?.toLowerCase() ||
              fontColor.replace(/\s/g, "").toLowerCase() === tool.value?.replace(/\s/g, "").toLowerCase()
            );
          }
          currentElement = currentElement.parentElement;
        }

        // 如果没有找到字体颜色，默认是黑色
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

  function findFontSize() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // 获取当前元素
      let currentElement: any = range.startContainer;
      if (currentElement.nodeType === 3) {
        currentElement = currentElement.parentElement;
      }

      // 查找最近的带有字体大小的父元素
      while (currentElement && currentElement !== editorRef.value) {
        if (currentElement.style.fontSize) {
          const fontSize = currentElement.style.fontSize;
          // 比较字体大小，确保格式一致
          return fontSize;
        }
        currentElement = currentElement.parentElement;
      }
      // 如果没有找到字体大小，默认是14px
      return "14px";
    }
    return "14px";
  }

  function findLinkeText() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // 获取当前元素
      let currentElement: any = range.startContainer;
      if (currentElement.nodeType === 3) {
        currentElement = currentElement.parentElement;
      }
      return currentElement.tagName === "A";
    }
    return false;
  }

  // 更新字数统计
  function updateWordCount() {
    if (!editorRef.value) return;

    // 获取编辑器内容
    const content = editorRef.value.innerText || editorRef.value.textContent || "";

    // 计算字数
    wordCount.value = content.length;

    setContentBaseStyle();
  }

  function setContentBaseStyle() {
    if (!document?.querySelector) return;
    const content = document.querySelector(`#${id} #editor-content`);
    if (!content?.childNodes) return;
    setNode(content);
    function setNode(content) {
      // 使用Array.from将childNodes转换为数组，避免在遍历过程中修改DOM导致的问题
      const nodes: any = Array.from(content.childNodes);
      for (const node of nodes) {
        if (node.nodeName === "P") {
          node.style.margin = node.style.margin || "0";
          // node.style.lineHeight = node.style.lineHeight || "initial";
          // node.style.color = node.style.color || "#1d1d1d";
        } else if (node.nodeName === "IMG") {
          node.style.display = node.style.display || "initial";
        }
        // else if (node.nodeName === "#text" && level === 0) {
        //   // 如果文本内容不为空，则包裹在span标签中
        //   if (node.nodeValue && node.nodeValue.trim() !== "") {
        //     const parent = node.parentNode;
        //     if (parent) {
        //       const span = document.createElement("span");
        //       span.textContent = node.nodeValue;
        //       span.style.color = span.style.color || "#1d1d1d";
        //       parent.replaceChild(span, node);

        //       continue;
        //     }
        //   }
        // } else if (node.nodeName === "DIV" && level === 0) {
        //   node.style.color = node.style.color || "#1d1d1d";
        // }

        // 递归处理子节点
        if (node.childNodes && node.childNodes.length > 0) {
          setNode(node);
        }
      }
    }
  }

  // 更新行号
  const updateLineNumbers = () => {
    if (!sourceCodeRef.value || !lineNumbersRef.value) return;

    const content = sourceCodeRef.value.value;
    const lines = content.split("\n");
    const lineCount = lines.length - 1;

    let lineNumbersHTML = "";
    for (let i = 1; i <= lineCount; i++) {
      lineNumbersHTML += `<div class="line-number">${i}</div>`;
    }

    lineNumbersRef.value.innerHTML = lineNumbersHTML;
  };

  // 处理源码编辑器滚动事件
  const onSourceCodeScroll = () => {
    if (!sourceCodeEditorContainerRef.value) return;

    // 同步行号滚动
    if (lineNumbersRef.value) {
      lineNumbersRef.value.style.marginTop = `-${sourceCodeEditorContainerRef.value.scrollTop}px`;
    }
  };

  // 更新源码模式下的字数统计
  const updateWordCountInSourceMode = () => {
    if (!sourceCodeRef.value) return;

    // 获取源码内容
    const content = sourceCodeRef.value.value || "";

    // 计算纯文本字数（去除HTML标签）
    const textContent = content.replace(/<[^>]*>/g, "");
    wordCount.value = textContent.length;

    // 更新行号
    updateLineNumbers();
  };

  return {
    wordCount,
    isToolActive,
    updateWordCount,
    updateWordCountInSourceMode,
    updateLineNumbers,
    onSourceCodeScroll,
    findFontSize
  };
};
