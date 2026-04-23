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

| 属性名              | 描述                                            | 类型                                                                                  | 默认值       |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------- | ------------ |
| id                  | 唯一标识                                        | `string`                                                                              | -            |
| class               | 自定义类名                                      | `string`                                                                              | -            |
| style               | 自定义样式                                      | `Record<string, string>`                                                              | -            |
| modelValue          | 绑定值                                          | `Array<number \| string>` `number` `string`                                           | -            |
| type                | 组件类型                                        | `'cascader-check'` `'cascader'` `'multiple-cascader-check'` `'multiple-cascader'`     | `'cascader'` |
| useTextByLink       | 非多选模式下，是否使用'AA/aa'格式的选项标签模式 | `boolean`                                                                             | `true`       |
| clearable           | 显示清除按钮                                    | `boolean`                                                                             | `true`       |
| useValueBylink      | 非多选模式下，是否使用'AA-aa'格式的选项值模式   | `boolean`                                                                             | -            |
| exOptions           | 选项                                            | [`PaSelectOptionsType`](/document/PancakeUI_Doc/options#paselectoptionstype)          | -            |
| placeholder         | 输入框提示                                      | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -            |
| disabled            | 禁用状态                                        | `boolean`                                                                             | -            |
| display             | 纯展示                                          | `boolean`                                                                             | -            |
| displayValue        | 纯展示类型下，直接显示值                        | `string`                                                                              | -            |
| contrastData        | 对比用原数据                                    | `Array<number \| string>` `number` `string`                                           | -            |
| alwaysContrast      | 是否总是显示对不数据                            | `boolean`                                                                             | -            |
| title               | 表单项标签                                      | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -            |
| titleWidth          | 表单项标签宽度                                  | `string`                                                                              | -            |
| teleportInContainer | 是否使用 Teleport 挂载到容器                    | `boolean`                                                                             | -            |

## ComponentEmits

| 字段   | 描述             | 类型                            |
| ------ | ---------------- | ------------------------------- |
| change | 数据变更回调函数 | `({ value, oldValue }) => void` |
