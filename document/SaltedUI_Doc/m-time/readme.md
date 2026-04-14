# Time 时间

:::warning 注意
`m-time-v2` 可独立使用，在 `m-form-v2/m-table-v2` 中可使用时，需配置 `prop` 字段。
:::

## `MTimeV2Type`

| 字段           | 类型                                                                                                                                                                                  | 默认值        | 描述                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------- |
| modelValue     | `Array<string>` `string`                                                                                                                                                              | —             | 表单组件值           |
| type           | `date-picker-group` `date-picker` `date-time-picker-group` `date-time-picker` `month-picker-group` `month-picker` `time-picker-group` `time-picker` `year-picker-group` `year-picker` | `date-picker` | 表单组件类型         |
| placeholder    | `Record<"en-US" \| "zh-CN", string>` `string`                                                                                                                                         | —             | 输入框提示           |
| disabled       | `boolean`                                                                                                                                                                             | `false`       | 禁用状态             |
| display        | `boolean`                                                                                                                                                                             | `false`       | 纯展示               |
| disabledDateFn | `(date: any) => boolean`                                                                                                                                                              | `undefined`   | 禁用日期函数         |
| shortcuts      | `{ text: string; value: Date[]  \| (() => Date[]) }`                                                                                                                                  | —             | 快捷选择             |
| contrastData   | `Array<string>` `string`                                                                                                                                                              | —             | 对比用原数据         |
| alwaysContrast | `boolean`                                                                                                                                                                             | `false`       | 是否总是显示对不数据 |

## `MTimeV2Events`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## 组件功能展示

<demo src="./base.vue" ></demo>
