# Radio 单选框

:::warning 注意
`m-radio-v2` 可独立使用，在 `m-form-v2/m-table-v2` 中可使用时，需配置 `prop` 字段。
:::

## `MRadioV2Type`

| 字段           | 类型                         | 默认值  | 描述                 |
| -------------- | ---------------------------- | ------- | -------------------- |
| modelValue     | `string` `number` `boolean`  | —       | 绑定值               |
| disabled       | `boolean`                    | —       | 禁用状态             |
| display        | `boolean`                    | `false` | 纯展示               |
| exOptions      | `MOptionV2Type.SelectList` | —       | 选项                 |
| contrastData   | `string` `number` `boolean`  | —       | 对比用原数据         |
| alwaysContrast | `boolean`                    | `false` | 是否总是显示对不数据 |

## `MRadioV2ItemType`

| 字段       | 类型                        | 默认值  | 描述     |
| ---------- | --------------------------- | ------- | -------- |
| modelValue | `string` `number` `boolean` | —       | 绑定值   |
| label      | `string`                    | —       | 选项名   |
| value      | `string` `number` `boolean` | —       | 选项值   |
| isChecked  | `boolean`                   | `false` | 是否选中 |
| disabled   | `boolean`                   | —       | 禁用状态 |

## `MRadioV2Events`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## `MOptionV2Type.SelectList(Array<MSelectV2OptionsType>)`

| 字段     | 类型                                              | 默认值  | 描述     |
| -------- | ------------------------------------------------- | ------- | -------- |
| label    | `string`                                          |         | 选项名   |
| value    | `string` `number` `boolean`                       |         | 选项值   |
| children | `Array<MSelectV2OptionsType>`                     |         | 子选项   |
| disabled | `boolean`                                         | `false` | 禁用状态 |
| base     | `any`                                             |         | 默认数据 |
| tagStyle | `{bgColor?: string, textColor?: string}` `string` |         | 标签样式 |

## 组件功能展示

<demo src="./base.vue" ></demo>
