# MessageBox 确认弹窗

确认弹窗组件，用于确认用户操作。

## `MessageBoxOptions`

| 属性名                   | 类型                                                    | 默认值    | 描述                                                                 |
| ------------------------ | ------------------------------------------------------- | --------- | -------------------------------------------------------------------- |
| title                    | `Record<"en-US" \| "zh-CN", string>`                    | —         | 弹窗标题，支持多语言                                                 |
| message                  | `Record<"en-US" \| "zh-CN", string>`                    | —         | 弹窗消息，支持多语言                                                 |
| isType                   | `"confirm"` `undefined`                                 | `false`   | 是否为确认弹窗，确认按钮为 `primary` 类型，取消按钮为 `default` 类型 |
| type                     | `default` `info` `primary` `success` `warning` `danger` | `default` | 弹窗类型，影响弹窗样式和按钮类型                                     |
| customClass              | `string`                                                | —         | 自定义弹窗类名，用于自定义弹窗样式                                   |
| confirmButtonText        | `Record<"en-US" \| "zh-CN", string>`                    | —         | 确认按钮文本，支持多语言                                             |
| cancelButtonText         | `Record<"en-US" \| "zh-CN", string>`                    | —         | 取消按钮文本，支持多语言                                             |
| onConfirm                | `() => void`                                            | —         | 确认按钮点击回调函数                                                 |
| onClose                  | `() => void`                                            | —         | 取消按钮点击回调函数                                                 |
| dangerouslyUseHTMLString | `boolean`                                               | `false`   | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串                 |
| zIndex                   | `number`                                                | —         | 弹窗的 z-index 值，默认自增长                                        |

## 基础用法

<demo src="./base.vue"></demo>
