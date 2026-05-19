---
name: checklist
description: |
  PancakeUI 组件库代码规范检查。按文件类型逐项检查 JSDoc 注释、代码风格、类型定义、
  SCSS 规范、文档完整性等。执行时逐条检查并标记 ✅/❌，上一条完成才能执行下一条。
trigger:
  - checklist
  - 清单
  - 规范检查
  - review code style
---

# PancakeUI Checklist 规范检查

按类型逐条执行检查，将结果填写在表格中，结果列值为 ✅ 或 ❌。**只有上一条执行完后才会执行下一条。**

## JSDoc 通用规则

1. 所有 JSDoc 注释都必须包含 **1.标题 2.@description**，不可省略。额外标签（@type、@default、@param、@returns）按上下文需要添加。
2. 所有 JSDoc 注释必须使用**多行格式**，禁止单行写法。正确：`/**\n * 标题\n * @description 描述\n */`，错误：`/** 标题 @description 描述 */`

## index.ts

- 所有 import 有 JSDoc 注释（多行格式，1.标题 2.@description）
- install 参数类型为 `App` 非 `any`
- install 函数有 JSDoc 注释（多行格式，1.标题 2.@param 3.@description）
- name 属性有 JSDoc 注释（多行格式，1.标题 2.@description）
- 方法/变量之间无空行间隔（对象和对象、对象和方法、方法和方法之间都不需要空行）
- 文件必须使用 Prettier 进行格式化

## *.vue

- 样式必须使用独立文件，文件命名为 `index.scss`，Vue 通过 `@use` 引入
- 所有 import 有 JSDoc 注释（多行格式，1.标题 2.@description）
- 所有变量有 JSDoc 注释（多行格式，1.标题 2.@description），包括 ref、reactive、computed、let 等
- 所有函数有完整 JSDoc 注释（多行格式，1.标题 2.@param 3.@returns 4.@description）
- 所有 watch 有 JSDoc 注释（多行格式，1.标题 2.@description）
- 所有生命周期钩子有 JSDoc 注释（多行格式，1.标题 2.@description）
- 无单行注释，改用 JSDoc 注释（多行格式）
- 无被注释掉的代码，如有则删除
- defineEmits 使用类型化写法 `defineEmits<ComponentEmits>()`
- 方法/变量之间无空行间隔（包括 Vue 文件中的 ts 代码）
- 代码顺序规范：import → const/let 变量 → function → 生命周期钩子 → watch（const 依赖函数返回值时可放在该函数之后）
- Vue 内定义的 interface/type 不移动到 types.d.ts，保留在 Vue 文件内部
- 未使用的参数无需定义（方法内没有使用到的参数不需要定义参数名和类型）
- 文件必须使用 Prettier 进行格式化

## *.scss

- 文件命名为 `index.scss` 独立文件，Vue 通过 `@use` 引入
- 缩进为 2 空格
- 根元素类名规范：`.pa-{组件名}`（如 `.pa-button`）
- 无单行注释（`// xxx`），如有则删除
- 无被注释掉的代码，如有则删除
- class 之间有空行分隔
- 样式属性使用 CSS 变量：`--pa-color-primary`、`--pa-size-font` 等
- 无硬编码颜色值，使用 CSS 变量而非 `#409eff` 等
- 文件必须使用 Prettier 进行格式化

## *.d.ts

- 文件命名为 `types.d.ts` 非 `type.d.ts`
- 类型名称规范：`ComponentProps`、`ComponentEmits`，其他类型为 `Component+类型名称`（如 `ComponentItemProps`、`ComponentLabelProps`）
- 必须定义属性：id、class、style 三个都必须存在（可选属性，带 `?`）。id 类型：`string`；class 类型：`Array<string> | string`；style 类型：`Record<string, string>`
- 所有 import 有 JSDoc 注释（多行格式，1.标题 2.@description）
- 所有 export type 有 JSDoc 注释（多行格式，1.标题 2.@type 3.@description）
- 所有属性有完整 JSDoc 注释（多行格式，1.标题 2.@type 3.@default 4.@description）
- @type 格式规范：可选属性（有 `?`）的 @type 必须包含 `undefined`
- 数组类型使用 `Array<T>` 非 `T[]`
- ComponentEmits 使用函数重载格式：`(e: "eventName", param): void;`
- ComponentEmits 非必需，只有实际使用事件发射的组件才需要定义
- 方法/变量之间无空行间隔
- 文件必须使用 Prettier 进行格式化

## *.ts

- 所有 import 有 JSDoc 注释（多行格式，1.标题 2.@description）
- 所有 export 有 JSDoc 注释（多行格式，1.标题 2.@type 3.@description）
- 所有函数有完整 JSDoc 注释（多行格式，1.标题 2.@param 3.@returns 4.@description）
- 所有方法必须使用 `function` 定义，而非 `const` 定义
- 所有变量/常量有 JSDoc 注释（多行格式）
- 无单行注释，改用 JSDoc 注释
- 数组类型使用 `Array<T>`
- 可选参数类型含 `undefined`
- 代码顺序规范：import → const/let 变量（vue 相关）→ const/let 其他变量 → function → vue 的 watch
- 方法/变量之间无空行间隔
- 未使用的参数无需定义
- 文件必须使用 Prettier 进行格式化

## 文档（readme.md）

- 文件必须使用 Prettier 进行格式化
- 组件名称格式：`pa-{组件名}`
- 组件描述：中文，100 字以内
- ComponentProps 表格完整：属性名、描述、类型、默认值 四列
- ComponentProps 类型一致，与 types.d.ts 中定义一致
- ComponentEmits 表格完整：事件名、描述、回调函数 三列
- ComponentEmits 回调格式一致，与 types.d.ts 中 ComponentEmits 一致
- types.d.ts 中所有类型都必须在文档中有表格展示
- ComponentSlots 表格完整：插槽名称、作用 两列（如存在），插槽名用单引号包裹
- 其他类型表格完整
- 文档文件夹中（readme.md 同级）必须存在 readme.md 文件
- 示例文件可运行，无语法错误
- 文档根据 ComponentProps 参数创建更多示例
- 文档属性标题必须和 types.d.ts 中定义一致
- 文档中所有类型、属性、参数、默认值必须与 types.d.ts 一致
- 标准类型必须包裹在反引号中，如 `string`、`number` 等
- 非标准类型使用链接指向说明，如 [`ComponentMode`](#componentmode)
- 文档中默认值必须和 types.d.ts 中定义一致
- 数组类型必须包裹在反引号中，如 `Array<T>`
- types.d.ts 中类型为 `undefined`，在 .md 文档中不显示；默认值为 `undefined` 则显示为 `-`
- 类型 `LanguagePackageType` 链接地址为 `/document/PancakeUI_Doc/options#languagepackagetype`
- 文档中类型和类型之间用空格隔开，如 `Array<string>` `string`
- 字符串字面量用反引号包裹单引号内容，如插槽名、类型值等，如 `'default'`
- 表格内容中的 `|` 作为类型联合符号时必须转义为 `\|`；`<>` 不需要转义
- 文档中的类型名称必须与 types.d.ts 中的定义一致，不能凭猜测修改
