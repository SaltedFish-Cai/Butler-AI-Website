# Switch 开关

常用与选择开关相关的场景。

:::warning 注意
`pa-switch` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaSwitchType`

| 字段           | 描述                 | 类型                        | 默认值  |
| -------------- | -------------------- | --------------------------- | ------- |
| modelValue     | 绑定值               | `string`                    | —       |
| disabled       | 禁用状态             | `boolean`                   | —       |
| display        | 纯展示               | `boolean`                   | —       |
| exOptions      | 选项                 | `SaSwitchOptionType`        | —       |
| activeValue    | 打开（值）           | `string` `number` `boolean` | —       |
| inActiveValue  | 关闭（值）           | `string` `number` `boolean` | —       |
| activeText     | 打开（键）           | `string`                    | —       |
| inActiveText   | 关闭（键）           | `string`                    | —       |
| contrastData   | 对比用原数据         | `string` `number` `boolean` | —       |
| alwaysContrast | 是否总是显示对不数据 | `boolean`                   | `false` |

## `SaSwitchOptionType`

| 字段          | 描述       | 类型                        | 默认值 |
| ------------- | ---------- | --------------------------- | ------ |
| activeValue   | 打开（值） | `string` `number` `boolean` | 1      |
| inActiveValue | 关闭（值） | `string` `number` `boolean` | 0      |
| activeText    | 打开（键） | `string`                    | —      |
| inActiveText  | 关闭（键） | `string`                    | —      |

:::tip 关于优先级
`exOptions` 下数据会优先替换 `props` 下数据
:::

## `SaSwitchEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |

## Props

| 属性名       | 描述             | 类型                            | 默认值      |
| ------------ | ---------------- | ------------------------------- | ----------- |
| id           | 组件唯一标识     | `string`                        | - |
| class        | 自定义类名       | `string`                        | - |
| style        | 自定义样式       | `Record<string, string>`        | - |
| iconStyle    | 图标样式         | `Record<string, string>`        | - |
| activeIcon   | 打开图标         | `string`                        | - |
| inActiveIcon | 关闭图标         | `string`                        | - |
| onChange     | 数据变更回调函数 | `({ value, oldValue }) => void` | - |
