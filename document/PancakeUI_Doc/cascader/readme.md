# Cascader 级联选择器

常用与选择联选项相关的场景。

:::warning 注意
`pa-cascader` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## Props

| 属性名              | 描述                         | 类型                                                                              | 默认值       |
| ------------------- | ---------------------------- | --------------------------------------------------------------------------------- | ------------ |
| id                  | 唯一标识                     | `string`                                                                          | -            |
| class               | 自定义类名                   | `string`                                                                          | -            |
| style               | 自定义样式                   | `Record<string, string>`                                                          | -            |
| modelValue          | 绑定值                       | `Array<number \| string>` `number` `string`                                       | -            |
| useSingleValue      | 是否使用单值模式             | `boolean`                                                                         | `false`      |
| useSingleText       | 是否使用单文本模式           | `boolean`                                                                         | `false`      |
| displayValue        | 纯展示类型下，直接显示值     | `string`                                                                          | -            |
| type                | 组件类型                     | `'cascader-check'` `'cascader'` `'multiple-cascader-check'` `'multiple-cascader'` | `'cascader'` |
| exOptions           | 选项                         | `MOptionV2Type.SelectList`                                                        | -            |
| placeholder         | 输入框提示                   | `Record<'en-US' \| 'zh-CN', string>` `string`                                     | -            |
| disabled            | 禁用状态                     | `boolean`                                                                         | `false`      |
| display             | 纯展示                       | `boolean`                                                                         | `false`      |
| clearable           | 显示清除按钮                 | `boolean`                                                                         | `true`       |
| contrastData        | 对比用原数据                 | `Array<number \| string>` `number` `string`                                       | -            |
| alwaysContrast      | 是否总是显示对不数据         | `boolean`                                                                         | `false`      |
| title               | 表单项标签                   | `Record<languageKey, string> \| string`                                           | -            |
| titleWidth          | 表单项标签宽度               | `string`                                                                          | -            |
| teleportInContainer | 是否使用 Teleport 挂载到容器 | `boolean`                                                                         | `false`      |
| onChange            | 数据变更回调函数             | `({ value, oldValue, option }) => void`                                           | -            |

## 组件功能展示

<demo src="./base.vue" ></demo>

## `MOptionV2Type.SelectList(Array<SaSelectOptionsType>)`

| 字段     | 描述     | 类型                                              | 默认值  |
| -------- | -------- | ------------------------------------------------- | ------- |
| label    | 选项名   | `string`                                          |         |
| value    | 选项值   | `string` `number` `boolean`                       |         |
| children | 子选项   | `Array<SaSelectOptionsType>`                      |         |
| disabled | 禁用状态 | `boolean`                                         | `false` |
| base     | 默认数据 | `any`                                             |         |
| tagStyle | 标签样式 | `{bgColor?: string, textColor?: string}` `string` |         |
