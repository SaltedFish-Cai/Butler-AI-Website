# Badge 徽标

`pa-badge` 用于显示带有数字或点的徽章提示。

## 基础使用

徽标组件最基本的用法，只需在组件内部放置需要展示的内容即可。

<demo src="./base.vue"></demo>

## 最大值显示使用

::: warning 注意
`value` 属性必须为数字类型，才能使用 `maxValue` 属性设置最大显示值，超过最大值时显示 `+`。
:::

<demo src="./max.vue"></demo>

## 小红点显示使用

使用 `useDot` 属性设置是否显示小红点。

<demo src="./dot.vue"></demo>

## ComponentProps

| 字段     | 描述           | 类型                     | 默认值  |
| -------- | -------------- | ------------------------ | ------- |
| class    | 自定义类名     | `string`                 | -       |
| style    | 自定义样式     | `Record<string, string>` | -       |
| value    | 徽标值         | `number` `string`        | -       |
| maxValue | 最大值         | `number` `string`        | -       |
| useShow  | 是否显示       | `boolean`                | `true`  |
| useDot   | 是否显示小红点 | `boolean`                | `false` |
