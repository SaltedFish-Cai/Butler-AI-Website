<template>
  <div
    :id="renderId"
    :class="['pa-coder-editor', 'pa-coder-editor--' + currentTheme, props.class]"
    :style="[props.style, { height: props.height, minHeight: props.minHeight }]"
  >
    <!-- Toolbar -->
    <div v-if="props.showToolbar" class="pa-coder-editor__toolbar">
      <div class="pa-coder-editor__toolbar-left">
        <pa-select
          v-if="props.showLanguageSwitch"
          v-model="currentLanguage"
          :ex-options="languageOptions"
          class="pa-coder-editor__language-select"
        />
      </div>
      <div class="pa-coder-editor__toolbar-right">
        <button class="pa-coder-editor__format-btn" title="格式化代码 (Shift+Alt+F)" @click="formatDocument">格式</button>
        <button
          v-if="props.showThemeToggle"
          :class="['pa-coder-editor__theme-btn', { 'pa-coder-editor__theme-btn--active': currentTheme === 'dark' }]"
          :title="currentTheme === 'dark' ? '切换为亮色模式' : '切换为暗色模式'"
          @click="handleThemeToggle"
        >
          <pa-icon v-if="currentTheme !== 'dark'" name="sun" />
          <pa-icon v-else name="moon" />
        </button>
      </div>
    </div>

    <!-- Editor body -->
    <pa-scrollbar
      :use-back-top="false"
      class="pa-coder-editor__scrollbar"
      :class="currentTheme === 'dark' ? 'pa-coder-editor__scrollbar--dark' : ''"
    >
      <div ref="editorContainer" class="pa-coder-editor__container"></div>
    </pa-scrollbar>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, type ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入 CodeMirror 核心模块
 */
import { EditorView, keymap, placeholder as placeholderExt } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentUnit, getIndentation } from "@codemirror/language";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { vue } from "@codemirror/lang-vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits, CoderEditorLanguage, CoderEditorTheme } from "./types";
/**
 * 模块导入
 * @description 导入 store
 */
import { useBaseStore } from "../store";
import useRenderId from "../tools/render-id";

/**
 * 语言与 CodeMirror 扩展映射
 */
const LANGUAGE_EXTENSIONS: Record<CoderEditorLanguage, () => import("@codemirror/language").LanguageSupport> = {
  html: () => html(),
  vue: () => vue(),
  javascript: () => javascript(),
  typescript: () => javascript({ typescript: true }),
  json: () => json(),
  css: () => css()
};

/**
 * 语言标签映射
 */
const LANGUAGE_LABELS: Record<CoderEditorLanguage, string> = {
  html: "HTML",
  vue: "Vue",
  javascript: "JavaScript",
  typescript: "TypeScript",
  json: "JSON",
  css: "CSS"
};

/**
 * 组件属性
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  modelValue: "",
  language: "json",
  readonly: false,
  placeholder: "在此输入代码...",
  minHeight: "100px",
  showToolbar: true,
  showLanguageSwitch: true,
  showThemeToggle: true,
  lineNumbers: true,
  tabSize: 2,
  indentWithSpaces: true
});
/**
 * **随机 ID**
 * @type `string`
 * @description 用于唯一标识组件的随机 ID
 */
const renderId = ref(props.renderId || (props.id ? props.id : "pa-coder-editor_" + useRenderId()));
/**
 * 组件事件
 */
const emit = defineEmits<ComponentEmits>();

/**
 * 当前语言
 */
const currentLanguage = ref<CoderEditorLanguage>(props.language);

/**
 * 当前主题
 * @description 优先使用 theme prop，未设置则从 store 恢复，默认 light
 */
const store = useBaseStore();
/**
 * 加载主题
 * @returns 主题模式
 */
function loadTheme(): CoderEditorTheme {
  if (props.theme) return props.theme;
  return (store.coderEditorTheme as CoderEditorTheme) || "light";
}
const currentTheme = ref<CoderEditorTheme>(loadTheme());

watch(currentTheme, val => {
  store.coderEditorTheme = val;
});

/**
 * 语言选项
 */
const languageOptions: ComputedRef<Array<{ label: string; value: string }>> = computed(() =>
  (Object.entries(LANGUAGE_LABELS) as [CoderEditorLanguage, string][]).map(([value, label]) => ({
    label,
    value
  }))
);

/**
 * 编辑器容器引用
 */
