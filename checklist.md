| 序号 | 维度       | 要求                                                                                                                     |
| ---- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1    | types.d.ts | 文件命名为 types.d.ts 非 type.d.ts                                                                                       |
| 2    | types.d.ts | 类型名称为 ComponentProps ComponentEmits 其他类型名称为 Component+类型名称（如 ComponentItemProps、ComponentLabelProps） |
| 3    | types.d.ts | 必选属性：id、class、style 三个都必须存在 id 类型：string; class Array<string> \| string; style Record<string, string>   |
| 4    | types.d.ts | 所有 import 有 JSDoc 注释 包含 @description ...                                                                          |
| 5    | types.d.ts | 所有 export type 有 JSDoc 注释 @type、@description                                                                       |
| 6    | types.d.ts | 所有属性有完整 JSDoc 注释 @type、@default、@description                                                                  |
| 7    | types.d.ts | @type 格式规范 可选属性含 undefined                                                                                      |
| 8    | types.d.ts | 数组类型使用 Array 非 type[]                                                                                             |
| 9    | types.d.ts | ComponentEmits 函数重载格式 (e: "eventName", param): void;                                                               |
| 10   | index.scss | 文件命名为 index.scss 独立文件，Vue 通过 @use 引入                                                                       |
| 11   | index.scss | 缩进为 2 空格 统一缩进格式                                                                                               |
| 12   | index.scss | 根元素类名规范 .pa-{组件名}（如 .pa-button）                                                                             |
| 14   | index.scss | 子元素包含在根元素内 避免全局污染                                                                                        |
| 15   | index.scss | 无单行注释（// xxx） 如有则删除                                                                                          |
| 16   | index.scss | 无被注释掉的代码 如有则删除                                                                                              |
| 17   | index.scss | class 之间有空行分隔 提高可读性                                                                                          |
| 18   | index.scss | 样式属性使用 CSS 变量 如 --pa-color-primary、--pa-size-font                                                              |
| 19   | index.scss | 无硬编码颜色值 使用 CSS 变量而非 #409eff 等                                                                              |
| 20   | index.scss | 无 !important 滥用 仅在必要时使用                                                                                        |
| 21   | Vue 文件   | 所有 import 有 JSDoc 注释 包含 @description ...                                                                          |
| 22   | Vue 文件   | 所有变量有 JSDoc 注释 ref、reactive、computed、let 等                                                                    |
| 23   | Vue 文件   | 所有函数有完整 JSDoc 注释 @param、@returns、@description                                                                 |
| 24   | Vue 文件   | 所有 watch 有 JSDoc 注释                                                                                                 |
| 25   | Vue 文件   | 所有生命周期钩子有 JSDoc 注释                                                                                            |
| 26   | Vue 文件   | 无单行注释 改用 JSDoc 风格                                                                                               |
| 27   | Vue 文件   | 无被注释掉的代码 如有则删除                                                                                              |
| 28   | Vue 文件   | defineEmits 类型化写法 defineEmits<ComponentEmits>()                                                                     |
| 29   | Vue 文件   | oldValue 类型定义 需显式类型                                                                                             |
| 30   | index.ts   | 所有 import 有 JSDoc 注释                                                                                                |
| 31   | index.ts   | install 参数类型为 App 非 any                                                                                            |
| 32   | index.ts   | install 函数有 JSDoc 注释 @param、@description                                                                           |
| 33   | index.ts   | name 属性有 JSDoc 注释                                                                                                   |
| 34   | 其他 .ts   | 所有 import 有 JSDoc 注释 注释 包含 @description ...                                                                     |
| 35   | 其他 .ts   | 所有 export 有 JSDoc 注释 类型/函数/常量                                                                                 |
| 36   | 其他 .ts   | 所有函数有完整 JSDoc 注释 @param、@returns、@description                                                                 |
| 37   | 其他 .ts   | 所有变量/常量有 JSDoc 注释                                                                                               |
| 38   | 其他 .ts   | 无单行注释 改用 JSDoc 风格                                                                                               |
| 39   | 其他 .ts   | 数组类型使用 Array                                                                                                       |
| 40   | 其他 .ts   | 可选参数类型含 undefined                                                                                                 |
| 41   | 文档       | 组件名称格式 pa-{组件名} 格式                                                                                            |
| 42   | 文档       | 组件描述 中文，100 字以内                                                                                                |
| 43   | 文档       | ComponentProps 表格完整 属性名、描述、类型、默认值 四列                                                                  |
| 44   | 文档       | ComponentProps 类型一致 与 types.d.ts 中定义一致                                                                         |
| 45   | 文档       | ComponentEmits 表格完整 事件名、描述、回调函数 三列                                                                      |
| 46   | 文档       | ComponentEmits 回调格式一致 与 types.d.ts 中 ComponentEmits 一致                                                         |
| 47   | 文档       | ComponentSlots 表格完整 插槽名称、作用 两列（如存在）                                                                    |
| 48   | 文档       | 示例文件 base.vue 存在 必须存在                                                                                          |
| 49   | 文档       | 示例文件可运行 无语法错误                                                                                                |
| 50   | 文档       | 文档根据 ComponentProps 参数创建更多示例                                                                                 |
| 51   | 文档       | 文档属性标题必须和 type.d.ts 中定义一致                                                                                  |
| 52   | 文档       | 文档中类型必须和 type.d.ts 中定义一致                                                                                    |
| 53   | 文档       | 标准类型必须包裹在``中，如`string`、`number` 等                                                                          |
| 54   | 文档       | 非标准类型必须在文档最下方说明，如自定义类型、枚举类型等 ，并使用链接指向定义位置                                        |
| 55   | 文档       | 文档中默认值必须和 type.d.ts 中定义一致                                                                                  |
| 56   | 文档       | 数组类型必须包裹在``中，如`Array<T>`，其中 T 为数组元素类型                                                              |
| 57   | 文档       | type.d.ts 中类型为`undefined`，文档中不显示，默认值`undefined`显示为`-`                                                  |
| 58   | 文档       | 类型 `LanguagePackageType` 链接地址 `/document/PancakeUI_Doc/options#languagepackagetype`                                |
| 59   | 文档       | 文档中类型和类型之间用空格隔开                                                                                           |
