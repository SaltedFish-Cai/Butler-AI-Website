# MessageBox 确认弹窗

确认弹窗组件，用于确认用户操作。

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

## `MessageBoxOptions`

| 属性名                   | 描述                                                                 | 类型                                                                     | 默认值    |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------- |
| title                    | 弹窗标题，支持多语言                                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)                                     | —         |
| message                  | 弹窗消息，支持多语言                                                 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)                                     | —         |
| isType                   | 是否为确认弹窗，确认按钮为 `primary` 类型，取消按钮为 `default` 类型 | `"confirm" \| undefined`                                                 | `false`   |
| type                     | 弹窗类型，影响弹窗样式和按钮类型                                     | `"default" \| "info" \| "primary" \| "success" \| "warning" \| "danger"` | `default` |
| customClass              | 自定义弹窗类名，用于自定义弹窗样式                                   | `string`                                                                 | —         |
| confirmButtonText        | 确认按钮文本，支持多语言                                             | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)                                     | —         |
| cancelButtonText         | 取消按钮文本，支持多语言                                             | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype)                                     | —         |
| confirmButtonIcon        | 确认按钮图标                                                         | `string`                                                                 | —         |
| cancelButtonIcon         | 取消按钮图标                                                         | `string`                                                                 | —         |
| onConfirm                | 确认按钮点击回调函数                                                 | `() => void`                                                             | —         |
| onClose                  | 取消按钮点击回调函数                                                 | `() => void`                                                             | —         |
| dangerouslyUseHTMLString | 是否使用 HTML 字符串渲染消息，默认不使用 HTML 字符串                 | `boolean`                                                                | `false`   |
| zIndex                   | 弹窗的 z-index 值，默认自增长                                        | `number`                                                                 | —         |
| closeOnPressEscape       | 是否在关闭时移除 DOM 元素                                            | `boolean`                                                                | `true`    |
| closeOnPressEsc          | 是否在关闭时移除 DOM 元素                                            | `boolean`                                                                | `true`    |

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
  title: "删除确认", // 不需要
  type: "warning", // 不需要
  confirmButtonText: "删除", // 不需要
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
