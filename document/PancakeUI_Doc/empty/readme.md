# Empty 空状态

`pa-empty` 用于展示空数据状态时的占位提示。

## 基础使用

默认显示"暂无数据"提示和默认图标。

<demo src="./base.vue">
</demo>

## 自定义提示信息

使用 `message` 属性设置自定义提示信息，支持多语言。

<demo src="./message.vue">
</demo>

## 自定义图标

使用 `icon` 属性设置自定义图标名称。

<demo src="./icon.vue">
</demo>

## ComponentProps

| 属性名  | 描述           | 类型                                                                   | 默认值     |
| ------- | -------------- | ---------------------------------------------------------------------- | ---------- |
| id      | 唯一标识       | `string`                                                               | -          |
| class   | 自定义类名     | `Array<string>` `string`                                               | -          |
| style   | 自定义样式     | `Record<string, string>`                                               | -          |
| message | 提示信息       | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | `'暂无数据'` |
| icon    | 图标名称       | `string`                                                               | `'dakai'`  |
