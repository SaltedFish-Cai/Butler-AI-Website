/**
 * @module pa-coder-editor/types
 * @description PaCoderEditor 类型定义
 */

/**
 * 编辑器支持的语言类型
 */
export type CoderEditorLanguage = "css" | "html" | "javascript" | "json" | "typescript" | "vue";

/**
 * 编辑器主题模式
 */
export type CoderEditorTheme = "dark" | "light";

/**
 * 组件属性定义
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   */
  id?: string;

  /**
   * render-id
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  renderId?: string;

  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   */
  class?: Array<string> | string;

  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   */
  style?: Record<string, string>;

  /**
   * 代码内容双向绑定
   * @type string
   * @default ""
   */
  modelValue: string;

  /**
   * 编辑器语言
   * @type CoderEditorLanguage
   * @default "json"
   */
  language?: CoderEditorLanguage;

  /**
   * 是否只读
   * @type boolean | undefined
   * @default false
   */
  readonly?: boolean;

  /**
   * 占位符文本
   * @type string | undefined
   * @default "在此输入代码..."
   */
  placeholder?: string;

  /**
   * 主题模式
   * @type CoderEditorTheme | undefined
   * @default "light"
   */
  theme?: CoderEditorTheme;

  /**
   * 编辑器高度
   * @type string | undefined
   * @default undefined
   */
  height?: string;

  /**
   * 编辑器最小高度
   * @type string | undefined
   * @default "100px"
   */
  minHeight?: string;

  /**
   * 是否显示工具栏
   * @type boolean | undefined
   * @default true
   */
  showToolbar?: boolean;

  /**
   * 是否允许切换语言
   * @type boolean | undefined
   * @default true
   */
  showLanguageSwitch?: boolean;

  /**
   * 是否显示主题切换按钮
   * @type boolean | undefined
   * @default true
   */
  showThemeToggle?: boolean;

  /**
   * 是否显示行号
   * @type boolean | undefined
   * @default true
   */
  lineNumbers?: boolean;

  /**
   * Tab 缩进宽度（空格数）
   * @type number | undefined
   * @default 2
   */
  tabSize?: number;

  /**
   * 是否使用空格缩进，false 则使用 Tab 字符
   * @type boolean | undefined
   * @default true
   */
  indentWithSpaces?: boolean;
};

/**
 * 组件事件定义
 */
export type ComponentEmits = {
  /**
   * 代码内容更新事件
   * @param value - 更新后的代码内容
   */
  (e: "update:modelValue", value: string): void;

  /**
   * 语言切换事件
   * @param value - 切换后的语言
   */
  (e: "update:language", value: CoderEditorLanguage): void;

  /**
   * 主题切换事件
   * @param value - 切换后的主题
   */
  (e: "update:theme", value: CoderEditorTheme): void;

  /**
   * 编辑器挂载完成事件
   */
  (e: "ready"): void;

  /**
   * 编辑器聚焦事件
   */
  (e: "focus"): void;

  /**
   * 编辑器失焦事件
   */
  (e: "blur"): void;
};
