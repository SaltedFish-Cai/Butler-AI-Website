# Time 时间

常用与选择时间相关的场景。

:::warning 注意
`pa-time` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaTimeType`

| 字段           | 描述                 | 类型                                                                                                                                                                                  | 默认值        |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| modelValue     | 表单组件值           | `Array<string>` `string`                                                                                                                                                              | —             |
| type           | 表单组件类型         | `date-picker-group` `date-picker` `date-time-picker-group` `date-time-picker` `month-picker-group` `month-picker` `time-picker-group` `time-picker` `year-picker-group` `year-picker` | `date-picker` |
| placeholder    | 输入框提示           | `Record<"en-US" \| "zh-CN", string>` `string`                                                                                                                                         | —             |
| disabled       | 禁用状态             | `boolean`                                                                                                                                                                             | `false`       |
| display        | 纯展示               | `boolean`                                                                                                                                                                             | `false`       |
| disabledDateFn | 禁用日期函数         | `(date: any) => boolean`                                                                                                                                                              | `undefined`   |
| shortcuts      | 快捷选择             | `{ text: string; value: Date[]  \| (() => Date[]) }`                                                                                                                                  | —             |
| contrastData   | 对比用原数据         | `Array<string>` `string`                                                                                                                                                              | —             |
| alwaysContrast | 是否总是显示对不数据 | `boolean`                                                                                                                                                                             | `false`       |

## `SaTimeEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |

## Props

| 属性名              | 描述                        | 类型                                    | 默认值              |
| ------------------- | --------------------------- | --------------------------------------- | ------------------- |
| id                  | 组件唯一标识                | `string`                                | `undefined`         |
| class               | 自定义类名                  | `string`                                | `undefined`         |
| style               | 自定义样式                  | `Record<string, string>`                | `undefined`         |
| type                | Time 类型                   | `MDatePickerType`                       | `date-picker-group` |
| display             | 纯展示模式                  | `boolean`                               | `false`             |
| placeholder         | 表单项占位符                | `Record<languageKey, string> \| string` | `undefined`         |
| disabled            | 是否禁用                    | `boolean`                               | `false`             |
| teleportInContainer | 是否将弹出层挂载到容器中    | `boolean`                               | `false`             |
| disabledDateFn      | 禁用日期判断方法            | `(date) => boolean`                     | `undefined`         |
| shortcuts           | 快捷选项                    | `DatePickerShortcut[]`                  | `undefined`         |
| contrastData        | 对比数据                    | `string[] \| string`                    | `undefined`         |
| alwaysContrast      | 是否显示对比数据            | `boolean`                               | `false`             |
| onChange            | 数据变更回调函数            | `({ value, oldValue }) => void`         | `undefined`         |
| onFocus             | 在组件 Input 获得焦点时触发 | `({ value }) => void`                   | `undefined`         |
| onBlur              | 在组件 Input 失去焦点时触发 | `({ value }) => void`                   | `undefined`         |
| onBlur              | 在组件 Input 失去焦点时触发 | `({ value }) => void`                   | `undefined`         |
