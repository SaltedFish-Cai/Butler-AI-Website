# Icon 图标

常用的图标，多用于 [`pa-button`](/document/PancakeUI_Doc/button/readme) 的图标选择。

## 基础用法

使用 `name` 选择图标

<demo src="./base.vue"></demo>

## 带提示

使用 `tip` 来定义 icon 的 hover 提示

<demo src="./tip.vue"></demo>

## 字体与颜色

使用 `fontFamily` 切换图标字体库，使用 `fontColor` 设置渐变色

<demo src="./font.vue">
</demo>

## Icon 选择

全 `Icon` 展示直接点击即可获取 `pa-icon` 所需的 `name` 值

<demo src="./copy.vue" control="false"></demo>

## ComponentProps

| 属性名     | 描述       | 类型                                                                                  | 默认值        |
| ---------- | ---------- | ------------------------------------------------------------------------------------- | ------------- |
| id         | 唯一标识   | `string`                                                                              | -             |
| class      | 自定义类名 | `Array<string>` `string`                                                              | -             |
| style      | 自定义样式 | `Record<string, string>`                                                              | -             |
| name       | icon 名称  | `string`                                                                              | `magic_line`  |
| tip        | icon 提示  | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -             |
| fontFamily | 字体名称   | [`IconFontFamily`](#iconfontfamily)                                                   | `pa-iconfont` |
| fontColor  | 字体颜色   | `Array<string>`                                                                       | -             |

## IconFontFamily

| 值                  | 描述              |
| ------------------- | ----------------- |
| `'pa-iconfont'`     | 默认图标字体库    |
| `'butler-iconfont'` | Butler 图标字体库 |
