# Title 标题

`pa-title` 用于展示带有装饰性下划线的标题组件。

## 基础使用

展示带有装饰性下划线的标题，使用 `line` 控制是否显示下划线。

<demo src="./base.vue">
</demo>

## 下划线控制

使用 `line` 属性控制是否显示下划线装饰，默认为 `true` 显示下划线。

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

## ComponentProps

| 属性名  | 描述           | 类型                                                                                  | 默认值 |
| ------- | -------------- | ------------------------------------------------------------------------------------- | ------ |
| id      | 唯一标识       | `string`                                                                              | -      |
| class   | 自定义类名     | `Array<string>` `string`                                                              | -      |
| style   | 自定义样式     | `Record<string, string>`                                                              | -      |
| line    | 是否使用下划线 | `boolean`                                                                             | `true` |
| tips    | 提示信息       | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -      |
| padding | 内边距方向     | `Array<'top'` `'left'` `'bottom'` `'right'` `'all'` `'null'>`                         | -      |

## ComponentSlots

| 插槽名称 | 描述               |
| -------- | ------------------ |
| default  | 标题内容           |
| tips     | 自定义提示信息内容 |
