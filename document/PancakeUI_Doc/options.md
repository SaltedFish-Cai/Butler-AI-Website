# Options 选项类型

全局选项类型，用于选择联选项相关的场景。

## PaSelectOptionsType

| 字段     | 描述     | 类型                                                          | 默认值      |
| -------- | -------- | ------------------------------------------------------------- | ----------- |
| label    | 选项名   | `string` `undefined`                                          | `undefined` |
| value    | 选项值   | `string` `number` `boolean` `undefined`                       | `undefined` |
| children | 子选项   | `Array<PaSelectOptionsType>` `undefined`                      | `undefined` |
| disabled | 禁用状态 | `boolean` `undefined`                                         | `undefined` |
| base     | 默认数据 | `any` `undefined`                                             | `undefined` |
| tagStyle | 标签样式 | `{bgColor?: string, textColor?: string}` `string` `undefined` | `undefined` |

## PaSwitchOptionType

| 字段          | 描述         | 类型                                                      | 默认值       |
| ------------- | ------------ | --------------------------------------------------------- | ------------ |
| activeValue   | 打开时的值   | `number` `string` `undefined`                             | `true`       |
| inActiveValue | 关闭时的值   | `number` `string` `undefined`                             | `false`      |
| activeText    | 打开时的文本 | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined` | `是` / `Yes` |
| inActiveText  | 关闭时的文本 | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined` | `否` / `No`  |
| activeIcon    | 打开时的图标 | `string` `undefined`                                      | `undefined`  |
| inActiveIcon  | 关闭时的图标 | `string` `undefined`                                      | `undefined`  |
