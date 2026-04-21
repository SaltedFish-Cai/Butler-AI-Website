# Tag 标签

`pa-tag` 用于展示一组标签，支持折叠和删除功能。

## 基础使用

<demo src="./base.vue"></demo>

## 折叠模式

<demo src="./collapse.vue"></demo>

## Props

| 字段         | 描述       | 类型                     | 默认值      |
| ------------ | ---------- | ------------------------ | ----------- |
| class        | 自定义类名 | `string`                 | `undefined` |
| style        | 自定义样式 | `Record<string, string>` | `undefined` |
| tagList      | 标签列表   | `TagListType`            | `[]`        |
| useCollapse  | 是否折叠   | `boolean`                | `false`     |
| popoverWidth | 弹出层宽度 | `number`                 | `200`       |
| disabled     | 是否禁用   | `boolean`                | `false`     |

## Events

| 事件      | 描述           | 类型                               |
| --------- | -------------- | ---------------------------------- |
| removeTag | 删除标签时触发 | `(data: { label, value }) => void` |
