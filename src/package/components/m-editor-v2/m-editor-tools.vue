<template>
  <div class="editor-toolbar">
    <template v-for="tool in toolbarTools" :key="tool.command">
      <m-popover-v2
        v-if="tool.children?.length || tool.command == 'backColor' || tool.command == 'foreColor' || tool.command == 'createLink'"
        :ref="ref => (popoverReferenceRef[tool.command] = ref)"
        :popover-class="'m-editor-v2-toolbar'"
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
            <!-- {{ tool.icon }} -->
            <template v-if="tool.command == 'fontSizeArray'">{{ tool.icon }}</template>
            <m-icon-v2 v-else :name="tool.icon"></m-icon-v2>
          </button>
        </template>

        <m-color-v2-item
          v-if="tool.command == 'foreColor'"
          :value="tool.value"
          @change="value => throttleExecuteCommand(tool.command, value)"
          :presetColors="presetColors"
        ></m-color-v2-item>
        <m-color-v2-item
          v-else-if="tool.command == 'backColor'"
          :value="tool.value"
          @change="value => throttleExecuteCommand(tool.command, value)"
          :presetColors="presetColors"
        ></m-color-v2-item>

        <div class="m-editor-v2-toolbar_input" v-else-if="tool.command == 'createLink'">
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
            class="m-editor-v2-toolbar_input-del"
            @click="
              executeCommand('deleteLink', tool.linkString);
              popoverReferenceRef?.[tool.command]?.hidePopover();
            "
            @mouseover="executeCommand('createLink', true)"
          >
            删除
          </div>
        </div>

        <div v-else class="m-editor-v2-toolbar_array">
          <template v-for="child in tool.children" :key="child.command + child.value">
            <!-- <div v-if="child.command == 'backColor' || child.command == 'foreColor'">
              <button
                :style="
                  isSourceCodeMode == 'edit'
                    ? {
                        backgroundColor: `${child.value} !important`,
                        color: child.command == 'foreColor' ? child.value : 'transparent'
                      }
                    : {}
                "
                :disabled="isSourceCodeMode != 'edit'"
                class="color-block"
                @mousedown.prevent="executeCommand(child.command, child.value)"
              ></button>
            </div> -->
            <button
              v-if="child.command == 'fontSize'"
              :class="{ active: child.isActive }"
              :disabled="isSourceCodeMode != 'edit'"
              @click="executeCommand(child.command, child.value)"
              :title="child.title"
            >
              <!-- {{ tool.icon }} -->
              {{ child.title }}
            </button>

            <button
              v-else
              :class="{ active: child.isActive }"
              :disabled="isSourceCodeMode != 'edit'"
              @click="executeCommand(child.command, child.value)"
              :title="child.title"
            >
              <!-- {{ tool.icon }} -->
              <m-icon-v2 :name="child.icon"></m-icon-v2>
            </button>
          </template>
        </div>
      </m-popover-v2>

      <button
        v-else-if="tool.command == 'insertImage'"
        :title="tool.title"
        class="file_upload-btn"
        :disabled="isSourceCodeMode != 'edit'"
      >
        <m-icon-v2 :name="tool.icon"></m-icon-v2>
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
        <!-- {{ tool.icon }} -->
        <m-icon-v2 :name="tool.icon"></m-icon-v2>
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
        <!-- {{ tool.icon }} -->
        <m-icon-v2 :name="tool.icon"></m-icon-v2>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, inject, nextTick, onMounted, onUnmounted, ref, Ref } from "vue";
import { MEditorV2Type, Tool } from "./type";
import { toolsConfig } from "./tools-config";
import { useUpFileHooks } from "./use-upfile-hooks";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";
import { throttle } from "lodash";

const props = withDefaults(
  defineProps<
    MEditorV2Type & {
      id: string;
      isSourceCodeMode: "code" | "edit" | "visible";
      isToolActive: (tool: Tool) => boolean;
      findFontSize: () => string;
      autoFormatCode: (isFormat: boolean) => void;
      applySyntaxHighlighting: () => void;
    }
  >(),
  { isSourceCodeMode: "edit" }
);
const sourceCodeMode = ref(props.isSourceCodeMode);

// 定义emits
const emit = defineEmits(["popverChange", "sourceCodeModeChange"]);

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;

const fileInput = ref();
const popoverReferenceRef = ref({});

const presetColors = ["#254679", "#67c23a", "#e6a23c", "#f56c6c", "#909399", "#bdbdc0", "#f9f8fd", "#ffffff"];

const injectEditorRef = inject("provideEditorRef") as Ref<any>;
const injectSourceCodeRef = inject("provideSourceCodeRef") as Ref<any>;

const updateLineNumbers = inject("updateLineNumbers") as () => void;

const { fileChange } = useUpFileHooks(props, fileInput, ManagerGlobalConfig, injectEditorRef);

const toolbarTools: Ref<Tool[]> = ref(toolsConfig);
const popoverVisible = ref(false);

