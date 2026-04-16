# Cascader 级联选择器

常用与选择联选项相关的场景。

:::warning 注意
`sa-cascader` 可独立使用，在 `sa-form/sa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaCascaderType`

| 字段           | 描述                     | 类型                                                                      | 默认值     |
| -------------- | ------------------------ | ------------------------------------------------------------------------- | ---------- |
| modelValue     | 绑定值                   | `Array<number \| string>` `number` `string`                               | —          |
| useSingleValue | 是否使用单值模式         | `boolean`                                                                 | `false`    |
| useSingleText  | 是否使用单文本模式       | `boolean`                                                                 | `false`    |
| displayValue   | 纯展示类型下，直接显示值 | `string`                                                                  | —          |
| type           | 组件类型                 | `cascader-check` `cascader` `multiple-cascader-check` `multiple-cascader` | `cascader` |
| exOptions      | 选项                     | `MOptionV2Type.SelectList`                                                | —          |
| placeholder    | 输入框提示               | `Record<"en-US" \| "zh-CN", string>` `string`                             | —          |
| disabled       | 禁用状态                 | `boolean`                                                                 | `false`    |
| display        | 纯展示                   | `boolean`                                                                 | `false`    |
| clearable      | 显示清除按钮             | `boolean`                                                                 | `true`     |
| contrastData   | 对比用原数据             | `Array<number \| string>` `number` `string`                               | —          |
| alwaysContrast | 是否总是显示对不数据     | `boolean`                                                                 | `false`    |

## `SaCascaderEvents`

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
