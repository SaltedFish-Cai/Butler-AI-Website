# Input 输入框

常用与输入相关的场景。

:::warning 注意
`pa-input` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaInputType`

| 字段           | 描述                         | 类型                                           | 默认值  |
| -------------- | ---------------------------- | ---------------------------------------------- | ------- |
| modelValue     | 绑定值                       | `string`                                       | —       |
| placeholder    | 输入框提示                   | `Record<"en-US" \| "zh-CN", string>` `string`  | —       |
| disabled       | 禁用状态                     | `boolean`                                      | `false` |
| display        | 纯展示                       | `boolean`                                      | `false` |
| maxLength      | 内容长度的最大数             | `string` `number`                              | —       |
| clearable      | 显示清除按钮                 | `boolean`                                      | `true`  |
| autofocus      | 自动获取焦点                 | `boolean`                                      | `false` |
| inputParser    | 指定从格式化器输入中提取的值 | `(value: string) => string` `undefined`        | `false` |
| inputFormatter | 指定输入值的格式             | `(value: number/string) => string` `undefined` | `false` |
| contrastData   | 对比用原数据                 | `number` `string`                              | —       |
| alwaysContrast | 是否总是显示对不数据         | `boolean`                                      | `false` |

## `SaInputEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |

## Props

| 属性名     | 描述             | 类型                                       | 默认值      |
| ---------- | ---------------- | ------------------------------------------ | ----------- |
| id         | 组件唯一标识     | `string`                                   | `undefined` |
| class      | 自定义类名       | `string`                                   | `undefined` |
| style      | 自定义样式       | `Record<string, string>`                   | `undefined` |
| type       | 输入框类型       | `input` `textarea` `text`                  | `text`      |
| title      | 表单项标签       | `Record<languageKey, string>    \| string` | `undefined` |
| titleWidth | 表单项标签宽度   | `string`                                   | `100px`     |
| onChange   | 数据变更回调函数 | `({ value, oldValue }) => void`            | `undefined` |
| onChange   | 数据变更回调函数 | `({ value, oldValue }) => void`            | `undefined` |
