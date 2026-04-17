# Message 弹窗

弹窗组件，用于显示提示信息。

## 基础用法

<demo src="./base.vue"></demo>

## `MessageOptions`

| 属性名                   | 描述                                                 | 类型                                                    | 默认值    |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------- | --------- |
| title                    | 弹窗标题，支持多语言                                 | `Record<"en-US" \| "zh-CN", string>`                    | —         |
| message                  | 弹窗消息，支持多语言                                 | `Record<"en-US" \| "zh-CN", string>`                    | —         |
| type                     | 弹窗类型，影响弹窗样式和按钮类型                     | `default` `info` `primary` `success` `warning` `danger` | `default` |
| duration                 | 弹窗显示时间，单位毫秒                               | `number`                                                | `3000`    |
| customClass              | 自定义弹窗类名，用于自定义弹窗样式                   | `string`                                                | —         |
| offset                   | 弹窗距离顶部的偏移量，单位像素                       | `number`                                                | `20`      |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串 | `boolean`                                               | `false`   |
| zIndex                   | 弹窗的 z-index 值，默认自增长                        | `number`                                                | —         |
| onClick                  | 确认按钮点击回调                                     | `() => void`                                            | —         |
| onClose                  | 弹窗关闭回调，包括点击关闭按钮和自动关闭             | `() => void`                                            | —         |
