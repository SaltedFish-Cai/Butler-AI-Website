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

| 属性名         | 描述                     | 类型                                                                                     | 默认值      |
| -------------- | ------------------------ | ---------------------------------------------------------------------------------------- | ----------- |
| id             | 唯一标识                 | `string` `undefined`                                                                     | `undefined` |
| class          | 自定义类名               | `string` `undefined`                                                                     | `undefined` |
| style          | 自定义样式               | `Record<string, string>` `undefined`                                                     | `undefined` |
| modelValue     | 绑定值                   | `Array<boolean \| number \| string>` `undefined`                                         | `undefined` |
| disabled       | 禁用状态                 | `boolean`                                                                                | `false`     |
| display        | 纯展示                   | `boolean`                                                                                | `false`     |
| displayValue   | 纯展示类型下，直接显示值 | `string` `undefined`                                                                     | `undefined` |
| exOptions      | 选项                     | [`SaSelectOptionsType`](/document/PancakeUI_Doc/options#saselectoptionstype) `undefined` | `undefined` |
| contrastData   | 对比用原数据             | `string` `number` `boolean` `undefined`                                                  | `undefined` |
| alwaysContrast | 是否总是显示对不数据     | `boolean`                                                                                | `false`     |
| title          | 表单项标签               | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined`                                | `undefined` |
| titleWidth     | 表单项标签宽度           | `string` `undefined`                                                                     | `undefined` |
| onChange       | 数据变更回调函数         | `({ value, oldValue, option }) => void`                                                  | `undefined` |

## ComponentItemProps

| 字段            | 描述     | 类型                                                       | 默认值      |
| --------------- | -------- | ---------------------------------------------------------- | ----------- |
| modelValue      | 绑定值   | `string` `number` `boolean` `undefined`                    | `undefined` |
| label           | 选项名   | ` Record<'en-US' \| 'zh-CN', string>` `string` `undefined` | `undefined` |
| value           | 选项值   | `string` `number` `boolean` `undefined`                    | `undefined` |
| isChecked       | 是否选中 | `boolean` `undefined`                                      | `undefined` |
| isIndeterminate | 是否半选 | `boolean`                                                  | `false`     |
| disabled        | 禁用状态 | `boolean`                                                  | `false`     |
