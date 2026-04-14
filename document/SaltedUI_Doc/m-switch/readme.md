# Switch 开关

:::warning 注意
`m-switch-v2` 可独立使用，在 `m-form-v2/m-table-v2` 中可使用时，需配置 `prop` 字段。
:::

## `MSwitchV2Type`

| 字段           | 类型                        | 默认值  | 描述                 |
| -------------- | --------------------------- | ------- | -------------------- |
| modelValue     | `string`                    | —       | 绑定值               |
| disabled       | `boolean`                   | —       | 禁用状态             |
| display        | `boolean`                   | —       | 纯展示               |
| exOptions      | `MSwitchV2OptionType`       | —       | 选项                 |
| activeValue    | `string` `number` `boolean` | —       | 打开（值）           |
| inActiveValue  | `string` `number` `boolean` | —       | 关闭（值）           |
| activeText     | `string`                    | —       | 打开（键）           |
| inActiveText   | `string`                    | —       | 关闭（键）           |
| contrastData   | `string` `number` `boolean` | —       | 对比用原数据         |
| alwaysContrast | `boolean`                   | `false` | 是否总是显示对不数据 |

## `MSwitchV2OptionType`

| 字段          | 类型                        | 默认值 | 描述       |
| ------------- | --------------------------- | ------ | ---------- |
| activeValue   | `string` `number` `boolean` | —      | 打开（值） |
| inActiveValue | `string` `number` `boolean` | —      | 关闭（值） |
| activeText    | `string`                    | —      | 打开（键） |
| inActiveText  | `string`                    | —      | 关闭（键） |

:::tip 关于优先级
`exOptions` 下数据会优先替换 `props` 下数据
:::

## `MSwitchV2Events`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## 组件功能展示

<demo src="./base.vue" ></demo>
