# Development Guide 开发指南

### 3.2 Types.d.ts

## 1.组件文档生成原则

- 文档创建源： /src/package/components/{pa-**}/{pa-**|pa-**-**}.vue
- 文档放置地址：/document/PancakeUI_Doc/\*\*/readme.md，例如 pa-button（/src/package/components/pa-button）组件的文档放置地址为 /document/PancakeUI_Doc/button/readme.md
- 文档包含以下内容：

  - 组件名称 ：pa-组件名，例如 pa-number 组件名称为 number 数字框
  - 组件描述 100 字以内
  - 组件属性表格（ComponentProps）：如果存在，需要说明属性的(属性名、描述、类型、默认值)四个属性

    - 属性名必须使用驼峰命名法。
    - 描述必须使用中文，100 字以内。
    - 类型必须使用 TypeScript 类型，根据 @type 定义
    - 默认值必须使用 TypeScript 类型，根据 @default 定义

  - 组件事件表格（ComponentEmits）：如果存在，需要说明事件的(事件名、描述、回调函数)三个属性。

    - 事件名必须使用驼峰命名法。
    - 描述必须使用中文，100 字以内。
    - 参数必须使用 TypeScript 类型，根据 @param 定义
    - 回调函数必须使用 TypeScript 类型，根据 @returns 定义

  - 组件插槽表格（ComponentSlots）：如果存在，需要说明插槽的(插槽名称、作用)两个属性。

    - 插槽名称必须使用驼峰命名法。
    - 描述必须使用中文，100 字以内。

  - 组件功能展示

    - 至少包含一个基本使用的示例，示例文件命名为 base.vue，位于组件目录下。
    - 根据组件的参数创建多个示例，每个示例文件命名为 {属性名}.vue，位于组件目录下。
    - 在文档中需要简单介绍每个示例的作用和使用的参数

      - 例如：disabled.vue 是组件的禁用状态示例，其介绍为：使用 `disabled` 来定义按钮的禁用状态，禁用状态下用户无法与之交互。

## 2.组件开发规范

- 组件名称：以 pa- 开始头，例如 pa-button 或 pa-button-primary。
- 组件地址：/src/package/components/{pa-**}/{pa-**|pa-**-**}.vue
- 组件包含文件

  - 组件源文件：{src/package/components/{pa-**}/{pa-**|pa-**-**}.vue}
  - 样式文件：{src/package/components/{pa-\*\*}/index.scss}
  - 类型定义文件：{src/package/components/{pa-\*\*}/types.d.ts}
  - 组件注入文件：{src/package/components/{pa-\*\*}/index.ts}

### 2.1 组件注入文件要求

- 组件注入文件必须包含 install 函数，用于将组件注册到 Vue 应用中。
- 组件注入文件必须包含 name 属性，用于指定组件的名称。
- 组件注入文件必须包含 default 导出，用于导出组件的实例。

#### 2.1.1 组件注入文件示例（index.ts）

```ts
// # Import
import PaButton from "./pa-button.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["PaButton"]) {
    app.component("PaButton", PaButton);
  }
};

export default { name: "PaButton", install };
```

### 2.2 组件样式要求（index.scss）

- 组件样式文件必须包含组件的基本样式定义，如果：button 组件，根元素必须是 .pa-button
- 组件子元素相关样式类必须包含在根元素类中，例如 .pa-button_text 是 .pa-button 的一个子元素，所以必须包含在 .pa-button 类中。
- 组件相关样式属性需要使用变量来定义值

  - --pa-size-font: 字体大小，默认值为 16px
  - --pa-size-height: 高度，默认值为 30px
  - --pa-size-padding: 内边距，默认值为 10px
  - --pa-size-radius: 圆角，默认值为 12px
  - --pa-color-info: 信息颜色，默认值为 #909399
  - --pa-color-success: 成功颜色，默认值为 #67c23a
  - --pa-color-warning: 警告颜色，默认值为 #e6a23c
  - --pa-color-danger: 危险颜色，默认值为 #f56c6c
  - --pa-color-default: 默认颜色，默认值为 #909399
  - --pa-color-white: 白色，默认值为 #ffffff
  - --pa-color-black: 黑色，默认值为 #000000
  - --pa-color-font: 字体颜色，默认值为 #1d1d1d
  - --pa-color-send-font: 字体颜色 2，默认值为 #606266
  - --pa-color-bg: 背景颜色，默认值为 #ffffff
  - --pa-color-cell-bg: 背景颜色，默认值为 #f9f8fd
  - --pa-color-send-bg: 背景颜色 2，默认值为 #f5f7fa
  - --pa-color-border: 边框颜色，默认值为 #dcdfe6
  - --pa-color-hover: 鼠标悬停颜色，默认值为 #c0c4cc
  - --pa-color-scrollbar: 滚动条颜色，默认值为 #e4e7ed

### 2.3 组件属性要求（ComponentProps）

