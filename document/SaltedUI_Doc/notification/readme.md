# Notification 通知弹窗

通知弹窗组件，用于显示操作结果或提示信息。

## `NotificationOptions`

| 属性名                   | 类型                                                        | 默认值        | 描述                                                 |
| ------------------------ | ----------------------------------------------------------- | ------------- | ---------------------------------------------------- |
| title                    | `Record<"en-US" \| "zh-CN", string>`                        | —             | 弹窗标题，支持多语言                                 |
| message                  | `Record<"en-US" \| "zh-CN", string>`                        | —             | 弹窗消息，支持多语言                                 |
| type                     | `default` `info` `primary` `success` `warning` `danger`     | `default`     | 弹窗类型，影响弹窗样式和按钮类型                     |
| duration                 | `number`                                                    | `3000`        | 弹窗显示时间，单位为毫秒，设为 0 则不会自动关闭      |
| customClass              | `string`                                                    | —             | 自定义弹窗类名，用于自定义弹窗样式                   |
| onClick                  | `() => void`                                                | —             | 确认按钮点击回调函数                                 |
| onClose                  | `() => void`                                                | —             | 取消按钮点击回调函数                                 |
| offset                   | `number`                                                    | `0`           | 弹窗偏移量，单位为像素                               |
| position                 | `"bottom-left"` `"bottom-right"` `"top-left"` `"top-right"` | `"top-right"` | 弹窗位置，默认在右上角                               |
| dangerouslyUseHTMLString | `boolean`                                                   | `false`       | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串 |
| zIndex                   | `number`                                                    | —             | 弹窗的 z-index 值，默认自增长                        |
| icon                     | `string`                                                    | —             | 弹窗图标，支持自定义图标                             |

## 基础用法

<demo src="./base.vue"></demo>
