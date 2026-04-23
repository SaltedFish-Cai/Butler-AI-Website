# Time 时间

常用于选择时间相关的场景。

:::warning 注意
`pa-time` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 日期选择器功能展示

<demo src="./base.vue"></demo>

## 时间选择器功能展示

<demo src="./time.vue"></demo>

## 月份选择器功能展示

<demo src="./month.vue"></demo>

## 年份选择器功能展示

<demo src="./year.vue"></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue"></demo>

## ComponentProps

| 属性名              | 描述                     | 类型                                                                                  | 默认值          |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------- | --------------- |
| id                  | 组件唯一标识             | `string`                                                                              | -               |
| class               | 自定义类名               | `string`                                                                              | -               |
| style               | 自定义样式               | `Record<string, string>`                                                              | -               |
| modelValue          | 双向绑定值               | `Array<string>` `string`                                                              | -               |
| displayValue        | 纯展示类型下，直接显示值 | `string`                                                                              | -               |
| type                | Time 类型                | [`DatePickerType`](#datepickertype)                                                   | `'date-picker'` |
| placeholder         | 表单项占位符             | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -               |
| disabled            | 是否禁用                 | `boolean`                                                                             | -               |
| display             | 纯展示模式               | `boolean`                                                                             | -               |
| teleportInContainer | 是否将弹出层挂载到容器中 | `boolean`                                                                             | -               |
| disabledDateFn      | 禁用日期判断方法         | `(date: any) => boolean`                                                              | -               |
| shortcuts           | 快捷选项                 | [`Array<DatePickerShortcut>`](#datepickershortcut)                                    | -               |
| contrastData        | 对比数据                 | `Array<string>` `string`                                                              | -               |
| alwaysContrast      | 是否显示对比数据         | `boolean`                                                                             | -               |
| title               | 表单项标签               | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -               |
| titleWidth          | 表单项标签宽度           | `string`                                                                              | -               |

# DatePickerType

| 字段                       | 描述             |
| -------------------------- | ---------------- |
| `'date-picker'`            | 日期选择器       |
| `'date-picker-group'`      | 日期选择器组     |
| `'date-time-picker'`       | 日期时间选择器   |
| `'date-time-picker-group'` | 日期时间选择器组 |
| `'month-picker-group'`     | 月份选择器组     |
| `'month-picker'`           | 月份选择器       |
| `'time-picker-group'`      | 时间选择器组     |
| `'time-picker'`            | 时间选择器       |
| `'year-picker-group'`      | 年份选择器组     |
| `'year-picker'`            | 年份选择器       |

## DatePickerShortcut

| 字段  | 描述         | 类型                         |
| ----- | ------------ | ---------------------------- |
| text  | 快捷选项文本 | `string`                     |
| value | 快捷选项值   | `Date[]` \| `(() => Date[])` |

## ComponentEvents

| 字段   | 描述                        | 类型                            |
| ------ | --------------------------- | ------------------------------- |
| change | 数据变更回调函数            | `({ value, oldValue }) => void` |
| focus  | 在组件 Input 获得焦点时触发 | `({ value }) => void`           |
| blur   | 在组件 Input 失去焦点时触发 | `({ value }) => void`           |