const editorContainer = ref<HTMLDivElement | null>(null);

/**
 * CodeMirror 视图实例
 * @type EditorView | null
 */
let view: EditorView | null = null;

/**
 * 同步父组件 language prop 变化到内部状态
 */
watch(
  () => props.language,
  val => {
    currentLanguage.value = val;
  }
);

/**
 * 同步父组件 theme prop 变化到内部状态
 */
watch(
  () => props.theme,
  val => {
    if (val) currentTheme.value = val;
  }
);

/**
 * 构建 CodeMirror 扩展
 * @returns 扩展数组
 */
function buildExtensions(): import("@codemirror/state").Extension[] {
  const languageExt = LANGUAGE_EXTENSIONS[currentLanguage.value]?.() ?? json();

  const extensions: import("@codemirror/state").Extension[] = [
    basicSetup,
    EditorState.readOnly.of(props.readonly),
    languageExt,
    placeholderExt(props.placeholder),
    EditorView.updateListener.of(update => {
      if (update.changes) {
        emit("update:modelValue", update.state.doc.toString());
      }
    }),
    EditorView.domEventHandlers({
      focus: () => {
        emit("focus");
      },
      blur: () => {
        emit("blur");
      }
    }),
    keymap.of([
      {
        key: "Shift-Alt-f",
        run: () => {
          formatDocument();
          return true;
        }
      }
    ])
  ];

  // Indentation
  extensions.push(EditorState.tabSize.of(props.tabSize));
  extensions.push(props.indentWithSpaces ? indentUnit.of(" ".repeat(props.tabSize)) : indentUnit.of("\t"));

  // Line numbers
  if (!props.lineNumbers) {
    extensions.push(EditorView.theme({ ".cm-gutters": { display: "none" } }));
  }

  // Theme
  if (currentTheme.value === "dark") {
    extensions.push(oneDark);
  } else {
    extensions.push(
      EditorView.theme({
        "&": {
          backgroundColor: "#ffffff",
          color: "#1d1d1d"
        },
        ".cm-gutters": {
          backgroundColor: "#f5f7fa",
          color: "#909399",
          borderRight: "1px solid #dcdfe6"
        }
      })
    );
  }

  return extensions;
}

/**
 * 创建编辑器实例
 */
function createEditor(): void {
  if (!editorContainer.value) return;
  if (view) {
    view.destroy();
    view = null;
  }

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: buildExtensions()
  });

  view = new EditorView({
    state,
    parent: editorContainer.value
  });
  formatDocument();
  emit("ready");
}

/**
 * 主题切换处理
 */
function handleThemeToggle(): void {
  const newTheme: CoderEditorTheme = currentTheme.value === "dark" ? "light" : "dark";
  currentTheme.value = newTheme;
  emit("update:theme", newTheme);
}

/**
 * 格式化代码
 * @description 利用语言服务的缩进信息重新缩进整个文档
 */
function formatDocument(): void {
  if (!view) return;
  const state = view.state;
  const unit = state.facet(indentUnit);
  const changes: { from: number; to: number; insert: string }[] = [];

  for (let i = 1; i <= state.doc.lines; i++) {
    const line = state.doc.line(i);
    const indentCol = getIndentation(state, line.from);
    if (indentCol === null || indentCol === undefined) continue;
    const indentCount = Math.floor(indentCol / props.tabSize);
    const targetIndent = unit.repeat(indentCount);
    const trimmed = line.text.trim();
    if (line.text !== targetIndent + trimmed) {
      changes.push({
        from: line.from,
        to: line.to,
        insert: targetIndent + trimmed
      });
    }
  }

  if (changes.length) {
    view.dispatch({ changes });
  }
}

// Sync external value changes into editor
watch(
  () => props.modelValue,
  newVal => {
    if (view && newVal !== view.state.doc.toString()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newVal
        }
      });
    }
    formatDocument();
  }
);

// Rebuild on language change
watch(currentLanguage, () => createEditor());

// Rebuild on theme change
watch(currentTheme, () => createEditor());

// Rebuild on indentation change
watch(
  () => [props.tabSize, props.indentWithSpaces],
  () => createEditor()
);

onMounted(() => {
  createEditor();
});

onBeforeUnmount(() => {
  if (view) {
    view.destroy();
    view = null;
  }
});
</script>

<style lang="scss">
@use "../styles/default/pa-coder-editor.scss";
</style>
