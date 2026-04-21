# File 文件

常用于上传文件的场景。

:::warning 注意
`m-file` 可独立使用，在 `m-form/m-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaFileType`

| 字段             | 描述                          | 类型                                          | 默认值  |
| ---------------- | ----------------------------- | --------------------------------------------- | ------- |
| modelValue       | 绑定值                        | `Array<SaFileDataType>`                       | —       |
| attachedData     | 文件上传额外参数/数据         | `object`                                      | —       |
| placeholder      | 输入框提示                    | `Record<"en-US" \| "zh-CN", string>` `string` | —       |
| disabled         | 禁用状态                      | `boolean`                                     | —       |
| fileMultiple     | 上传文件数量限制              | `number`                                      | —       |
| display          | 纯展示                        | `boolean`                                     | —       |
| fileIncludeType  | 文件类型限制 包含             | `Array<string>`                               | —       |
| fileExcludeType  | 文件类型限制 不包含           | `Array<string>`                               | —       |
| fileSingleSize   | 文件类型限制 单文件大小       | `number`                                      | —       |
| fileAllSize      | 文件类型限制 单次总包文件大小 | `number`                                      | —       |
| downloadTemplate | 下载模板按钮执行方法          | `() => void;`                                 | —       |
| contrastData     | 对比用原数据                  | `Array<SaFileDataType>`                       | —       |
| alwaysContrast   | 是否总是显示对不数据          | `boolean`                                     | `false` |

## `SaFileEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |

## `SaFileDataType`

| 字段         | 描述         | 类型              | 默认值 |
| ------------ | ------------ | ----------------- | ------ |
| FileId       | 文件 ID      | `string`          | —      |
| FullPath     | 完整路径     | `string` `number` | —      |
| FileName     | 文件名       | `string` | `undefined` | —      |
| FileUrl      | 文件相对路径 | `string` | `undefined` | —      |
| OriginalName | 相对文件名   | `string` | `undefined` | —      |


## Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 组件唯一标识 | `string` | `undefined` |
| class | 自定义类名 | `string` | `undefined` |
| style | 自定义样式 | `Record<string, string>` | `undefined` |
| fileIncludeText | 允许上传文件类型的文本描述 | `string[]` | `undefined` |
| fileExcludeText | 不允许上传文件类型的文本描述 | `string[]` | `undefined` |
| onChange | 数据变更回调函数 | `({ value, oldValue }) => void` | `undefined` |
| onChange | 数据变更回调函数 | `({ value, oldValue }) => void` | `undefined` |
