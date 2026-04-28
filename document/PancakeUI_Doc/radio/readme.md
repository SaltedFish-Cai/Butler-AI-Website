# Radio 单选框

常用于单选选项相关的场景。

:::warning 注意
`pa-radio` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue"></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue"></demo>

## 单选项使用

使用 `<pa-radio-item />` 展示单选项使用功能，当使用 `isChecked` 属性时，将直接使用该属性值展示选中状态，不受点击控制。

<demo src="./item.vue"></demo>

## ComponentProps

| 属性名         | 描述                     | 类型                                                                                     | 默认值 |
| -------------- | ------------------------ | ---------------------------------------------------------------------------------------- | ------ |
| id             | 组件唯一标识             | `string`                                                                                 | -      |
| class          | 自定义类名               | `Array<string>` \| `string`                                                              | -      |
| style          | 自定义样式               | `Record<string, string>`                                                                 | -      |
| modelValue     | 绑定值                   | `boolean` \| `number` \| `string`                                                        | -      |
| displayValue   | 纯展示类型下，直接显示值 | `string`                                                                                 | -      |
| disabled       | 禁用状态                 | `boolean`                                                                                | -      |
| display        | 纯展示                   | `boolean`                                                                                | -      |
| exOptions      | 选项                     | [`PaOptionType.SelectList`](/document/PancakeUI_Doc/options#paoptiontypeselectlist)      | -      |
| contrastData   | 对比用原数据             | `number` \| `string`                                                                     | -      |
| alwaysContrast | 是否总是显示对不数据     | `boolean`                                                                                | -      |
| title          | 表单项标签               | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -      |
| titleWidth     | 表单项标签宽度           | `string`                                                                                 | -      |

## ComponentItemProps

| 属性名     | 描述       | 类型                                                                                     | 默认值 |
| ---------- | ---------- | ---------------------------------------------------------------------------------------- | ------ |
| id         | 唯一标识   | `string`                                                                                 | -      |
| class      | 自定义类名 | `Array<string>` \| `string`                                                              | -      |
| style      | 自定义样式 | `Record<string, string>`                                                                 | -      |
| modelValue | 绑定值     | `boolean` \| `number` \| `string`                                                        | -      |
| label      | 选项名     | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` | -      |
| value      | 选项值     | `boolean` \| `number` \| `string`                                                        | -      |
| isChecked  | 是否选中   | `boolean`                                                                                | -      |
| disabled   | 禁用状态   | `boolean`                                                                                | -      |

## ComponentEmits

| 事件名            | 描述             | 回调函数                                                                                                                     |
| ----------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| update:modelValue | 双向绑定值更新时 | `(value: boolean \| number \| string) => void`                                                                               |
| change            | 数据变更回调函数 | `(data: { value: boolean \| number \| string; oldValue: boolean \| number \| string; option: PaOptionType.Select }) => void` |

## ComponentSlots

| 插槽名称   | 作用                       |
| ---------- | -------------------------- |
| exDisplay  | 纯展示模式下自定义展示内容 |
| exContrast | 对比数据自定义展示内容     |
