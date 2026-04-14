# Switch 开关

:::warning 注意
`sa-switch` 可独立使用，在 `sa-form/sa-table` 中可使用时，需配置 `prop` 字段。
:::

## `SaSwitchType`

| 字段           | 类型                        | 默认值  | 描述                 |
| -------------- | --------------------------- | ------- | -------------------- |
| modelValue     | `string`                    | —       | 绑定值               |
| disabled       | `boolean`                   | —       | 禁用状态             |
| display        | `boolean`                   | —       | 纯展示               |
| exOptions      | `SaSwitchOptionType`       | —       | 选项                 |
| activeValue    | `string` `number` `boolean` | —       | 打开（值）           |
| inActiveValue  | `string` `number` `boolean` | —       | 关闭（值）           |
| activeText     | `string`                    | —       | 打开（键）           |
| inActiveText   | `string`                    | —       | 关闭（键）           |
| contrastData   | `string` `number` `boolean` | —       | 对比用原数据         |
| alwaysContrast | `boolean`                   | `false` | 是否总是显示对不数据 |

## `SaSwitchOptionType`

| 字段          | 类型                        | 默认值 | 描述       |
| ------------- | --------------------------- | ------ | ---------- |
| activeValue   | `string` `number` `boolean` | —      | 打开（值） |
| inActiveValue | `string` `number` `boolean` | —      | 关闭（值） |
| activeText    | `string`                    | —      | 打开（键） |
| inActiveText  | `string`                    | —      | 关闭（键） |

:::tip 关于优先级
`exOptions` 下数据会优先替换 `props` 下数据
:::

## `SaSwitchEvents`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## 组件功能展示

<demo src="./base.vue" ></demo>
