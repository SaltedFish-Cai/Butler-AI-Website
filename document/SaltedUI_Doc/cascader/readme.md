# Cascader 级联选择器

:::warning 注意
`sa-cascader` 可独立使用，在 `sa-form/sa-table` 中可使用时，需配置 `prop` 字段。
:::

## `SaCascaderType`

| 字段           | 类型                                                                      | 默认值     | 描述                     |
| -------------- | ------------------------------------------------------------------------- | ---------- | ------------------------ |
| modelValue     | `Array<number \| string>` `number` `string`                               | —          | 绑定值                   |
| useSingleValue | `boolean`                                                                 | `false`    | 是否使用单值模式         |
| useSingleText  | `boolean`                                                                 | `false`    | 是否使用单文本模式       |
| displayValue   | `string`                                                                  | —          | 纯展示类型下，直接显示值 |
| type           | `cascader-check` `cascader` `multiple-cascader-check` `multiple-cascader` | `cascader` | 组件类型                 |
| exOptions      | `MOptionV2Type.SelectList`                                                | —          | 选项                     |
| placeholder    | `Record<"en-US" \| "zh-CN", string>` `string`                             | —          | 输入框提示               |
| disabled       | `boolean`                                                                 | `false`    | 禁用状态                 |
| display        | `boolean`                                                                 | `false`    | 纯展示                   |
| clearable      | `boolean`                                                                 | `true`     | 显示清除按钮             |
| contrastData   | `Array<number \| string>` `number` `string`                               | —          | 对比用原数据             |
| alwaysContrast | `boolean`                                                                 | `false`    | 是否总是显示对不数据     |

## `SaCascaderEvents`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## `MOptionV2Type.SelectList(Array<SaSelectOptionsType>)`

| 字段     | 类型                                              | 默认值  | 描述     |
| -------- | ------------------------------------------------- | ------- | -------- |
| label    | `string`                                          |         | 选项名   |
| value    | `string` `number` `boolean`                       |         | 选项值   |
| children | `Array<SaSelectOptionsType>`                     |         | 子选项   |
| disabled | `boolean`                                         | `false` | 禁用状态 |
| base     | `any`                                             |         | 默认数据 |
| tagStyle | `{bgColor?: string, textColor?: string}` `string` |         | 标签样式 |

## 组件功能展示

<demo src="./base.vue" ></demo>
