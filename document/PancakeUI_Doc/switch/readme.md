# Switch 开关

常用于选择开关相关的场景。

:::warning 注意
`pa-switch` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue" ></demo>

## ComponentProps

| 属性名         | 描述                     | 类型                                                   | 默认值      |
| -------------- | ------------------------ | ------------------------------------------------------ | ----------- |
| id             | 组件唯一标识             | `string` `undefined`                                   | `undefined` |
| class          | 自定义类名               | `string` `undefined`                                   | `undefined` |
| style          | 自定义样式               | `Record<string, string>` `undefined`                   | `undefined` |
| iconStyle      | 图标样式                 | `Record<string, string>` `undefined`                   | `undefined` |
| modelValue     | 绑定值                   | `boolean` `number` `string` `undefined`                | `undefined` |
| displayValue   | 纯展示类型下，直接显示值 | `string` `undefined`                                   | `undefined` |
| disabled       | 禁用状态                 | `boolean` `undefined`                                  | `undefined` |
| display        | 纯展示                   | `boolean` `undefined`                                  | `undefined` |
| activeValue    | 打开时的值               | `number` `string` `undefined`                          | `true`      |
| inActiveValue  | 关闭时的值               | `number` `string` `undefined`                          | `false`     |
| activeText     | 打开时的文本             | `Record<LanguageKey, string>` \| `string` `undefined`  | `是` / `Yes` |
| inActiveText   | 关闭时的文本             | `Record<LanguageKey, string>` \| `string` `undefined`  | `否` / `No`  |
| activeIcon     | 打开时的图标             | `string` `undefined`                                   | `undefined` |
| inActiveIcon   | 关闭时的图标             | `string` `undefined`                                   | `undefined` |
| exOptions      | 外部配置数据             | `PaSwitchOptionType` `undefined`                       | `undefined` |
| contrastData   | 对比用原数据             | `boolean` `number` `string` `undefined`                | `undefined` |
| alwaysContrast | 是否总是显示对不数据     | `boolean` `undefined`                                  | `undefined` |
| title          | 表单项标签               | `Record<LanguageKey, string>` \| `string` `undefined`  | `undefined` |
| titleWidth     | 表单项标签宽度           | `string` `undefined`                                   | `undefined` |

## PaSwitchOptionType

| 字段          | 描述         | 类型                                                  | 默认值      |
| ------------- | ------------ | ----------------------------------------------------- | ----------- |
| activeValue   | 打开时的值   | `number` `string` `undefined`                         | `true`      |
| inActiveValue | 关闭时的值   | `number` `string` `undefined`                         | `false`     |
| activeText    | 打开时的文本 | `Record<LanguageKey, string>` \| `string` `undefined` | `是` / `Yes` |
| inActiveText  | 关闭时的文本 | `Record<LanguageKey, string>` \| `string` `undefined` | `否` / `No`  |
| activeIcon    | 打开时的图标 | `string` `undefined`                                  | `undefined` |
| inActiveIcon  | 关闭时的图标 | `string` `undefined`                                  | `undefined` |

:::tip 关于优先级
`exOptions` 下数据会优先替换 `props` 下数据
:::

## ComponentEvents

| 字段     | 描述             | 类型                            |
| -------- | ---------------- | ------------------------------- |
| onChange | 数据变更回调函数 | `({ value, oldValue }) => void` |
