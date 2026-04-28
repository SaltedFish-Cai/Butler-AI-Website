# File 文件

常用于上传文件的场景。

:::warning 注意
`pa-file` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue"></demo>

## Custom 功能展示

<demo src="./item.vue"></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，已上传的文件将以只读方式展示。

<demo src="./display.vue"></demo>

## ComponentProps

| 属性名           | 描述                         | 类型                                                                                     | 默认值 |
| ---------------- | ---------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| id               | 组件唯一标识                 | `string`                                                                                 | -      |
| class            | 自定义类名                   | `Array<string>` \| `string`                                                              | -      |
| style            | 自定义样式                   | `Record<string, string>`                                                                 | -      |
| modelValue       | 绑定值                       | [`Array<FileDataType>`](#filedatatype)                                                   | -      |
| attachedData     | 文件上传额外参数/数据        | `Record<string, any>`                                                                    | -      |
| placeholder      | 输入框提示                   | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -      |
| disabled         | 禁用状态                     | `boolean`                                                                                | -      |
| fileMultiple     | 上传文件数量限制             | `number`                                                                                 | -      |
| display          | 纯展示                       | `boolean`                                                                                | -      |
| displayValue     | 纯展示类型下，直接显示值     | `string`                                                                                 | -      |
| fileIncludeType  | 文件类型限制 包含            | `Array<string>`                                                                          | -      |
| fileIncludeText  | 允许上传文件类型的文本描述   | `Array<string>`                                                                          | -      |
| fileExcludeType  | 文件类型限制 不包含          | `Array<string>`                                                                          | -      |
| fileExcludeText  | 不允许上传文件类型的文本描述 | `Array<string>`                                                                          | -      |
| fileSingleSize   | 单文件大小限制               | `number`                                                                                 | -      |
| fileAllSize      | 单次总包文件大小限制         | `number`                                                                                 | -      |
| downloadTemplate | 下载模板按钮执行方法         | `() => void`                                                                             | -      |
| contrastData     | 对比用原数据                 | [`Array<FileDataType>`](#filedatatype)                                                   | -      |
| alwaysContrast   | 是否总是显示对不数据         | `boolean`                                                                                | -      |
| title            | 表单项标签                   | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -      |
| titleWidth       | 表单项标签宽度               | `string`                                                                                 | -      |

## ComponentEmits

| 事件名            | 描述             | 回调函数                                                                        |
| ----------------- | ---------------- | ------------------------------------------------------------------------------- |
| update:modelValue | 双向绑定值更新时 | `(value: Array<FileDataType>) => void`                                          |
| change            | 数据变更回调函数 | `(data: { value: Array<FileDataType>; oldValue: Array<FileDataType> }) => void` |
| changeState       | 状态变更事件     | `(state: "Pending" \| "Working") => void`                                       |

## FileDataType

| 字段         | 描述         | 类型                    | 默认值 |
| ------------ | ------------ | ----------------------- | ------ |
| FileId       | 文件 ID      | `string`                | -      |
| FullPath     | 完整路径     | `string`                | -      |
| FileName     | 文件名       | `string` \| `undefined` | -      |
| FileUrl      | 文件相对路径 | `string` \| `undefined` | -      |
| OriginalName | 原始文件名   | `string` \| `undefined` | -      |

## ComponentSlots

| 插槽名称   | 作用                       |
| ---------- | -------------------------- |
| exDisplay  | 纯展示模式下自定义展示内容 |
| exContrast | 对比数据自定义展示内容     |
