# Checkbox 多选框

常用与选择多个选项相关的场景。

:::warning 注意
`pa-checkbox` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaCheckboxType`

| 字段           | 描述                 | 类型                                 | 默认值  |
| -------------- | -------------------- | ------------------------------------ | ------- |
| modelValue     | 绑定值               | `Array<boolean \| number \| string>` | —       |
| disabled       | 禁用状态             | `boolean`                            | —       |
| display        | 纯展示               | `boolean`                            | `false` |
| exOptions      | 选项                 | `MOptionV2Type.SelectList`           | —       |
| contrastData   | 对比用原数据         | `string` `number` `boolean`          | —       |
| alwaysContrast | 是否总是显示对不数据 | `boolean`                            | `false` |

## `SaCheckboxItemType`

| 字段            | 描述     | 类型                        | 默认值  |
| --------------- | -------- | --------------------------- | ------- |
| modelValue      | 绑定值   | `string` `number` `boolean` | —       |
| label           | 选项名   | `string`                    | —       |
| value           | 选项值   | `string` `number` `boolean` | —       |
| isChecked       | 是否选中 | `boolean`                   | `false` |
| isIndeterminate | 是否半选 | `boolean`                   | `false` |
| disabled        | 禁用状态 | `boolean`                   | —       |

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


## Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 组件唯一标识 | `string` | `undefined` |
| class | 自定义类名 | `string` | `undefined` |
| style | 自定义样式 | `Record<string, string>` | `undefined` |
| onChange | 数据变更回调函数 | `({ value, oldValue, option }) => void` | `undefined` |
| onChange | 数据变更回调函数 | `({ value, oldValue, option }) => void` | `undefined` |
