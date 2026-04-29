# Media View 媒体展示查看器

`pa-media-view` 用于查看媒体文件（图片、PDF、Word、Excel、文本）。

:::warning 注意
`pa-media-view` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue"></demo>

## ComponentProps

| 属性名   | 描述             | 类型                               | 默认值  |
| -------- | ---------------- | ---------------------------------- | ------- |
| id       | 组件唯一标识     | `string`                           | -       |
| class    | 自定义类名       | `Array<string>` \| `string`        | -       |
| style    | 自定义样式       | `Record<string, string \| number>` | -       |
| fileList | 文件列表         | `Array<ComponentItemProps>`        | -       |
| hideBtn  | 是否隐藏开启按钮 | `boolean`                          | `false` |

## ComponentItemProps

| 属性名       | 描述             | 类型                               | 默认值 |
| ------------ | ---------------- | ---------------------------------- | ------ |
| id           | 组件唯一标识     | `string`                           | -      |
| class        | 自定义类名       | `Array<string>` \| `string`        | -      |
| style        | 自定义样式       | `Record<string, string \| number>` | -      |
| file         | 文件源对象       | `object`                           | -      |
| filePath     | 文件路径         | `string`                           | -      |
| fileName     | 文件名称         | `string`                           | -      |
| OriginalName | 原始文件名称     | `string`                           | -      |
| FileName     | 文件名称（备选） | `string`                           | -      |

## ComponentEmits

无

## ComponentSlots

| 插槽名称       | 作用                   |
| -------------- | ---------------------- |
| 'default'      | 默认触发按钮内容       |
| 'downloadBody' | 下载区域自定义内容     |
| 'downloadItem' | 下载当前文件按钮自定义 |
| 'downloadAll'  | 下载全部文件按钮自定义 |