const onContentChange = inject("onContentChange") as () => void;
const editorRef = inject("provideEditorRef") as Ref<HTMLDivElement | null>;

// 更新工具栏工具的激活状态
const isToolActiveArrayFn = () => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) return;

  // 获取当前光标位置的字体颜色和背景颜色
  const foreColor = document.queryCommandValue("foreColor");
  const backColor = document.queryCommandValue("backColor");

  const range = selection.getRangeAt(0);
  let currentElement: any = range.startContainer;
  if (currentElement.nodeType === 3) {
    currentElement = currentElement.parentElement;
  }

  // 更新颜色图标和字体图标的颜色
  toolbarTools.value.forEach(tool => {
    if (tool.children?.length) {
      tool.children.map(child => {
        child.isActive = props.isToolActive(child);
        return child;
      });
    } else {
      tool.isActive = props.isToolActive(tool);
    }
    // 更新颜色图标和字体图标的颜色
    if (tool.command === "foreColor") {
      tool.foreColor = foreColor;
      tool.backColor = backColor;
    } else if (tool.command === "backColor") {
      tool.backColor = backColor;
      tool.foreColor = foreColor;
    } else if (tool.command === "createLink") {
      if (popoverVisible.value) return;
      const linkString =
        currentElement.tagName === "A"
          ? (() => {
              try {
                const url = new URL(currentElement.href);
                return url.pathname + url.search + url.hash;
              } catch {
                return currentElement.href;
              }
            })()
          : "";

      tool.linkString = linkString;
    } else if (tool.command === "fontSizeArray") {
      tool.icon = props.findFontSize();
    } else if (tool.command === "formatBlockArray") {
      const activeChild = tool?.children?.find(child => child.isActive);
      tool.icon = activeChild?.icon || tool.icon;
      if (activeChild?.icon) {
        tool.isActive = true;
      } else {
        tool.icon = "h1";
        tool.isActive = false;
      }
    }
    return tool;
  });
};

// 判断选中的文本是否是某个标签下的所有文本内容
const isSelectedTextFullTagContent = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { isFull: false, parentElement: null };
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();
  if (!selectedText) {
    return { isFull: false, parentElement: null };
  }

  // 获取选中内容的父元素
  let parentElement: any = range.commonAncestorContainer;
  // 如果父元素是文本节点，则获取其父元素
  if (parentElement.nodeType === Node.TEXT_NODE) {
    parentElement = parentElement.parentNode;
  }

  if (!parentElement || !(parentElement instanceof Element)) {
    return { isFull: false, parentElement: null };
  }

  // 获取父元素的所有文本内容（去除首尾空白）
  const parentTextContent = parentElement.textContent?.trim() || "";

  // 判断选中的文本是否与父元素的所有文本内容相等
  const isFull = selectedText === parentTextContent;

  return { isFull, parentElement };
};

let linkElement: any = null;

