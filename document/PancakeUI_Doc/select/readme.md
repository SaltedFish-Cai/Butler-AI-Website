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

| 属性名              | 描述                         | 类型                                                                                                                                   | 默认值      |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| id                  | 组件唯一标识                 | `string` `undefined`                                                                                                                   | `undefined` |
| class               | 自定义类名                   | `string` `undefined`                                                                                                                   | `undefined` |
| style               | 自定义样式                   | `Record<string, string>` `undefined`                                                                                                   | `undefined` |
| modelValue          | 绑定值                       | `Array<number \| string>` `number` `string` `undefined`                                                                                | `undefined` |
| displayValue        | 纯展示类型下，直接显示值     | `string` `undefined`                                                                                                                   | `undefined` |
| type                | 组件类型                     | `'multiple-online-select'` `'multiple-request-select'` `'multiple-select'` `'online-select'` `'request-select'` `'select'` `undefined` | `'select'`  |
| clearable           | 显示清除按钮                 | `boolean` `undefined`                                                                                                                  | `true`      |
| exOptions           | 选项                         | [`SaSelectOptionsType`](/document/PancakeUI_Doc/options#saselectoptionstype) `undefined`                                               | `undefined` |
| requestApi          | 异步选项请求接口             | `({ query: string }) => Promise<MOptionV2Type.SelectList>` `undefined`                                                                 | `undefined` |
| placeholder         | 输入框提示                   | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined`                                                                              | `undefined` |
| disabled            | 禁用状态                     | `boolean` `undefined`                                                                                                                  | `undefined` |
| display             | 纯展示                       | `boolean` `undefined`                                                                                                                  | `undefined` |
| contrastData        | 对比用原数据                 | `Array<number \| string>` `number` `string` `undefined`                                                                                | `undefined` |
| alwaysContrast      | 是否总是显示对不数据         | `boolean` `undefined`                                                                                                                  | `undefined` |
| title               | 表单项标签                   | `Record<languageKey, string> \| string` `undefined`                                                                                    | `undefined` |
| titleWidth          | 表单项标签宽度               | `string` `undefined`                                                                                                                   | `undefined` |
| teleportInContainer | 是否使用 Teleport 挂载到容器 | `boolean` `undefined`                                                                                                                  | `undefined` |
| createUseChange     | 创建时是否使用 change 事件   | `boolean` `undefined`                                                                                                                  | `undefined` |

## ComponentEvents

| 字段     | 描述             | 类型                            |
| -------- | ---------------- | ------------------------------- |
| onChange | 数据变更回调函数 | `({ value, oldValue }) => void` |
