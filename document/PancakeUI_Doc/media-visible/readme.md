# Media View 媒体展示查看器

用于查看媒体文件（图片）。

:::warning 注意
`sa-media-view` 可独立使用，在 `sa-form/sa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaMediaViewType`

| 字段     | 描述             | 类型                         | 默认值  |
| -------- | ---------------- | ---------------------------- | ------- |
| fileList | 绑定值           | `Array<SaMediaViewItemType>` |         |
| hideBtn  | 是否显示开启按钮 | `boolean`                    | `false` |

## `SaMediaViewItemType`

| 字段         | 描述         | 类型              | 默认值 |
| ------------ | ------------ | ----------------- | ------ |
| FileId       | 文件 ID      | `string`          |        |
| FullPath     | 完整路径     | `string` `number` |        |
| FileName     | 文件名       | `boolean`         |        |
| FileUrl      | 文件相对路径 | `boolean`         |        |
| OriginalName | 相对文件名   | `boolean`         |        |
