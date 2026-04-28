# Notification 通知

通知组件，用于显示系统通知消息。

## 基础用法

<demo src="./base.vue"></demo>

## 快捷方法

```ts
import { M_Notification } from "@/package/components/feedback";

// 成功通知
M_Notification.success({
  title: "成功",
  message: "操作已完成"
});

// 警告通知
M_Notification.warning({
  title: "警告",
  message: "请注意"
});

// 错误通知（使用 danger）
M_Notification.danger({
  title: "错误",
  message: "操作失败"
});

// 信息通知
M_Notification.info({
  title: "提示",
  message: "新消息"
});

// 关闭所有通知
M_Notification.closeAll();
```

## `NotificationOptions`

| 属性名                   | 描述                         | 类型                                                           | 默认值      |
| ------------------------ | ---------------------------- | -------------------------------------------------------------- | ----------- |
| title                    | 通知标题，支持多语言         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)                           | —           |
| message                  | 通知消息，支持多语言         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)                           | —           |
| type                     | 通知类型，影响通知样式       | `"primary" \| "success" \| "warning" \| "danger" \| "info"`    | `primary`   |
| duration                 | 通知显示时间，单位毫秒       | `number`                                                       | `4500`      |
| position                 | 通知位置                     | `"top-right" \| "top-left" \| "bottom-right" \| "bottom-left"` | `top-right` |
| offset                   | 通知偏移量，单位像素         | `number`                                                       | —           |
| customClass              | 自定义通知类名               | `string`                                                       | —           |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息 | `boolean`                                                      | `false`     |
| zIndex                   | 通知的 z-index 值            | `number`                                                       | —           |
| onClick                  | 点击通知回调                 | `() => void`                                                   | —           |
| onClose                  | 关闭通知回调                 | `() => void`                                                   | —           |
| icon                     | 自定义图标组件               | `VNode`                                                        | - |

::: warning 注意
类型使用 `danger` 而非 `error`，与其他组件保持一致。
:::
