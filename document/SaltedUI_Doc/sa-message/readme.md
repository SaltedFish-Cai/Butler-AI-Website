# Message 弹窗

弹窗组件，用于显示提示信息。

## `MessageOptions`

| 属性名                   | 类型                                                    | 默认值    | 描述                                                 |
| ------------------------ | ------------------------------------------------------- | --------- | ---------------------------------------------------- |
| title                    | `Record<"en-US" \| "zh-CN", string>`                    | —         | 弹窗标题，支持多语言                                 |
| message                  | `Record<"en-US" \| "zh-CN", string>`                    | —         | 弹窗消息，支持多语言                                 |
| type                     | `default` `info` `primary` `success` `warning` `danger` | `default` | 弹窗类型，影响弹窗样式和按钮类型                     |
| duration                 | `number`                                                | `3000`    | 弹窗显示时间，单位毫秒                               |
| customClass              | `string`                                                | —         | 自定义弹窗类名，用于自定义弹窗样式                   |
| offset                   | `number`                                                | `20`      | 弹窗距离顶部的偏移量，单位像素                       |
| dangerouslyUseHTMLString | `boolean`                                               | `false`   | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串 |
| zIndex                   | `number`                                                | —         | 弹窗的 z-index 值，默认自增长                        |
| onClick                  | `() => void`                                            | —         | 确认按钮点击回调                                     |
| onClose                  | `() => void`                                            | —         | 弹窗关闭回调，包括点击关闭按钮和自动关闭             |

## 基础用法

<demo src="./base.vue"></demo>
