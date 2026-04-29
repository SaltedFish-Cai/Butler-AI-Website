# 排查清单

> 版本：v1.1.0

每次执行必须返回下方 5 个表格中结果时否的内容，并填写结果列的值为✅或❌

## types.d.ts 排查结果

| 维度       | 要求                                                                                                                     | 结果 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | ---- |
| types.d.ts | 文件必须使用 Prettier 进行格式化                                                                                         |      |
| types.d.ts | 文件命名为 types.d.ts 非 type.d.ts                                                                                       |      |
| types.d.ts | 类型名称为 ComponentProps ComponentEmits 其他类型名称为 Component+类型名称（如 ComponentItemProps、ComponentLabelProps） |      |
| types.d.ts | 必须定义属性：id、class、style 三个都必须存在（可选属性，带?） id 类型：string; class Array<string> \| string; style Record<string, string>   |      |
| types.d.ts | 所有 import 有 JSDoc 注释 包含 @description ...                                                                          |      |
| types.d.ts | 所有 export type 有 JSDoc 注释 @type、@description                                                                       |      |
| types.d.ts | 所有属性有完整 JSDoc 注释 @type、@default、@description                                                                  |      |
| types.d.ts | @type 格式规范 可选属性（有 ?）的 @type 必须包含 `undefined`                                                             |      |
| types.d.ts | 数组类型使用 Array 非 type[]                                                                                             |      |
| types.d.ts | ComponentEmits 函数重载格式 (e: "eventName", param): void;                                                               |      |
| types.d.ts | ComponentEmits 非必需 只有实际使用事件发射的组件才需要定义 ComponentEmits                                                |      |
| types.d.ts | 方法/变量之间无空行间隔 对象和对象、对象和方法、方法和方法之间都不需要空行                                               |      |

## css/scss 排查结果

| 维度       | 要求                                                        | 结果 |
| ---------- | ----------------------------------------------------------- | ---- |
| index.scss | 文件必须使用 Prettier 进行格式化                            |      |
| index.scss | 文件命名为 index.scss 独立文件，Vue 通过 @use 引入          |      |
| index.scss | 缩进为 2 空格 统一缩进格式                                  |      |
| index.scss | 根元素类名规范 .pa-{组件名}（如 .pa-button）                |      |
| index.scss | 无单行注释（// xxx） 如有则删除                             |      |
| index.scss | 无被注释掉的代码 如有则删除                                 |      |
| index.scss | class 之间有空行分隔 提高可读性                             |      |
| index.scss | 样式属性使用 CSS 变量 如 --pa-color-primary、--pa-size-font |      |
| index.scss | 无硬编码颜色值 使用 CSS 变量而非 #409eff 等                 |      |

## Vue 文件 排查结果

| 维度     | 要求                                                                                    | 结果 |
| -------- | --------------------------------------------------------------------------------------- | ---- |
| Vue 文件 | 文件必须使用 Prettier 进行格式化                                                        |      |
| Vue 文件 | 样式必须使用独立文件，文件命名为 index.scss Vue 通过 @use 引入                          |      |
| Vue 文件 | 所有 import 有 JSDoc 注释 包含 @description ...                                         |      |
| Vue 文件 | 所有变量有 JSDoc 注释 ref、reactive、computed、let 等                                   |      |
| Vue 文件 | 所有函数有完整 JSDoc 注释 @param、@returns、@description                                |      |
| Vue 文件 | 所有 watch 有 JSDoc 注释                                                                |      |
| Vue 文件 | 所有生命周期钩子有 JSDoc 注释                                                           |      |
| Vue 文件 | 无单行注释 改用 JSDoc 风格                                                              |      |
| Vue 文件 | 无被注释掉的代码 如有则删除                                                             |      |
| Vue 文件 | defineEmits 类型化写法 defineEmits<ComponentEmits>()                                    |      |
| Vue 文件 | oldValue 类型定义 需显式类型                                                            |      |
| Vue 文件 | 方法/变量之间无空行间隔 对象和对象、对象和方法、方法和方法之间都不需要空行（包括 Vue 文件中的 ts 代码） |      |
| Vue 文件 | 代码顺序规范 import → const/let变量 → function → 生命周期钩子 → watch（const依赖函数返回值时可放在该函数之后） |      |
| Vue 文件 | Vue 内定义的 interface/type 不移动到 types.d.ts 保留在 Vue 文件内部，文档中也不需要显示 |      |
| Vue 文件 | 未使用的参数无需定义 方法内没有使用到的参数不需要定义参数名和类型                       |      |

## ts 排查结果

