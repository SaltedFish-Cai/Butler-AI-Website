# Title 标题

`pa-title` 用于展示带有装饰性下划线的标题组件，支持分割线、提示信息和内边距设置。

## 基础使用

基础样式展示，自带分割线样式。

<demo src="./base.vue">
</demo>

## 分割线控制

使用 `line-config` 属性控制分割线显示和自定义样式。

<demo src="./line.vue">
</demo>

## 提示信息

使用 `tips` 属性设置标题下方的提示信息，也可通过 `#tips` 插槽自定义提示内容。

<demo src="./tips.vue">
</demo>

## 内边距设置

使用 `padding` 属性设置标题的内边距方向，支持多个方向组合。

<demo src="./padding.vue">
</demo>

## 样式展示

使用 `styleMode` 属性设置不同类型样式展示。

<demo src="./style.vue">
</demo>

## ComponentProps

| 属性名        | 描述       | 类型                                                                                  | 默认值      |
| ------------- | ---------- | ------------------------------------------------------------------------------------- | ----------- |
| id            | 唯一标识   | `string`                                                                              | -           |
| class         | 自定义类名 | `Array<string>` `string`                                                              | -           |
| style         | 自定义样式 | `Record<string, string>`                                                              | -           |
| tips          | 提示信息   | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -           |
| tips-position | 提示位置   | `'bottom'` \| `'right'`                                                               | `'bottom'`  |
| padding       | 内边距方向 | `Array<'all'` \| `'bottom'` \| `'left'` \| `'null'` \| `'right'` \| `'top'>`          | -           |
| style-mode    | 样式模式   | `'default'` \| `'horizontal'` \| `'vertical'`                                          | `'default'` |
| line-config   | 分割线配置 | [`ComponentProps`](/document/PancakeUI_Doc/line/readme#componentprops) `boolean`             | -           |

## ComponentSlots

| 插槽名称  | 描述               |
| --------- | ------------------ |
| 'default' | 标题内容           |
| 'tips'    | 自定义提示信息内容 |
