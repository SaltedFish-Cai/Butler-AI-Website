# Message 消息提示

`pa-message` 用于显示操作反馈信息，支持多种类型和自定义配置。

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

## ComponentProps

| 属性名                   | 描述                                                 | 类型                                           | 默认值     |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------------- | ---------- |
| id                       | 唯一标识                                             | `string`                                       | -          |
| class                    | 自定义类名                                           | `Array<string>` \| `string`                    | -          |
| style                    | 自定义样式                                           | `Record<string, string>`                       | -          |
| title                    | 消息标题，支持多语言                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -          |
| message                  | 消息内容，支持多语言                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -          |
| type                     | 消息类型，影响消息样式                               | `MessageType`                                  | `'info'`   |
| duration                 | 显示时间，单位毫秒，设为 0 则不会自动关闭           | `number`                                       | `3000`     |
| customClass              | 自定义消息容器的类名                                 | `string`                                       | -          |
| offset                   | 消息距离顶部的偏移量                                 | `number`                                       | `20`       |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息                         | `boolean`                                      | `false`    |
| zIndex                   | 消息的 z-index 值                                    | `number`                                       | `2050`     |
| onClick                  | 点击消息时的回调函数                                 | `() => void`                                   | -          |
| onClose                  | 消息关闭时的回调函数                                 | `() => void`                                   | -          |
| closeOnPressEscape       | 是否在按下 ESC 键时关闭消息                          | `boolean`                                      | `true`     |

## MessageType

| 类型值     | 说明     |
| ---------- | -------- |
| `'info'`   | 信息类型 |
| `'success'`| 成功类型 |
| `'warning'`| 警告类型 |
| `'danger'` | 危险类型 |

## MessageInstance

| 属性名   | 类型                  | 说明               |
| -------- | --------------------- | ------------------ |
| id       | `string`              | 消息实例的唯一标识 |
| vm       | `ComponentPublicInstance` | Vue 组件实例   |
| options  | `MessageOptions`      | 消息的配置选项     |
| close    | `() => void`          | 关闭消息的方法     |

::: warning 注意
类型使用 `danger` 而非 `error`，与其他组件保持一致。
:::
