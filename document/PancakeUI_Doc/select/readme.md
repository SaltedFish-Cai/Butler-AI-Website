# Select 选择器

常用于选择选项的场景。

:::warning 注意
`pa-select` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue" ></demo>

## 异步选择器

使用 `online-select` 或者 `request-select` 展开启异步选择器功能, 并配置 `requestApi` 属性，即可开启异步选择器功能。

<demo src="./online.vue" ></demo>
:::tip `request-select` 和 `online-select` 区别
`request-select` 只会在组件创建时单次调用 `requestApi`，而 `online-select` 会在输入框值变化时调用 `requestApi`。
:::

## ComponentProps

| 属性名              | 描述                         | 类型                                                                                                  | 默认值     |
| ------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------- | ---------- |
| id                  | 组件唯一标识                 | `string`                                                                                              | -          |
| class               | 自定义类名                   | `string`                                                                                              | -          |
| style               | 自定义样式                   | `Record<string, string>`                                                                              | -          |
| modelValue          | 绑定值                       | `Array<number \| string>` `number` `string`                                                           | -          |
| displayValue        | 纯展示类型下，直接显示值     | `string`                                                                                              | -          |
| type                | 组件类型                     | [`ComponentType`](#componenttype)                                                                     | `'select'` |
| clearable           | 显示清除按钮                 | `boolean`                                                                                             | `true`     |
| exOptions           | 选项                         | [`PaSelectOptionsType`](/document/PancakeUI_Doc/options#paselectoptionstype)                          | -          |
| requestApi          | 异步选项请求接口             | `({ query: string }) => `[`PaSelectOptionsType`](/document/PancakeUI_Doc/options#paselectoptionstype) | -          |
| placeholder         | 输入框提示                   | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string`                 | -          |
| disabled            | 禁用状态                     | `boolean`                                                                                             | -          |
| display             | 纯展示                       | `boolean`                                                                                             | -          |
| contrastData        | 对比用原数据                 | `Array<number \| string>` `number` `string`                                                           | -          |
| alwaysContrast      | 是否总是显示对不数据         | `boolean`                                                                                             | -          |
| title               | 表单项标签                   | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string`                 | -          |
| titleWidth          | 表单项标签宽度               | `string`                                                                                              | -          |
| teleportInContainer | 是否使用 Teleport 挂载到容器 | `boolean`                                                                                             | -          |
| createUseChange     | 创建时是否使用 change 事件   | `boolean`                                                                                             | -          |

# ComponentType

| 组件类型                    | 描述       |
| --------------------------- | ---------- |
| `'select'`                  | 单选器     |
| `'multiple-select'`         | 多选器     |
| `'request-select'`          | 异步单选器 |
| `'multiple-request-select'` | 异步多选器 |
| `'online-select'`           | 远端单选器 |
| `'multiple-online-select'`  | 远端多选器 |

## ComponentEvents

| 字段   | 描述             | 类型                            |
| ------ | ---------------- | ------------------------------- |
| change | 数据变更回调函数 | `({ value, oldValue }) => void` |
