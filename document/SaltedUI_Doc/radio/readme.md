# Radio 单选框

常用与单选选项相关的场景。

:::warning 注意
`sa-radio` 可独立使用，在 `sa-form/sa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaRadioType`

| 字段           | 描述                 | 类型                        | 默认值  |
| -------------- | -------------------- | --------------------------- | ------- |
| modelValue     | 绑定值               | `string` `number` `boolean` | —       |
| disabled       | 禁用状态             | `boolean`                   | —       |
| display        | 纯展示               | `boolean`                   | `false` |
| exOptions      | 选项                 | `MOptionV2Type.SelectList`  | —       |
| contrastData   | 对比用原数据         | `string` `number` `boolean` | —       |
| alwaysContrast | 是否总是显示对不数据 | `boolean`                   | `false` |

## `SaRadioItemType`

| 字段       | 描述     | 类型                        | 默认值  |
| ---------- | -------- | --------------------------- | ------- |
| modelValue | 绑定值   | `string` `number` `boolean` | —       |
| label      | 选项名   | `string`                    | —       |
| value      | 选项值   | `string` `number` `boolean` | —       |
| isChecked  | 是否选中 | `boolean`                   | `false` |
| disabled   | 禁用状态 | `boolean`                   | —       |

## `SaRadioEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |

## `MOptionV2Type.SelectList(Array<SaSelectOptionsType>)`

| 字段     | 描述     | 类型                                              | 默认值  |
| -------- | -------- | ------------------------------------------------- | ------- |
| label    | 选项名   | `string`                                          |         |
| value    | 选项值   | `string` `number` `boolean`                       |         |
| children | 子选项   | `Array<SaSelectOptionsType>`                      |         |
| disabled | 禁用状态 | `boolean`                                         | `false` |
| base     | 默认数据 | `any`                                             |         |
| tagStyle | 标签样式 | `{bgColor?: string, textColor?: string}` `string` |         |
