# Popover 弹出框

`pa-popover` 用于创建一个弹出框，支持多种触发方式和位置配置。

## 基础使用

使用 `placement` 属性配置弹出框的位置。

<demo src="./base.vue"></demo>

## 触发方式

使用 `trigger` 属性配置触发方式，默认值为 `click`。

<demo src="./trigger.vue"></demo>

## 禁用状态

使用 `disabled` 属性禁用弹出框。

<demo src="./disabled.vue"></demo>

## 弹出层宽度

使用 `popover-width` 属性设置弹出层宽度，使用 `auto-width` 属性自动跟随参考元素宽度。

<demo src="./width.vue"></demo>

## 粘性定位

使用 `sticky` 属性设置弹出框的粘性定位方向。

<demo src="./sticky.vue"></demo>

## ComponentProps

| 属性名             | 描述             | 类型                                           | 默认值     |
| ------------------ | ---------------- | ---------------------------------------------- | ---------- |
| id                 | 弹窗标识         | `string`                                       | -          |
| class              | 自定义类名       | `Array<string>` \| `string`                    | -          |
| popover-class      | 弹窗类名         | `string`                                       | -          |
| style              | 自定义样式       | `Record<string, string>`                       | -          |
| reference-style    | 参考元素样式     | `Record<string, string>`                       | -          |
| disabled           | 是否禁用         | `boolean`                                      | `false`    |
| teleport-to        | 弹窗挂载位置     | `string`                                       | `'body'`   |
| placement          | 弹窗位置         | `'bottom'` \| `'left'` \| `'right'` \| `'top'` | `'bottom'` |
| trigger            | 触发方式         | `'click'` \| `'hover'`                         | `'click'`  |
| content-class-name | 内容类名         | `string`                                       | `''`       |
| popover-width      | 弹出层宽度       | `number`                                       | `200`      |
| stop-propagation   | 是否阻止事件冒泡 | `boolean`                                      | `false`    |
| auto-width         | 是否自动宽度     | `boolean`                                      | `false`    |
| target-close       | 是否点击外部关闭 | `boolean`                                      | `true`     |
| sticky             | 是否粘性定位     | `'left'` \| `'right'`                          | -          |
| close-by-scroll    | 是否点击滚动关闭 | `boolean`                                      | `true`     |
| before-close       | 关闭前回调       | `() => boolean`                                | -          |

## ComponentEmits

| 事件名 | 描述             | 回调函数                     |
| ------ | ---------------- | ---------------------------- |
| change | 弹窗显示状态变化 | `(visible: boolean) => void` |

## ComponentSlots

| 插槽名称    | 描述     |
| ----------- | -------- |
| 'default'   | 弹窗内容 |
| 'reference' | 触发元素 |
