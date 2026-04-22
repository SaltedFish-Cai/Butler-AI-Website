# Checkbox 多选框

常用与选择多个选项相关的场景。

:::warning 注意
`pa-checkbox` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 基础用法

<demo src="./base.vue" ></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue" ></demo>

## 单选项使用

使用 `<pa-checkbox-item />` 展示单选项使用功能，当使用 `isChecked` 属性时，将直接使用该属性值展示选中状态，不受点击控制。

<demo src="./item.vue" ></demo>

## ComponentProps

| 属性名         | 描述                     | 类型                                                                         | 默认值 |
| -------------- | ------------------------ | ---------------------------------------------------------------------------- | ------ |
| id             | 唯一标识                 | `string`                                                                     | -      |
| class          | 自定义类名               | `string`                                                                     | -      |
| style          | 自定义样式               | `Record<string, string>`                                                     | -      |
| modelValue     | 绑定值                   | `Array<boolean \| number \| string>`                                         | —      |
| disabled       | 禁用状态                 | `boolean`                                                                    | —      |
| display        | 纯展示                   | `boolean`                                                                    | —      |
| displayValue   | 纯展示类型下，直接显示值 | `string`                                                                     | -      |
| exOptions      | 选项                     | [`SaSelectOptionsType`](/document/PancakeUI_Doc/options#saselectoptionstype) | -      |
| contrastData   | 对比用原数据             | `string` `number` `boolean`                                                  | —      |
| alwaysContrast | 是否总是显示对不数据     | `boolean`                                                                    | —      |
| title          | 表单项标签               | `Record<'en-US' \| 'zh-CN', string>` `string`                                | -      |
| titleWidth     | 表单项标签宽度           | `string`                                                                     | -      |
| onChange       | 数据变更回调函数         | `({ value, oldValue, option }) => void`                                      | -      |

## ComponentItemProps

| 字段            | 描述     | 类型                                           | 默认值 |
| --------------- | -------- | ---------------------------------------------- | ------ |
| modelValue      | 绑定值   | `string` `number` `boolean`                    | —      |
| label           | 选项名   | ` Record<'en-US' \| 'zh-CN', string>` `string` | —      |
| value           | 选项值   | `string` `number` `boolean`                    | —      |
| isChecked       | 是否选中 | `boolean`                                      | —      |
| isIndeterminate | 是否半选 | `boolean`                                      | —      |
| disabled        | 禁用状态 | `boolean`                                      | —      |
