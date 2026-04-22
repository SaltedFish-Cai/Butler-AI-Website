# Cascader 级联选择器

常用与选择联选项相关的场景。

:::warning 注意
`pa-cascader` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 基础用法

组件默认使用 `cascader` 类型，也可以使用 `multiple-cascader` 类型展示多选功能, 并配合 `title` 属性展示标题。

<demo src="./base.vue" ></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue" ></demo>

## 单层选择器

使用 `cascader-check` 展示 `单层` 选择器功能, 使用 `multiple-cascader-check` 展示 `单层多选` 选择器功能

<demo src="./single.vue" ></demo>

## ComponentProps

| 属性名              | 描述                                            | 类型                                                                                          | 默认值       |
| ------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------ |
| id                  | 唯一标识                                        | `string` `undefined`                                                                          | `undefined`  |
| class               | 自定义类名                                      | `string` `undefined`                                                                          | `undefined`  |
| style               | 自定义样式                                      | `Record<string, string>` `undefined`                                                          | `undefined`  |
| modelValue          | 绑定值                                          | `Array<number \| string>` `number` `string` `undefined`                                       | `undefined`  |
| type                | 组件类型                                        | `'cascader-check'` `'cascader'` `'multiple-cascader-check'` `'multiple-cascader'` `undefined` | `'cascader'` |
| useTextByLink       | 非多选模式下，是否使用'AA/aa'格式的选项标签模式 | `boolean` `undefined`                                                                         | `true`       |
| clearable           | 显示清除按钮                                    | `boolean` `undefined`                                                                         | `true`       |
| useValueBylink      | 非多选模式下，是否使用'AA-aa'格式的选项值模式   | `boolean` `undefined`                                                                         | `undefined`  |
| exOptions           | 选项                                            | [`PaSelectOptionsType`](/document/PancakeUI_Doc/options#paselectoptionstype) `undefined`      | `undefined`  |
| placeholder         | 输入框提示                                      | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined`                                     | `undefined`  |
| disabled            | 禁用状态                                        | `boolean` `undefined`                                                                         | `undefined`  |
| display             | 纯展示                                          | `boolean` `undefined`                                                                         | `undefined`  |
| displayValue        | 纯展示类型下，直接显示值                        | `string` `undefined`                                                                          | `undefined`  |
| contrastData        | 对比用原数据                                    | `Array<number \| string>` `number` `string` `undefined`                                       | `undefined`  |
| alwaysContrast      | 是否总是显示对不数据                            | `boolean` `undefined`                                                                         | `undefined`  |
| title               | 表单项标签                                      | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined`                                     | `undefined`  |
| titleWidth          | 表单项标签宽度                                  | `string` `undefined`                                                                          | `undefined`  |
| teleportInContainer | 是否使用 Teleport 挂载到容器                    | `boolean` `undefined`                                                                         | `undefined`  |
| onChange            | 数据变更回调函数                                | `({ value, oldValue, option }) => void` `undefined`                                           | `undefined`  |

## ComponentEvents

| 字段     | 描述             | 类型                            |
| -------- | ---------------- | ------------------------------- |
| onChange | 数据变更回调函数 | `({ value, oldValue }) => void` |
