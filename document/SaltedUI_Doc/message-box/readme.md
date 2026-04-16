# MessageBox 确认弹窗

确认弹窗组件，用于确认用户操作。

## 基础用法

<demo src="./base.vue"></demo>

## `MessageBoxOptions`

| 属性名                   | 描述                                                                 | 类型                                                    | 默认值    |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------- | --------- |
| title                    | 弹窗标题，支持多语言                                                 | `Record<"en-US" \| "zh-CN", string>`                    | —         |
| message                  | 弹窗消息，支持多语言                                                 | `Record<"en-US" \| "zh-CN", string>`                    | —         |
| isType                   | 是否为确认弹窗，确认按钮为 `primary` 类型，取消按钮为 `default` 类型 | `"confirm"` `undefined`                                 | `false`   |
| type                     | 弹窗类型，影响弹窗样式和按钮类型                                     | `default` `info` `primary` `success` `warning` `danger` | `default` |
| customClass              | 自定义弹窗类名，用于自定义弹窗样式                                   | `string`                                                | —         |
| confirmButtonText        | 确认按钮文本，支持多语言                                             | `Record<"en-US" \| "zh-CN", string>`                    | —         |
| cancelButtonText         | 取消按钮文本，支持多语言                                             | `Record<"en-US" \| "zh-CN", string>`                    | —         |
| onConfirm                | 确认按钮点击回调函数                                                 | `() => void`                                            | —         |
| onClose                  | 取消按钮点击回调函数                                                 | `() => void`                                            | —         |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串                 | `boolean`                                               | `false`   |
| zIndex                   | 弹窗的 z-index 值，默认自增长                                        | `number`                                                | —         |
