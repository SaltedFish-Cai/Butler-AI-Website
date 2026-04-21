# Select 选择器

常用于选择选项的场景。

:::warning 注意
`pa-select` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue"></demo>

## `SaSelectType`

| 字段 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 组件唯一标识 | `string` | — |
| class | 自定义类名 | `string` | — |
| style | 自定义样式 | `Record<string, string>` | — |
| title | 标题 | `Record<"en-US" \| "zh-CN", string>` `string` | — |
| titleWidth | 标题宽度 | `string` | `100px` |
| modelValue | 绑定值 | `Array<number \| string>` `number` `string` | — |
| displayValue | 纯展示类型下，直接显示值 | `string` | — |
| type | 组件类型 | `multiple-online-select` `multiple-request-select` `multiple-select` `online-select` `request-select` `select` | `select` |
| exOptions | 选项 | `MOptionV2Type.SelectList` | — |
| requestApi | 异步选项请求接口 | `({ query: string }) => Promise<MOptionV2Type.SelectList>` | — |
| placeholder | 输入框提示 | `Record<"en-US" \| "zh-CN", string>` `string` | — |
| disabled | 禁用状态 | `boolean` | `false` |
| display | 纯展示 | `boolean` | `false` |
| clearable | 显示清除按钮 | `boolean` | `true` |
| teleportInContainer | 是否将弹出层挂载到容器中 | `boolean` | `false` |
| createUseChange | 创建时是否触发change事件 | `boolean` | `false` |
| contrastData | 对比用原数据 | `Array<number \| string>` `number` `string` | — |
| alwaysContrast | 是否总是显示对比数据 | `boolean` | `false` |

:::tip `request-select` 和 `online-select` 区别
`request-select` 只会在组件创建时单次调用 `requestApi`，而 `online-select` 会在输入框值变化时调用 `requestApi`
:::

## `SaSelectEvents`

| 字段 | 描述 | 类型 |
| --- | --- | --- |
| change | 当值改变时触发 | `function` |

## `MOptionV2Type.SelectList(Array<SaSelectOptionsType>)`

| 字段     | 描述     | 类型                                              | 默认值  |
| -------- | -------- | ------------------------------------------------- | ------- |
| label    | 选项名   | `string`                                          |         |
| value    | 选项值   | `string` `number` `boolean`                       |         |
| children | 子选项   | `Array<SaSelectOptionsType>`                      |         |
| disabled | 禁用状态 | `boolean`                                         | `false` |
| base     | 默认数据 | `any`                                             |         |
| tagStyle | 标签样式 | `{bgColor?: string, textColor?: string}` `string` |         |

## Props

| 属性名              | 描述                         | 类型                                    | 默认值      |
| ------------------- | ---------------------------- | --------------------------------------- | ----------- |
| id                  | 组件唯一标识                 | `string`                                | `undefined` |
| class               | 自定义类名                   | `string`                                | `undefined` |
| style               | 自定义样式                   | `Record<string, string>`                | `undefined` |
| title               | 表单项标签                   | `Record<languageKey, string> \| string` | `undefined` |
| titleWidth          | 表单项标签宽度               | `string`                                | `100px`     |
| teleportInContainer | 是否使用 Teleport 挂载到容器 | `boolean`                               | `false`     |
| createUseChange     | 创建时是否使用 change 事件   | `boolean`                               | `false`     |
| onChange            | 数据变更回调函数             | `({ value, oldValue, option }) => void` | `undefined` |
| onChange            | 数据变更回调函数             | `({ value, oldValue, option }) => void` | `undefined` |
| 字段 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项名 | `string` | |
| value | 选项值 | `string` `number` `boolean` | |
| children | 子选项 | `Array<SaSelectOptionsType>` | |
| disabled | 禁用状态 | `boolean` | `false` |
| base | 默认数据 | `any` | |
| tagStyle | 标签样式 | `{bgColor?: string, textColor?: string}` `string` | |

