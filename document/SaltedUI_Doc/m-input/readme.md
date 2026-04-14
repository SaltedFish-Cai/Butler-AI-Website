# Input 输入框

:::warning 注意
`m-input-v2` 可独立使用，在 `m-form-v2/m-table-v2` 中可使用时，需配置 `prop` 字段。
:::

## `MInputV2Type`

| 字段           | 类型                                           | 默认值  | 描述                         |
| -------------- | ---------------------------------------------- | ------- | ---------------------------- |
| modelValue     | `string`                                       | —       | 绑定值                       |
| placeholder    | `Record<"en-US" \| "zh-CN", string>` `string`  | —       | 输入框提示                   |
| disabled       | `boolean`                                      | `false` | 禁用状态                     |
| display        | `boolean`                                      | `false` | 纯展示                       |
| maxLength      | `string` `number`                              | —       | 内容长度的最大数             |
| clearable      | `boolean`                                      | `true`  | 显示清除按钮                 |
| autofocus      | `boolean`                                      | `false` | 自动获取焦点                 |
| inputParser    | `(value: string) => string` `undefined`        | `false` | 指定从格式化器输入中提取的值 |
| inputFormatter | `(value: number/string) => string` `undefined` | `false` | 指定输入值的格式             |
| contrastData   | `number` `string`                              | —       | 对比用原数据                 |
| alwaysContrast | `boolean`                                      | `false` | 是否总是显示对不数据         |

## `MInputV2Events`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## 组件功能展示

<demo src="./base.vue" ></demo>
