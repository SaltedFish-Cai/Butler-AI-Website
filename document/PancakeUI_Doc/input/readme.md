# Input 输入框

常用与输入相关的场景。

:::warning 注意
`pa-input` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## Props

| 属性名         | 描述                 | 类型                                          | 默认值     |
| -------------- | -------------------- | --------------------------------------------- | ---------- |
| id             | 组件唯一标识         | `string`                                      | -          |
| class          | 自定义类名           | `string`                                      | -          |
| style          | 自定义样式           | `Record<string, string>`                      | -          |
| type           | 输入框类型           | `input` `textarea` `text`                     | `textarea` |
| modelValue     | 绑定值               | `string`                                      | —          |
| placeholder    | 输入框提示           | `Record<"en-US" \| "zh-CN", string>` `string` | —          |
| disabled       | 禁用状态             | `boolean`                                     | `false`    |
| display        | 纯展示               | `boolean`                                     | `false`    |
| maxLength      | 内容长度的最大数     | `string` `number`                             | —          |
| clearable      | 显示清除按钮         | `boolean`                                     | `true`     |
| autofocus      | 自动获取焦点         | `boolean`                                     | `false`    |
| contrastData   | 对比用原数据         | `number` `string`                             | —          |
| alwaysContrast | 是否总是显示对不数据 | `boolean`                                     | `false`    |
| title          | 表单项标签           | `Record<languageKey, string> \| string`       | -          |
| titleWidth     | 表单项标签宽度       | `string`                                      | —          |
| onChange       | 数据变更回调函数     | `({ value, oldValue }) => void`               | -          |
| onBlur         | 失去焦点回调函数     | `() => void`                                  | -          |
| onFocus        | 获得焦点回调函数     | `() => void`                                  | -          |
| onEnter        | 回车回调函数         | `() => void`                                  | -          |
