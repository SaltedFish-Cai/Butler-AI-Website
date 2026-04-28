# Number 数字框

用于输入数字内容，支持增减控制按钮和精度设置。

:::warning 注意
`pa-number` 可独立使用，在 `pa-form/pa-table` 中使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式。

<demo src="./display.vue" ></demo>

## ComponentProps

| 属性名         | 描述                 | 类型                                                                                     | 默认值 |
| -------------- | -------------------- | ---------------------------------------------------------------------------------------- | ------ |
| id             | 组件唯一标识         | `string`                                                                                 | -      |
| class          | 自定义类名           | `Array<string>` `string`                                                                 | -      |
| style          | 自定义样式           | `Record<string, string>`                                                                 | -      |
| modelValue     | 双向绑定值           | `string` \| `number`                                                                     | -      |
| placeholder    | 输入框占位符         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -      |
| title          | 表单项标签           | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -      |
| titleWidth     | 表单项标签宽度       | `string`                                                                                 | -      |
| disabled       | 禁用状态             | `boolean`                                                                                | -      |
| display        | 纯展示模式           | `boolean`                                                                                | -      |
| controls       | 显示控制按钮         | `boolean`                                                                                | `true` |
| min            | 最小值               | `number`                                                                                 | -      |
| max            | 最大值               | `number`                                                                                 | -      |
| unit           | 单位                 | `string`                                                                                 | -      |
| precision      | 小数精度             | `number`                                                                                 | `0`    |
| clearable      | 显示清除按钮         | `boolean`                                                                                | `true` |
| autofocus      | 自动获取焦点         | `boolean`                                                                                | -      |
| step           | 步长                 | `number`                                                                                 | `1`    |
| contrastData   | 对比数据             | `number` \| `string`                                                                     | -      |
| alwaysContrast | 是否总是显示对比数据 | `boolean`                                                                                | -      |

## ComponentEmits

| 事件名            | 描述             | 回调函数                                              |
| ----------------- | ---------------- | ----------------------------------------------------- |
| update:modelValue | 双向绑定值更新时 | `(value: number \| string) => void`                             |
| change            | 数据变更时触发   | `(data: { value: number \| string; oldValue: number \| string }) => void` |
| blur              | 失去焦点时触发   | `() => void`                                          |
| focus             | 获得焦点时触发   | `() => void`                                          |
