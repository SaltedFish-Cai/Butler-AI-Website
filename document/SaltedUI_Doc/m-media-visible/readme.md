# File 文件

:::warning 注意
`m-media-view-v2` 可独立使用，在 `m-form-v2/m-table-v2` 中可使用时，需配置 `prop` 字段。
:::

## `MMediaViewV2Type`

| 字段     | 类型                          | 默认值  | 描述             |
| -------- | ----------------------------- | ------- | ---------------- |
| fileList | `Array<MMediaViewV2ItemType>` |         | 绑定值           |
| hideBtn  | `boolean`                     | `false` | 是否显示开启按钮 |

## `MMediaViewV2ItemType`

| 字段         | 类型              | 默认值 | 描述         |
| ------------ | ----------------- | ------ | ------------ |
| FileId       | `string`          |        | 文件 ID      |
| FullPath     | `string` `number` |        | 完整路径     |
| FileName     | `boolean`         |        | 文件名       |
| FileUrl      | `boolean`         |        | 文件相对路径 |
| OriginalName | `boolean`         |        | 相对文件名   |

## 组件功能展示

<demo src="./base.vue" ></demo>
