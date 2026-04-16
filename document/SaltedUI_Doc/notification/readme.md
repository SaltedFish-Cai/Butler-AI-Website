# Notification 通知弹窗

通知弹窗组件，用于显示操作结果或提示信息。

## 基础用法

<demo src="./base.vue"></demo>

## `NotificationOptions`

| 属性名                   | 描述                                                 | 类型                                                        | 默认值        |
| ------------------------ | ---------------------------------------------------- | ----------------------------------------------------------- | ------------- |
| title                    | 弹窗标题，支持多语言                                 | `Record<"en-US" \| "zh-CN", string>`                        | —             |
| message                  | 弹窗消息，支持多语言                                 | `Record<"en-US" \| "zh-CN", string>`                        | —             |
| type                     | 弹窗类型，影响弹窗样式和按钮类型                     | `default` `info` `primary` `success` `warning` `danger`     | `default`     |
| duration                 | 弹窗显示时间，单位为毫秒，设为 0 则不会自动关闭      | `number`                                                    | `3000`        |
| customClass              | 自定义弹窗类名，用于自定义弹窗样式                   | `string`                                                    | —             |
| onClick                  | 确认按钮点击回调函数                                 | `() => void`                                                | —             |
| onClose                  | 取消按钮点击回调函数                                 | `() => void`                                                | —             |
| offset                   | 弹窗偏移量，单位为像素                               | `number`                                                    | `0`           |
| position                 | 弹窗位置，默认在右上角                               | `"bottom-left"` `"bottom-right"` `"top-left"` `"top-right"` | `"top-right"` |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串 | `boolean`                                                   | `false`       |
| zIndex                   | 弹窗的 z-index 值，默认自增长                        | `number`                                                    | —             |
| icon                     | 弹窗图标，支持自定义图标                             | `string`                                                    | —             |
