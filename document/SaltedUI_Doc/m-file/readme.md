# File 文件

:::warning 注意
`m-file` 可独立使用，在 `m-form/m-table` 中可使用时，需配置 `prop` 字段。
:::

## `MFileV2Type`

| 字段             | 类型                                          | 默认值  | 描述                          |
| ---------------- | --------------------------------------------- | ------- | ----------------------------- |
| modelValue       | `Array<MFileV2DataType>`                      | —       | 绑定值                        |
| attachedData     | `object`                                      | —       | 文件上传额外参数/数据         |
| placeholder      | `Record<"en-US" \| "zh-CN", string>` `string` | —       | 输入框提示                    |
| disabled         | `boolean`                                     | —       | 禁用状态                      |
| fileMultiple     | `number`                                      | —       | 上传文件数量限制              |
| display          | `boolean`                                     | —       | 纯展示                        |
| fileIncludeType  | `Array<string>`                               | —       | 文件类型限制 包含             |
| fileExcludeType  | `Array<string>`                               | —       | 文件类型限制 不包含           |
| fileSingleSize   | `number`                                      | —       | 文件类型限制 单文件大小       |
| fileAllSize      | `number`                                      | —       | 文件类型限制 单次总包文件大小 |
| downloadTemplate | `() => void;`                                 | —       | 下载模板按钮执行方法          |
| contrastData     | `Array<MFileV2DataType>`                      | —       | 对比用原数据                  |
| alwaysContrast   | `boolean`                                     | `false` | 是否总是显示对不数据          |

## `MFileV2Events`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## `MFileV2DataType`

| 字段         | 类型              | 默认值 | 描述         |
| ------------ | ----------------- | ------ | ------------ |
| FileId       | `string`          | —      | 文件 ID      |
| FullPath     | `string` `number` | —      | 完整路径     |
| FileName     | `boolean`         | —      | 文件名       |
| FileUrl      | `boolean`         | —      | 文件相对路径 |
| OriginalName | `boolean`         | —      | 相对文件名   |

## 组件功能展示

<demo src="./base.vue" ></demo>
