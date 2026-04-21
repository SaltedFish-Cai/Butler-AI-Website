# Badge 徽标

`pa-badge` 用于显示带有数字或点的徽章提示。

## 基础使用

徽标组件最基本的用法，只需在组件内部放置需要展示的内容即可。

<demo src="./base.vue"></demo>

## Props

| 字段  | 描述       | 类型                     | 默认值      |
| ----- | ---------- | ------------------------ | ----------- |
| value | 徽标值     | `number \| string`       | `''`        |
| show  | 是否显示   | `boolean`                | `true`      |
| class | 自定义类名 | `string`                 | `undefined` |
| style | 自定义样式 | `Record<string, string>` | `undefined` |
