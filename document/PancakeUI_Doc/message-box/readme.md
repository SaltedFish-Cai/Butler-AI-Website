# MessageBox 确认弹窗

`pa-message-box` 确认弹窗组件，用于确认用户操作。

## 基础用法

<demo src="./base.vue"></demo>

## 快捷方法

### 删除确认（推荐）

```ts
import { M_MessageBox } from "@/package/components/feedback";

// 删除确认 - 内置合适的默认值
M_MessageBox.delete({
  message: { "en-US": "Are you sure to delete?", "zh-CN": "确定删除吗？" },
  onConfirm: () => {
    // 执行删除操作
  },
  onClose: () => {
    // 取消删除
  }
});
```

::: tip 提示
`M_MessageBox.delete()` 已内置合适的 `title`、`type`、`confirmButtonText` 默认值，无需手动指定。
:::

### 普通确认

```ts
M_MessageBox.confirm({
  title: { "en-US": "Confirm", "zh-CN": "确认" },
  message: { "en-US": "Are you sure?", "zh-CN": "确定吗？" },
  confirmButtonText: { "en-US": "OK", "zh-CN": "确定" },
  onConfirm: () => {
    // 确认操作
  }
});
```

## ComponentProps

| 属性名                   | 描述                                                                 | 类型                                                                     | 默认值     |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------- |
| id                       | 唯一标识                                                             | `string`                                                                 | -          |
| class                    | 自定义类名                                                           | `Array<string>` \| `string`                                              | -          |
| style                    | 自定义样式                                                           | `Record<string, string>`                                                 | -          |
| title                    | 弹窗标题，支持多语言                                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -          |
| message                  | 弹窗消息，支持多语言                                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -          |
| isType                   | 是否为确认弹窗                                                       | `'confirm'`                                                              | -          |
| type                     | 弹窗类型，影响弹窗样式                                               | `MessageBoxType`                                                         | -          |
| customClass              | 自定义弹窗类名                                                       | `string`                                                                 | -          |
| confirmButtonText        | 确认按钮文本，支持多语言                                             | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -          |
| cancelButtonText         | 取消按钮文本，支持多语言                                             | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -          |
| confirmButtonIcon        | 确认按钮图标                                                         | `string`                                                                 | -          |
| cancelButtonIcon         | 取消按钮图标                                                         | `string`                                                                 | -          |
| onConfirm                | 确认按钮点击回调函数                                                 | `() => void`                                                             | -          |
| onClose                  | 取消按钮点击回调函数                                                 | `() => void`                                                             | -          |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息                                         | `boolean`                                                                | `false`    |
| zIndex                   | 弹窗的 z-index 值                                                    | `number`                                                                 | `2050`     |
| closeOnPressEscape       | 是否在按下 ESC 键时关闭                                              | `boolean`                                                                | `true`     |

## MessageBoxType

| 类型值      | 说明     |
| ----------- | -------- |
| `'primary'` | 主要类型 |
| `'success'` | 成功类型 |
| `'warning'` | 警告类型 |
| `'danger'`  | 危险类型 |
| `'info'`    | 信息类型 |

## MessageBoxInstance

| 属性名  | 类型                   | 说明               |
| ------- | ---------------------- | ------------------ |
| id      | `string`               | 消息框实例的唯一标识 |
| vm      | `ComponentPublicInstance` | Vue 组件实例   |
| options | `MessageBoxOptions`    | 消息框的配置选项   |
| close   | `() => void`           | 关闭消息框的方法   |

## 最佳实践

### 删除操作

```ts
// ✅ 推荐：使用 delete() 方法
M_MessageBox.delete({
  message: { "en-US": "Delete this item?", "zh-CN": "删除此项？" },
  onConfirm: () => deleteItem()
});

// ❌ 不推荐：手动指定所有参数
M_MessageBox.confirm({
  title: "删除确认",
  type: "warning",
  confirmButtonText: "删除",
  message: "确定删除吗？",
  onConfirm: () => deleteItem()
});
```

### 多语言支持

```ts
M_MessageBox.delete({
  message: {
    "en-US": "Are you sure to delete this item?",
    "zh-CN": "确定删除此项吗？"
  },
  onConfirm: () => deleteItem()
});
```
