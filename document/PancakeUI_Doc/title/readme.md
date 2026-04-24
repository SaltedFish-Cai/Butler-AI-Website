# Title 标题

`pa-title` 用于展示带有装饰性下划线的标题组件。

## 基础使用

<demo src="./base.vue">
</demo>

## ComponentProps

| 属性名  | 描述           | 类型                                                                 | 默认值  |
| ------- | -------------- | -------------------------------------------------------------------- | ------- |
| id      | 唯一标识       | `string`                                                             | -       |
| class   | 自定义类名     | `Array<string>` `string`                                             | -       |
| style   | 自定义样式     | `Record<string, string>`                                             | -       |
| line    | 是否使用下划线 | `boolean`                                                            | `true`  |
| tips    | 提示信息       | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -       |
| padding | 内边距方向     | `Array<'top'` `'left'` `'bottom'` `'right'` `'all'` `'null'>`        | -       |

## ComponentSlots

| 插槽名称 | 描述               | 参数 |
| -------- | ------------------ | ---- |
| default  | 标题内容           | -    |
| tips     | 自定义提示信息内容 | -    |
