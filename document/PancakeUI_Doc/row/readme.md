# Row 栅格行

`pa-row` 用于栅格布局中的行组件。

## 基础用法

使用 `gutter` 实现栅格间隔，当你不设置 `gutter` 时，默认使用 `var(--pa-size-padding)` 作为栅格间隔。

<demo src="./base.vue">
</demo>

## 对齐方式

使用 `justify` 实现水平排列方式和 `align` 实现垂直对齐方式。

<demo src="./justify.vue">
</demo>

## ComponentProps

| 属性名  | 描述         | 类型                              | 默认值    |
| ------- | ------------ | --------------------------------- | --------- |
| id      | 唯一标识     | `string`                          | -         |
| class   | 自定义类名   | `Array<string>` `string`          | -         |
| style   | 自定义样式   | `Record<string, number` `string>` | -         |
| gutter  | 栅格间隔     | `number` `string`                 | -         |
| justify | 水平排列方式 | [`RowJustify`](#rowjustify)       | `'start'` |
| align   | 垂直排列方式 | [`RowAlign`](#rowalign)           | `'top'`   |

## ComponentEmits

无

## ComponentSlots

| 插槽名称  | 描述                         |
| --------- | ---------------------------- |
| 'default' | 行内容，通常放置 pa-col 组件 |

## RowJustify

| 类型值            | 说明     |
| ----------------- | -------- |
| `'start'`         | 左对齐   |
| `'end'`           | 右对齐   |
| `'center'`        | 居中对齐 |
| `'space-around'`  | 等距分布 |
| `'space-between'` | 两端对齐 |

## RowAlign

| 类型值     | 说明     |
| ---------- | -------- |
| `'top'`    | 顶部对齐 |
| `'center'` | 居中对齐 |
| `'bottom'` | 底部对齐 |
