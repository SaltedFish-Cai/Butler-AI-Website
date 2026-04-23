# Message 消息提示

消息提示组件，用于显示操作反馈信息。

## 基础用法

<demo src="./base.vue"></demo>

## 快捷方法

```ts
import { M_Message } from "@/package/components/feedback";

// 成功消息
M_Message.success("操作成功");

// 警告消息
M_Message.warning("请注意");

// 错误消息（使用 danger）
M_Message.danger("操作失败");

// 信息消息
M_Message.info("提示信息");

// 关闭所有消息
M_Message.closeAll();
```

## 完整配置

```ts
M_Message({
  message: { "en-US": "Success!", "zh-CN": "成功！" },
  type: "success",
  duration: 5000,
  offset: 20,
  onClick: () => console.log("clicked"),
  onClose: () => console.log("closed")
});
```

## `MessageOptions`

| 属性名                   | 描述                                                 | 类型                                           | 默认值      |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------------- | ----------- |
| title                    | 弹窗标题，支持多语言                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)           | —           |
| message                  | 弹窗消息，支持多语言                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)           | —           |
| type                     | 弹窗类型，影响弹窗样式                               | `"info" \| "success" \| "warning" \| "danger"` | `info`      |
| duration                 | 弹窗显示时间，单位毫秒                               | `number`                                       | `3000`      |
| customClass              | 自定义弹窗类名，用于自定义弹窗样式                   | `string`                                       | —           |
| offset                   | 弹窗距离顶部的偏移量，单位像素                       | `number`                                       | `20`        |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串 | `boolean`                                      | `false`     |
| zIndex                   | 弹窗的 z-index 值，默认自增长                        | `number`                                       | —           |
| onClick                  | 点击消息回调                                         | `() => void`                                   | —           |
| onClose                  | 弹窗关闭回调，包括点击关闭按钮和自动关闭             | `() => void`                                   | —           |
| closeOnPressEscape       | 是否在按下 ESC 键时关闭通知                          | `boolean`                                      | - |

::: warning 注意
类型使用 `danger` 而非 `error`，与其他组件保持一致。
:::
