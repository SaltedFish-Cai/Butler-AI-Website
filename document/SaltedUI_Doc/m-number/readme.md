# Number 数字框

:::warning 注意
`m-number-v2` 可独立使用，在 `m-form-v2/m-table-v2` 中可使用时，需配置 `prop` 字段。
:::

## `MNumberV2Type`

| 字段           | 类型                                          | 默认值  | 描述                 |
| -------------- | --------------------------------------------- | ------- | -------------------- |
| modelValue     | `string` `number`                             | —       | 绑定值               |
| placeholder    | `Record<"en-US" \| "zh-CN", string>` `string` | —       | 输入框提示           |
| disabled       | `boolean`                                     | `false` | 禁用状态             |
| display        | `boolean`                                     | `false` | 纯展示               |
| controls       | `boolean`                                     | `false` | 显示控制器           |
| max            | `number`                                      | —       | 最大值               |
| min            | `number`                                      | —       | 最小值               |
| unit           | `string`                                      | —       | 单位                 |
| precision      | `number`                                      | `0`     | 小数点精度           |
| clearable      | `boolean`                                     | `true`  | 显示清除按钮         |
| autofocus      | `boolean`                                     | `false` | 自动获取焦点         |
| step           | `number`                                      | `1`     | 计数器步长           |
| contrastData   | `number` / `string`                           | —       | 对比用原数据         |
| alwaysContrast | `boolean`                                     | `false` | 是否总是显示对不数据 |

## `MNumberV2Events`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## 组件功能展示

<demo src="./base.vue" ></demo>
