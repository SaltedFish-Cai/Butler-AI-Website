# Time 时间

常用于选择时间相关的场景。

:::warning 注意
`pa-time` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue"></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue"></demo>

## ComponentProps

| 属性名              | 描述                         | 类型                                                                                                                                   | 默认值         |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| id                  | 组件唯一标识                 | `string` `undefined`                                                                                                                   | `undefined`    |
| class               | 自定义类名                   | `string` `undefined`                                                                                                                   | `undefined`    |
| style               | 自定义样式                   | `Record<string, string>` `undefined`                                                                                                   | `undefined`    |
| modelValue          | 双向绑定值                   | `Array<string>` `string` `undefined`                                                                                                   | `undefined`    |
| displayValue        | 纯展示类型下，直接显示值     | `string` `undefined`                                                                                                                   | `undefined`    |
| type                | Time 类型                    | `'date-picker-group'` `'date-picker'` `'date-time-picker-group'` `'date-time-picker'` `'month-picker-group'` `'month-picker'` `'time-picker-group'` `'time-picker'` `'year-picker-group'` `'year-picker'` `undefined` | `'date-picker'` |
| placeholder         | 表单项占位符                 | `Record<LanguageKey, string>` \| `string` `undefined`                                                                                  | `undefined`    |
| disabled            | 是否禁用                     | `boolean` `undefined`                                                                                                                  | `undefined`    |
| display             | 纯展示模式                   | `boolean` `undefined`                                                                                                                  | `undefined`    |
| teleportInContainer | 是否将弹出层挂载到容器中     | `boolean` `undefined`                                                                                                                  | `undefined`    |
| disabledDateFn      | 禁用日期判断方法             | `(date: any) => boolean` `undefined`                                                                                                   | `undefined`    |
| shortcuts           | 快捷选项                     | `DatePickerShortcut[]` `undefined`                                                                                                     | `undefined`    |
| contrastData        | 对比数据                     | `string[]` `string` `undefined`                                                                                                        | `undefined`    |
| alwaysContrast      | 是否显示对比数据             | `boolean` `undefined`                                                                                                                  | `undefined`    |
| title               | 表单项标签                   | `Record<LanguageKey, string>` \| `string` `undefined`                                                                                  | `undefined`    |
| titleWidth          | 表单项标签宽度               | `string` `undefined`                                                                                                                   | `undefined`    |

## DatePickerShortcut

| 字段  | 描述         | 类型                          |
| ----- | ------------ | ----------------------------- |
| text  | 快捷选项文本 | `string`                      |
| value | 快捷选项值   | `Date[]` \| `(() => Date[])` |

## ComponentEvents

| 字段     | 描述                        | 类型                            |
| -------- | --------------------------- | ------------------------------- |
| onChange | 数据变更回调函数            | `({ value, oldValue }) => void` |
| onFocus  | 在组件 Input 获得焦点时触发 | `({ value }) => void`           |
| onBlur   | 在组件 Input 失去焦点时触发 | `({ value }) => void`           |
