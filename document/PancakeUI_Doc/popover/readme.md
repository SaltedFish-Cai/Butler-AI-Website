# Popover 弹出框

`pa-popover` 用于创建一个弹出框，支持多种触发方式和位置配置。

## 基础使用

<demo src="./base.vue"></demo>

## 触发方式

<demo src="./trigger.vue"></demo>

## Props

| 字段             | 描述             | 类型                             | 默认值      |
| ---------------- | ---------------- | -------------------------------- | ----------- |
| id               | 弹窗标识         | `string`                         | —           |
| class            | 自定义类名       | `string`                         | - |
| popoverClass     | 弹窗类名         | `string`                         | - |
| style            | 自定义样式       | `Record<string, string>`         | - |
| referenceStyle   | 参考元素样式     | `Record<string, string>`         | - |
| disabled         | 是否禁用         | `boolean`                        | `false`     |
| teleportTo       | 弹窗挂载位置     | `string`                         | `"body"`    |
| placement        | 弹窗位置         | `"bottom" \| "top"`              | `"top"`     |
| trigger          | 触发方式         | `"click" \| "hover"`             | `"click"`   |
| contentClassName | 内容类名         | `string`                         | `""`        |
| popoverWidth     | 弹出层宽度       | `number`                         | `200`       |
| stopPropagation  | 是否阻止事件冒泡 | `boolean`                        | `false`     |
| autoWidth        | 是否自动宽度     | `boolean`                        | `true`      |
| targetClose      | 是否点击外部关闭 | `boolean`                        | `true`      |
| sticky           | 是否粘性定位     | `"left" \| "right" \| undefined` | - |
| closeByScroll    | 是否点击滚动关闭 | `boolean`                        | `true`      |
| beforeClose      | 关闭前回调       | `() => boolean`                  | - |

## Events

| 事件   | 描述             | 类型                         |
| ------ | ---------------- | ---------------------------- |
| change | 弹窗显示状态变化 | `(visible: boolean) => void` |