- 组件属性必须包含以下属性
  - id：组件唯一标识，类型为 string
  - class：自定义类名，类型为 Array<string> | string
  - style：自定义样式，类型为 Record<string, string>;
  - 标题、提示信息等需要支持多语言，类型为 LanguagePackageType
  - 所有属性都必须填写注释，注释中必须包含属性的类型、默认值、描述等信息
  - 属性中的 @default 必须和 Vue 文件中的 withDefaults(defineProps<ComponentProps>(), {}) 中的默认值一致，如果不存在默认值，则填写 undefined

#### 2.3.1 标题、提示信息等多语言示例

```ts
// # Import
import { LanguagePackageType } from "../manager-type";

  /**
   * **表单项标签**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标签
   * */
  title?: LanguagePackageType | string;
```

### 2.4 组件开发要求

- 组件开发必须符合 Vue 3 规范
- 组件开发中必须使用 Vue 3 组件 API
- 组件开发中 import 语句必须放置在组件源文件的顶部
- 组件开发中 必须使用 TypeScript
- 组件开发中 变量必须使用驼峰命名法 ，例如 const title = "标题";
- 组件开发中 函数必须使用驼峰命名法 ，例如 function handleClick() { ... }
- 组件开发中 类必须使用驼峰命名法 ，例如 class PaButton { ... }
- 组件开发中 常量必须使用全大写字母和下划线分隔，例如 const MAX_VALUE = 100;
- 组件开发中 组件事件必须使用驼峰命名法 ，例如 "handleClick"
- 组件开发中 组件插槽必须使用驼峰命名法 ，例如 "exBtn"
- 组件开发中 所有方法和属性都必须填写注释，注释中必须包含方法的参数、返回值、异常等信息
- 组件开发中 watch 必须放在 setup 函数中最下方
- 组件开发中 TypeScript 代码顺序如下

  - import 语句
  - const 定义，包含：常量 > props > ref > reactive > 变量 > computed
  - function 定义，包含：事件处理函数
  - watch 定义

### 2.5 自定义类型文档说明

当 ComponentProps 或 ComponentEmits 中使用非标准类型（自定义类型）时，需要在文档最下方添加自定义类型的文档说明。

#### 2.5.1 自定义类型识别

以下类型属于**标准类型**，无需额外说明：
- 基础类型：`string`、`number`、`boolean`、`undefined`、`null`
- 数组类型：`Array<T>`
- 对象类型：`Record<K, V>`
- 字面量联合类型：`'large' | 'medium' | 'small'`
- Vue 类型：`MouseEvent`、`Event` 等

以下类型属于**自定义类型**，需要添加文档说明：
- 项目内定义的类型：如 `TagType`、`ButtonTypeV2Is` 等
- 从其他模块导入的类型：如 `LanguagePackageType`（需链接到外部文档）

#### 2.5.2 文档格式要求

1. **表格格式**：与 ComponentProps 相同的四列格式（属性名、描述、类型、默认值）
2. **链接方式**：
   - 当前文档定义的类型：使用锚点链接，如 `[`TagType`](#tagtype)`
   - 外部已定义的类型：使用完整路径链接，如 `LanguagePackageType` 链接到 `/document/PancakeUI_Doc/options#languagepackagetype`
3. **位置**：放在文档最下方，按字母顺序排列

#### 2.5.3 外部类型链接示例

`LanguagePackageType` 是全局定义的多语言类型，所有组件共用，链接地址为：
```
/document/PancakeUI_Doc/options#languagepackagetype
```

使用示例：
```markdown
| label | 标签显示文本 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | - |
```

#### 2.5.4 完整示例（Tag 组件）

```markdown
# Tag 标签

`pa-tag` 用于展示一组标签，支持折叠和删除功能。

## ComponentProps

| 属性名 | 描述 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| id | 唯一标识 | `string` | - |
| class | 自定义类名 | `Array<string>` `string` | - |
| style | 自定义样式 | `Record<string, string>` | - |
| tagList | 标签列表 | [`Array<TagType>`](#tagtype) | - |
| useCollapse | 是否折叠 | `boolean` | `true` |
| disabled | 是否禁用删除功能 | `boolean` | - |

## ComponentEmits

| 事件名 | 描述 | 回调函数 |
| ------ | ---- | -------- |
| removeTag | 删除标签时触发 | `(data: TagType) => void` |

## TagType

标签数据结构。

| 属性名 | 描述 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| label | 标签显示文本 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | - |
| value | 标签值 | `boolean` `number` `string` | - |
```

#### 2.5.5 特殊情况处理

1. **嵌套类型**：如果自定义类型中引用了其他自定义类型，同样使用链接方式
2. **枚举类型**：如果自定义类型是枚举或字面量联合，列出所有可选值
3. **外部类型**：如果类型在其他文档中已定义，直接链接到该文档，不在当前文档重复定义