// 从父组件注入撤销/恢复相关函数
const saveToUndoStack = inject("saveToUndoStack") as () => void;
const undo = inject("undo") as () => void;
const redo = inject("redo") as () => void;
const toggleFullscreen = inject("toggleFullscreen") as () => void;
const executeCommand = (command: string, value?: any) => {
  // 确保编辑器存在并获得焦点
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
  console.log("++++++++++> command:", command);
  // 处理撤销命令
  if (command === "undo") {
    // 调用父组件注入的撤销函数
    undo();
    return;
  }

  // 处理恢复命令
  if (command === "redo") {
    // 调用父组件注入的恢复函数
    redo();
    return;
  }

  // 处理背景色命令
  if (command === "backColor" && value) {
    // 在执行编辑操作前保存当前状态到撤销栈
    saveToUndoStack();
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // 创建带有背景色的span元素
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
            // 如果有选中内容，将选中内容包裹在span标签中
            range.surroundContents(span);

            // 重新设置光标位置到span后面
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
  }

  // 处理字体颜色命令
  else if (command === "foreColor" && value) {
    // 在执行编辑操作前保存当前状态到撤销栈
    saveToUndoStack();
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // 创建带有字体颜色的span元素
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
            // 如果有选中内容，将选中内容包裹在span标签中
            range.surroundContents(span); /// 保持选择状态
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
  }

  // 处理字体大小命令
  else if (command === "fontSize" && value) {
    // 在执行编辑操作前保存当前状态到撤销栈
    saveToUndoStack();
    document.execCommand("formatBlock", false, "<p>");

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // 创建带有字体大小的span元素
      const span = document.createElement("span");
      span.style.fontSize = value;

      try {
        if (!range.collapsed) {
          const { isFull, parentElement }: any = isSelectedTextFullTagContent();
          if (isFull && parentElement) {
            parentElement.style.fontSize = value;
          } else {
            // 如果有选中内容，将选中内容包裹在span标签中
            range.surroundContents(span);
          }
          /// 保持选择状态
          const newRange = document.createRange();
          newRange.setStart(span, 0);
          newRange.setEnd(span, 1);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // 如果没有选中内容，创建一个带有字体大小的空span
          span.innerHTML = "&nbsp;";
          range.insertNode(span);

          // 将光标移动到span后面
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
  }

  // 处理创建链接命令
  else if (command === "createLink") {
    // 在执行编辑操作前保存当前状态到撤销栈
    saveToUndoStack();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // 获取当前元素
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
            // const { parentElement }: any = isSelectedTextFullTagContent();
            linkElement = a;
          }
        } catch (error) {
          console.error("设置链接失败:", error);
        }
      }
    }
    return;
  }

  // 处理确认链接命令
  else if (command === "confirmLink") {
    // 在执行编辑操作前保存当前状态到撤销栈
    saveToUndoStack();
    if (linkElement && linkElement.tagName === "A") {
      linkElement.title = value;
      linkElement.href = value;
    }
  }

  // 处理删除链接命令
  else if (command === "deleteLink") {
    // 在执行编辑操作前保存当前状态到撤销栈
    saveToUndoStack();
    if (linkElement && linkElement.tagName === "A") {
      try {
        const textContent = linkElement.textContent || "";
        const textNode = document.createTextNode(textContent);

        // 替换链接元素为文本节点
        if (linkElement.parentNode) {
          linkElement.parentNode.replaceChild(textNode, linkElement);
        }

        // 清除链接元素引用
        linkElement = null;
      } catch (error) {
        console.error("删除链接失败:", error);

        // 备选方案：使用execCommand
        document.execCommand("unlink");
        linkElement = null;
      }
    }
  }

  // 处理插入表格命令
  else if (command === "insertTable") {
    // 在执行编辑操作前保存当前状态到撤销栈
    saveToUndoStack();
    const { rows = 3, cols = 3 } = typeof value === "object" ? value : {};

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      try {
        const boxDiv = document.createElement("div");
        boxDiv.style.display = "inline-block";
        boxDiv.style.maxWidth = "100%";
        boxDiv.style.overflow = "auto";

        // 创建表格元素
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "fit-content";

        // 显式创建tbody元素
        const tableBody = document.createElement("tbody");
        table.appendChild(tableBody);
        boxDiv.appendChild(table);

        // 创建表格行和单元格
        for (let i = 0; i < rows; i++) {
          const tr = document.createElement("tr");

          for (let j = 0; j < cols; j++) {
            const td = document.createElement("td");
            td.style.border = "1px solid #ccc";
            td.style.padding = "8px";
            td.style.textAlign = "left";
            td.style.minWidth = "100px";
            td.innerHTML = "&nbsp;";
            tr.appendChild(td);
          }

          // 将行添加到tbody而不是直接添加到table
          tableBody.appendChild(tr);
        }

        // 插入表格
        range.insertNode(boxDiv);

        // 在表格后添加一个空段落
        const p = document.createElement("p");
        p.innerHTML = "&nbsp;";
        boxDiv.parentNode?.insertBefore(p, table.nextSibling);

        // 将光标移动到表格后的空段落
        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } catch (error) {
        console.error("插入表格失败:", error);
      }
    }
  }

  // 源码编辑
  else if (command === "sourceCode") {
    // 切换源码编辑模式
    sourceCodeMode.value = sourceCodeMode.value === "edit" ? "code" : "edit";
    emit("sourceCodeModeChange", sourceCodeMode.value);
    if (sourceCodeMode.value === "code") {
      // 切换到源码模式：将编辑器内容转为HTML源码
      if (editorRef.value && injectSourceCodeRef.value) {
        injectSourceCodeRef.value.value = editorRef.value.innerHTML;
        // 更新行号
        updateLineNumbers();
        // 自动格式化代码
        props.autoFormatCode(true);
        // 应用语法高亮
        nextTick(() => {
          props.applySyntaxHighlighting();
        });
      }
    } else {
      // 切换到可视化模式：将源码转为HTML内容
      if (injectSourceCodeRef.value && editorRef.value) {
        editorRef.value.innerHTML = injectSourceCodeRef.value.value;
        onContentChange();
      }
    }

    // 更新工具栏激活状态
    isToolActiveArrayFn();
    return;
  }

  // 预览
  else if (command === "visible") {
    // 切换源码编辑模式
    sourceCodeMode.value = sourceCodeMode.value === "edit" ? "visible" : "edit";
    emit("sourceCodeModeChange", sourceCodeMode.value);

    // 更新工具栏激活状态
    isToolActiveArrayFn();
    return;
  }

  // 全屏功能
  else if (command === "fullscreen") {
    toggleFullscreen();
    return;
  }

  // 处理其他命令
  else {
    // 在执行其他编辑命令前保存当前状态到撤销栈
    // 特别是formatBlock命令（标题设置）
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
};
const throttleExecuteCommand = throttle(executeCommand, 1);

// 组件挂载事件
onMounted(() => {
  // 添加事件监听
  document.addEventListener("mouseup", isToolActiveArrayFn);
  document.addEventListener("keyup", isToolActiveArrayFn);
});

// 组件卸载事件
onUnmounted(() => {
  // 移除事件监听
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
