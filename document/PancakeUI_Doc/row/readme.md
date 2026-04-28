# Row 栅格行

`pa-row` 用于栅格布局中的行组件，需要配合 `pa-col` 使用。

## 基础用法

配合 `pa-col` 实现栅格布局。

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格间隔 | `string` | - |
| edgeGutter | 边缘栅格间隔 | `string` | - |
| justify | 水平排列方式 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'` | `'start'` |
| align | 垂直排列方式 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| tag | 自定义元素标签 | `string` | `'div'` |
