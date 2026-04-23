# Tag 标签

`pa-tag` 用于展示一组标签，支持折叠和删除功能。

## 基础使用

<demo src="./base.vue"></demo>

## 折叠模式

<demo src="./collapse.vue"></demo>

## ComponentProps

| 属性名       | 描述               | 类型                              | 默认值  |
| ------------ | ------------------ | --------------------------------- | ------- |
| id           | 唯一标识           | `string`                          | -       |
| class        | 自定义类名         | `Array<string>` `string`          | -       |
| style        | 自定义样式         | `Record<string, string>`          | -       |
| tagList      | 标签列表           | `TagListType`                     | `[]`    |
| useCollapse  | 是否折叠           | `boolean`                         | `false` |
| popoverWidth | 弹出层宽度         | `number`                          | `200`   |
| disabled     | 是否禁用删除功能   | `boolean`                         | `false` |

## ComponentEmits

| 事件名    | 描述           | 回调函数                            | 函数参数                    |
| --------- | -------------- | ----------------------------------- | --------------------------- |
| removeTag | 删除标签时触发 | `(data: TagListItem) => void`       | `{ label, value }`          |
