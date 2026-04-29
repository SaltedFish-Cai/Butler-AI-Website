# Row 栅格行

`pa-row` 用于栅格布局中的行组件，需要配合 `pa-col` 使用。

## 基础用法

配合 `pa-col` 实现栅格布局。

## ComponentProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格间隔 | `string` | - |
| edgeGutter | 边缘栅格间隔 | `string` | - |
| justify | 水平排列方式 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'` | `'start'` |
| align | 垂直排列方式 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| tag | 自定义元素标签 | `string` | `'div'` |
| class | 自定义类名 | `Array<string> \| string` | - |
| style | 自定义样式 | `Record<string, string \| number>` | - |
| id | 元素 id | `string` | - |

## ComponentEmits

无

## ComponentSlots

| 插槽名 | 说明 |
| --- | --- |
| default | 行内容，通常放置 pa-col 组件 |
