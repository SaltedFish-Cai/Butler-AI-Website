# Color 色彩选择器

颜色选择器，用于选择颜色。

## 基础用法

<demo src="./base.vue" control="false"></demo>

## `SaColorType`

| 属性名       | 描述                                     | 类型       | 默认值  |
| ------------ | ---------------------------------------- | ---------- | ------- |
| id           | 组件唯一标识符，用于 DOM 操作和事件绑定  | `string`   | —       |
| modelValue   | 绑定值，用于父组件与子组件之间的双向绑定 | `string`   | —       |
| disabled     | 是否禁用按钮                             | `boolean`  | `false` |
| showAlpha    | 是否显示透明度选择器                     | `boolean`  | `false` |
| presetColors | 预设颜色列表，用于快速选择颜色           | `string[]` | —       |
