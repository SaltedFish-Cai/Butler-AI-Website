# Row 栅格行

`pa-row` 用于栅格布局中的行组件。

## 基础用法

使用 `gutter` 实现栅格间隔，当你没有不设置 `gutter` 时，默认使用 `var(--pa-size-padding)` 作为栅格间隔。

<demo src="./base.vue"></demo>

## 对齐方式

使用 `justify` 实现垂直对齐方式 和 `align` 实现水平对齐方式。

<demo src="./justify.vue"></demo>

## ComponentProps

| 参数    | 说明           | 类型                                                                | 默认值    |
| ------- | -------------- | ------------------------------------------------------------------- | --------- |
| id      | 元素 id        | `string`                                                            | -         |
| class   | 自定义类名     | `Array<string> \| string`                                           | -         |
| style   | 自定义样式     | `Record<string, string \| number>`                                  | -         |
| gutter  | 栅格间隔       | `string`                                                            | -         |
| justify | 垂直排列方式   | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'` | `'start'` |
| align   | 水平排列方式   | `'top' \| 'center' \| 'bottom'`                                     | `'top'`   |
| tag     | 自定义元素标签 | `string`                                                            | `'div'`   |

## ComponentEmits

无

## ComponentSlots

| 插槽名  | 说明                         |
| ------- | ---------------------------- |
| default | 行内容，通常放置 pa-col 组件 |
