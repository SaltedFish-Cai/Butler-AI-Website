# Notification 通知

`pa-notification` 通知组件，用于显示系统通知消息。

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

## ComponentProps

| 属性名                   | 描述                         | 类型                                                           | 默认值      |
| ------------------------ | ---------------------------- | -------------------------------------------------------------- | ----------- |
| id                       | 唯一标识                     | `string`                                                       | -           |
| class                    | 自定义类名                   | `Array<string>` \| `string`                                    | -           |
| style                    | 自定义样式                   | `Record<string, string>`                                       | -           |
| title                    | 通知标题，支持多语言         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -           |
| message                  | 通知消息，支持多语言         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -           |
| type                     | 通知类型，影响通知样式       | `NotificationType`                                             | `'primary'` |
| duration                 | 通知显示时间，单位毫秒       | `number`                                                       | `4500`      |
| position                 | 通知位置                     | `NotificationPosition`                                         | `'top-right'` |
| offset                   | 通知偏移量，单位像素         | `number`                                                       | `20`        |
| customClass              | 自定义通知类名               | `string`                                                       | -           |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息 | `boolean`                                                      | `false`     |
| zIndex                   | 通知的 z-index 值            | `number`                                                       | `2050`      |
| onClick                  | 点击通知回调                 | `() => void`                                                   | -           |
| onClose                  | 关闭通知回调                 | `() => void`                                                   | -           |
| icon                     | 自定义图标组件               | `VNode`                                                        | -           |

## NotificationType

| 类型值      | 说明     |
| ----------- | -------- |
| `'primary'` | 主要类型 |
| `'success'` | 成功类型 |
| `'warning'` | 警告类型 |
| `'danger'`  | 危险类型 |
| `'info'`    | 信息类型 |

## NotificationPosition

| 类型值           | 说明       |
| ---------------- | ---------- |
| `'top-right'`    | 右上角     |
| `'top-left'`     | 左上角     |
| `'bottom-right'` | 右下角     |
| `'bottom-left'`  | 左下角     |

## NotificationInstance

| 属性名  | 类型                   | 说明               |
| ------- | ---------------------- | ------------------ |
| id      | `string`               | 通知实例的唯一标识 |
| vm      | `ComponentPublicInstance` | Vue 组件实例   |
| options | `NotificationOptions`  | 通知的配置选项     |
| close   | `() => void`           | 关闭通知的方法     |

::: warning 注意
类型使用 `danger` 而非 `error`，与其他组件保持一致。
:::
