# EasyTable 简易表格

基于虚拟滚动的简易表格组件，支持大数据量渲染、卡片模式和更多内容折叠。

## 基础用法

使用 `columns` 定义列，`data` 绑定数据。

<demo src="./base.vue"></demo>

## 卡片模式

使用 `card` 开启卡片模式，改变表格外观样式。

<demo src="./card.vue"></demo>

## 更多内容折叠

使用 `maxChild` 限制单元格内最大显示数量，超出部分显示 "+N" 按钮，hover 查看全部。

<demo src="./max-child.vue"></demo>

## ComponentProps

| 属性名 | 描述 | 类型 | 默认值 |
| ---------------- | ---------------- | ---------------- | ---------------- |
| id | 组件唯一标识 | `string` | - |
| class | 自定义类名 | `Array<string>` `string` | - |
| style | 自定义样式 | `Record<string, string>` | - |
| columns | 表格列定义 | [`Array<ColumnDef>`](#columndef) | - |
| data | 表格数据 | `Array<Record<string, any>>` | - |
| title | 表格标题 | `string` | - |
| rowHeight | 行高 | `number` | `78` |
| card | 是否为卡片模式 | `boolean` | `false` |

## ComponentEmits

| 事件名 | 描述 | 回调函数 |
| ---------------- | ---------------- | ---------------- |
| rowClick | 行点击时触发 | `(row: Record<string, any>) => void` |

## ColumnDef

列定义数据结构。

| 属性名 | 描述 | 类型 | 默认值 |
| ---------------- | ---------------- | ---------------- | ---------------- |
| key | 列字段名 | `string` | - |
| label | 列表头文本 | `string` | - |
| width | 列宽 | `string` | - |
| slot | 自定义插槽名 | `string` | - |
| maxChild | 最大显示子元素数量 | `number` | - |