| 维度     | 要求                                                                       | 结果 |
| -------- | -------------------------------------------------------------------------- | ---- |
| index.ts | 文件必须使用 Prettier 进行格式化                                           |      |
| index.ts | 所有 import 有 JSDoc 注释                                                  |      |
| index.ts | install 参数类型为 App 非 any                                              |      |
| index.ts | install 函数有 JSDoc 注释 @param、@description                             |      |
| index.ts | name 属性有 JSDoc 注释                                                     |      |
| index.ts | 方法/变量之间无空行间隔 对象和对象、对象和方法、方法和方法之间都不需要空行 |      |
| *.ts | 文件必须使用 Prettier 进行格式化                                           |      |
| *.ts | 所有 import 有 JSDoc 注释 注释 包含 @description ...                       |      |
| *.ts | 所有 export 有 JSDoc 注释 类型/函数/常量                                   |      |
| *.ts | 所有函数有完整 JSDoc 注释 @param、@returns、@description                   |      |
| *.ts | 所有方法必须使用 function 定义 而非 const 定义 |      |
| *.ts | 所有变量/常量有 JSDoc 注释                                                 |      |
| *.ts | 无单行注释 改用 JSDoc 风格                                                 |      |
| *.ts | 数组类型使用 Array                                                         |      |
| *.ts | 可选参数类型含 undefined                                                   |      |
| *.ts | 代码顺序规范 import → const/let变量（vue相关）→ const/let其他变量 → function → vue的watch |      |
| *.ts | 方法/变量之间无空行间隔 对象和对象、对象和方法、方法和方法之间都不需要空行 |      |
| *.ts | 未使用的参数无需定义 方法内没有使用到的参数不需要定义参数名和类型          |      |

## 文档 排查结果

| 维度 | 要求                                                                                                                                                                             | 结果 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 文档 | 文件必须使用 Prettier 进行格式化                                                                                                                                                 |      |
| 文档 | 组件名称格式 pa-{组件名} 格式                                                                                                                                                    |      |
| 文档 | 组件描述 中文，100 字以内                                                                                                                                                        |      |
| 文档 | ComponentProps 表格完整 属性名、描述、类型、默认值 四列                                                                                                                          |      |
| 文档 | ComponentProps 类型一致 与 types.d.ts 中定义一致                                                                                                                                 |      |
| 文档 | ComponentEmits 表格完整 事件名、描述、回调函数 三列                                                                                                                              |      |
| 文档 | ComponentEmits 回调格式一致 与 types.d.ts 中 ComponentEmits 一致                                                                                                                 |      |
| 文档 | types.d.ts 中所有类型都必须在文档中有表格展示 提取 types.d.ts 中所有 export type，每个类型都需对应一个表格                                                                                              |      |
| 文档 | ComponentSlots 表格完整 插槽名称、作用 两列（如存在），插槽名用单引号包裹                                                                                                        |      |
| 文档 | 其他类型表格完整 types.d.ts 中定义的其他类型（如 ScrollDataType、RenderEndData 等）也需在文档中有表格展示，根据类型结构确定表格列                                                    |      |
| 文档 | 文档文件夹中（readme.md 同级） 必须存在 readme.md 文件                                                                                                                                               |      |
| 文档 | 示例文件可运行 无语法错误                                                                                                                                                        |      |
| 文档 | 文档根据 ComponentProps 参数创建更多示例                                                                                                                                         |      |
| 文档 | 文档属性标题必须和 types.d.ts 中定义一致 如 types.d.ts 用 ComponentItemProps，文档不能用 TabsItemProps                                                                           |      |
| 文档 | 文档中所有类型、属性、参数、默认值必须与 types.d.ts 一致，以 types.d.ts 为准                                                                                                     |      |
| 文档 | 标准类型必须包裹在``中，如`string`、`number` 等                                                                                                                                  |      |
| 文档 | 非标准类型使用链接指向说明 如 [`ComponentMode`](#componentmode)，文档最下方用 2 列表格（类型值、说明）说明                                                                       |      |
| 文档 | 文档中默认值必须和 type.d.ts 中定义一致                                                                                                                                          |      |
| 文档 | 数组类型必须包裹在``中，如`Array<T>`，其中 T 为数组元素类型                                                                                                                      |      |
| 文档 | type.d.ts 中类型为`undefined`，在.md 文档中不显示，如果默认值为`undefined`，md 文档中则显示为`-` 例如： @type `number` \| `string` \| `undefined` 文档中显示为`boolean` `string` |      |
| 文档 | 类型 `LanguagePackageType` 链接地址 `/document/PancakeUI_Doc/options#languagepackagetype`                                                                                        |      |
| 文档 | 文档中类型和类型之间用空格隔开 如 `Array<string>` `string`                                                                                                                       |      |
| 文档 | 字符串字面量用反引号包裹单引号内容 如插槽名、类型值等，如 `'default'`、`'portrait'`                                                                                              |      |
| 文档 | 表格内容中的 `|` 作为类型联合符号时必须转义为 `\|`，避免 Markdown 表格渲染错误；`<>` 不需要转义，如 `Array<string>` 保持原样                                                      |      |
| 文档 | 文档中的类型名称（如 ComponentProps、ComponentItemProps）必须与 types.d.ts 中的定义一致，不能凭猜测修改，必须对比 types.d.ts 文件确认                                       |      |
