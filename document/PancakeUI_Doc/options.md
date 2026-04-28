# Options 选项类型

全局选项类型，用于选择联选项相关的场景。

## PaSelectOptionsType

用于选择器选项相关的场景。

| 字段     | 描述     | 类型                                              | 默认值 |
| -------- | -------- | ------------------------------------------------- | ------ |
| label    | 选项名   | `string`                                          | -      |
| value    | 选项值   | `string` `number` `boolean`                       | -      |
| children | 子选项   | `Array<PaSelectOptionsType>`                      | -      |
| disabled | 禁用状态 | `boolean`                                         | -      |
| base     | 默认数据 | `any`                                             | -      |
| tagStyle | 标签样式 | `{bgColor?: string, textColor?: string}` `string` | -      |

## PaSwitchOptionType

用于开关选项相关的场景。

| 字段          | 描述         | 类型                                                                                  | 默认值       |
| ------------- | ------------ | ------------------------------------------------------------------------------------- | ------------ |
| activeValue   | 打开时的值   | `number` `string`                                                                     | `true`       |
| inActiveValue | 关闭时的值   | `number` `string`                                                                     | `false`      |
| activeText    | 打开时的文本 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | `是` / `Yes` |
| inActiveText  | 关闭时的文本 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | `否` / `No`  |
| activeIcon    | 打开时的图标 | `string`                                                                              | -            |
| inActiveIcon  | 关闭时的图标 | `string`                                                                              | -            |

## LanguagePackageType

语言包类型，用于选择联选项相关的场景。

| 字段  | 描述     | 类型     |
| ----- | -------- | -------- |
| en-US | 英文描述 | `string` |
| zh-CN | 中文描述 | `string` |
