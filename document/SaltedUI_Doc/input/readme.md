# Input 输入框

常用与输入相关的场景。

:::warning 注意
`sa-input` 可独立使用，在 `sa-form/sa-table` 中可使用时，需配置 `prop` 字段。
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
