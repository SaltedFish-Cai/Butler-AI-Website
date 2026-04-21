# Number 数字框

常用与数字相关的场景。

:::warning 注意
`pa-number` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaNumberType`

| 字段           | 描述                 | 类型                                             | 默认值  |
| -------------- | -------------------- | ------------------------------------------------ | ------- |
| modelValue     | 绑定值               | `string` `number`                                | —       |
| placeholder    | 输入框提示           | `Record<"en-US" \| "zh-CN", string>` \| `string` | —       |
| disabled       | 禁用状态             | `boolean`                                        | `false` |
| display        | 纯展示               | `boolean`                                        | `false` |
| controls       | 显示控制器           | `boolean`                                        | `false` |
| max            | 最大值               | `number`                                         | —       |
| min            | 最小值               | `number`                                         | —       |
| unit           | 单位                 | `string`                                         | —       |
| precision      | 小数点精度           | `number`                                         | `0`     |
| clearable      | 显示清除按钮         | `boolean`                                        | `true`  |
| autofocus      | 自动获取焦点         | `boolean`                                        | `false` |
| step           | 计数器步长           | `number`                                         | `1`     |
| contrastData   | 对比用原数据         | `number` / `string`                              | —       |
| alwaysContrast | 是否总是显示对不数据 | `boolean`                                        | `false` |

## `SaNumberEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |

## Props

| 属性名     | 描述             | 类型                                    | 默认值      |
| ---------- | ---------------- | --------------------------------------- | ----------- |
| id         | 组件唯一标识     | `string`                                | `undefined` |
| class      | 自定义类名       | `string`                                | `undefined` |
| style      | 自定义样式       | `Record<string, string>`                | `undefined` |
| title      | 表单项标签       | `Record<languageKey, string> \| string` | `undefined` |
| titleWidth | 表单项标签宽度   | `string`                                | `100px`     |
| onChange   | 数据变更回调函数 | `({ value, oldValue }) => void`         | `undefined` |
| onChange   | 数据变更回调函数 | `({ value, oldValue }) => void`         | `undefined` |
