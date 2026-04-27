| 维度       | 要求                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| types.d.ts | 文件命名为 types.d.ts 非 type.d.ts                                                                                                                      |
| types.d.ts | 类型名称为 ComponentProps ComponentEmits 其他类型名称为 Component+类型名称（如 ComponentItemProps、ComponentLabelProps）                                |
| types.d.ts | 必选属性：id、class、style 三个都必须存在 id 类型：string; class Array<string> \| string; style Record<string, string>                                  |
| types.d.ts | 所有 import 有 JSDoc 注释 包含 @description ...                                                                                                         |
| types.d.ts | 所有 export type 有 JSDoc 注释 @type、@description                                                                                                      |
| types.d.ts | 所有属性有完整 JSDoc 注释 @type、@default、@description                                                                                                 |
| types.d.ts | @type 格式规范 可选属性含 undefined                                                                                                                     |
| types.d.ts | 数组类型使用 Array 非 type[]                                                                                                                            |
| types.d.ts | ComponentEmits 函数重载格式 (e: "eventName", param): void;                                                                                              |
| index.scss | 文件命名为 index.scss 独立文件，Vue 通过 @use 引入                                                                                                      |
| index.scss | 缩进为 2 空格 统一缩进格式                                                                                                                              |
| index.scss | 根元素类名规范 .pa-{组件名}（如 .pa-button）                                                                                                            |
| index.scss | 子元素包含在根元素内 避免全局污染                                                                                                                       |
| index.scss | 无单行注释（// xxx） 如有则删除                                                                                                                         |
| index.scss | 无被注释掉的代码 如有则删除                                                                                                                             |
| index.scss | class 之间有空行分隔 提高可读性                                                                                                                         |
| index.scss | 样式属性使用 CSS 变量 如 --pa-color-primary、--pa-size-font                                                                                             |
| index.scss | 无硬编码颜色值 使用 CSS 变量而非 #409eff 等                                                                                                             |
| Vue 文件   | 所有 import 有 JSDoc 注释 包含 @description ...                                                                                                         |
| Vue 文件   | 所有变量有 JSDoc 注释 ref、reactive、computed、let 等                                                                                                   |
| Vue 文件   | 所有函数有完整 JSDoc 注释 @param、@returns、@description                                                                                                |
| Vue 文件   | 所有 watch 有 JSDoc 注释                                                                                                                                |
| Vue 文件   | 所有生命周期钩子有 JSDoc 注释                                                                                                                           |
| Vue 文件   | 无单行注释 改用 JSDoc 风格                                                                                                                              |
| Vue 文件   | 无被注释掉的代码 如有则删除                                                                                                                             |
| Vue 文件   | defineEmits 类型化写法 defineEmits<ComponentEmits>()                                                                                                    |
| Vue 文件   | oldValue 类型定义 需显式类型                                                                                                                            |
| index.ts   | 所有 import 有 JSDoc 注释                                                                                                                               |
| index.ts   | install 参数类型为 App 非 any                                                                                                                           |
| index.ts   | install 函数有 JSDoc 注释 @param、@description                                                                                                          |
| index.ts   | name 属性有 JSDoc 注释                                                                                                                                  |
| 其他 .ts   | 所有 import 有 JSDoc 注释 注释 包含 @description ...                                                                                                    |
| 其他 .ts   | 所有 export 有 JSDoc 注释 类型/函数/常量                                                                                                                |
| 其他 .ts   | 所有函数有完整 JSDoc 注释 @param、@returns、@description                                                                                                |
| 其他 .ts   | 所有变量/常量有 JSDoc 注释                                                                                                                              |
| 其他 .ts   | 无单行注释 改用 JSDoc 风格                                                                                                                              |
| 其他 .ts   | 数组类型使用 Array                                                                                                                                      |
| 其他 .ts   | 可选参数类型含 undefined                                                                                                                                |
| 文档       | 组件名称格式 pa-{组件名} 格式                                                                                                                           |
| 文档       | 组件描述 中文，100 字以内                                                                                                                               |
| 文档       | ComponentProps 表格完整 属性名、描述、类型、默认值 四列                                                                                                 |
| 文档       | ComponentProps 类型一致 与 types.d.ts 中定义一致                                                                                                        |
| 文档       | ComponentEmits 表格完整 事件名、描述、回调函数 三列                                                                                                     |
| 文档       | ComponentEmits 回调格式一致 与 types.d.ts 中 ComponentEmits 一致                                                                                        |
| 文档       | ComponentSlots 表格完整 插槽名称、作用 两列（如存在），插槽名用单引号包裹                                                                                                   |
| 文档       | 示例文件 base.vue 存在 必须存在                                                                                                                         |
| 文档       | 示例文件可运行 无语法错误                                                                                                                               |
| 文档       | 文档根据 ComponentProps 参数创建更多示例                                                                                                                |
| 文档       | 文档属性标题必须和 types.d.ts 中定义一致 如 types.d.ts 用 ComponentItemProps，文档不能用 TabsItemProps                                                  |
| 文档       | 文档中类型必须和 type.d.ts 中定义一致                                                                                                                   |
| 文档       | 标准类型必须包裹在``中，如`string`、`number` 等                                                                                                         |
| 文档       | 非标准类型使用链接指向说明 如 [`ComponentMode`](#componentmode)，文档最下方用 2 列表格（类型值、说明）说明                                              |
| 文档       | 文档中默认值必须和 type.d.ts 中定义一致                                                                                                                 |
| 文档       | 数组类型必须包裹在``中，如`Array<T>`，其中 T 为数组元素类型                                                                                             |
| 文档       | type.d.ts 中类型为`undefined`，文档中不显示，默认值`undefined`显示为`-` 例如： @type `number` \| `string` \| `undefined` 文档中显示为`boolean` `string` |
| 文档       | 类型 `LanguagePackageType` 链接地址 `/document/PancakeUI_Doc/options#languagepackagetype`                                                               |
| 文档       | 文档中类型和类型之间用空格隔开 如 `Array<string>` `string`                                                                                              |
| 文档       | 字符串字面量用单引号包裹 如插槽名、类型值等，如 'default'、'portrait'                                                                                   |
