# CoderEditor 代码编辑器

基于 CodeMirror 的代码编辑器，支持多种编程语言、主题切换和工具栏。

## 基础用法

使用 `v-model` 绑定代码内容，支持多种语言编辑。

<demo src="./base.vue"></demo>

## 语言切换

使用 `language` 切换编辑语言，支持 `html`、`vue`、`javascript`、`typescript`、`json`、`css`。

<demo src="./language.vue"></demo>

## 只读模式

使用 `readonly` 开启只读模式，禁止编辑代码内容。

<demo src="./readonly.vue"></demo>

## ComponentProps

| 属性名 | 描述 | 类型 | 默认值 |
| ---------------- | ---------------- | ---------------- | ---------------- |
| id | 组件唯一标识 | `string` | - |
| class | 自定义类名 | `Array<string>` `string` | - |
| style | 自定义样式 | `Record<string, string>` | - |
| modelValue | 代码内容双向绑定 | `string` | `""` |
| language | 编辑器语言 | [`CoderEditorLanguage`](#codereditorlanguage) | `json` |
| readonly | 是否只读 | `boolean` | `false` |
| placeholder | 占位符文本 | `string` | `在此输入代码...` |
| theme | 主题模式 | [`CoderEditorTheme`](#codereditortheme) | `light` |
| height | 编辑器高度 | `string` | - |
| minHeight | 编辑器最小高度 | `string` | `100px` |
| showToolbar | 是否显示工具栏 | `boolean` | `true` |
| showLanguageSwitch | 是否允许切换语言 | `boolean` | `true` |
| showThemeToggle | 是否显示主题切换按钮 | `boolean` | `true` |
| lineNumbers | 是否显示行号 | `boolean` | `true` |
| tabSize | Tab 缩进宽度 | `number` | `2` |
| indentWithSpaces | 使用空格缩进 | `boolean` | `true` |

## ComponentEmits

| 事件名 | 描述 | 回调函数 |
| ---------------- | ---------------- | ---------------- |
| update:modelValue | 代码内容更新时触发 | `(value: string) => void` |
| update:language | 语言切换时触发 | `(value: CoderEditorLanguage) => void` |
| update:theme | 主题切换时触发 | `(value: CoderEditorTheme) => void` |
| ready | 编辑器挂载完成时触发 | `() => void` |
| focus | 编辑器聚焦时触发 | `() => void` |
| blur | 编辑器失焦时触发 | `() => void` |

## CoderEditorLanguage

编辑器支持的语言类型。

| 值 | 描述 |
| ---------------- | ---------------- |
| `'html'` | HTML |
| `'vue'` | Vue |
| `'javascript'` | JavaScript |
| `'typescript'` | TypeScript |
| `'json'` | JSON |
| `'css'` | CSS |

## CoderEditorTheme

编辑器主题模式。

| 值 | 描述 |
| ---------------- | ---------------- |
| `'light'` | 亮色主题 |
| `'dark'` | 暗色主题 |
