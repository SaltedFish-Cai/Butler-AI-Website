# Color 色彩选择器

颜色选择器，用于选择颜色。

## 基础用法

<demo src="./base.vue" control="false"></demo>

## 单独作为颜色盘使用

<demo src="./color-picker.vue" control="false"></demo>

## ComponentProps

| 属性名       | 描述                           | 类型                     | 默认值 |
| ------------ | ------------------------------ | ------------------------ | ------ |
| id           | 唯一标识                       | `string`                 | -      |
| class        | 自定义类名                     | `string`                 | -      |
| style        | 自定义样式                     | `Record<string, string>` | -      |
| useInput     | 是否显示颜色值输入框           | `boolean`                | `true` |
| useAlpha     | 是否显示透明度选择器           | `boolean`                | `true` |
| modelValue   | 双向绑定值                     | `string`                 | -      |
| disabled     | 是否禁用按钮                   | `boolean`                | -      |
| presetColors | 预设颜色列表，用于快速选择颜色 | `Array<string>`          | -      |

## ComponentEmits

| 字段   | 描述                 | 类型                      |
| ------ | -------------------- | ------------------------- |
| change | 颜色变化时的回调函数 | `(color: string) => void` |
