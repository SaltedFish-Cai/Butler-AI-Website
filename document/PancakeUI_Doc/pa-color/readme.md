# Color 颜色选择器

`pa-color` 用于选择颜色的组件，支持预设颜色和透明度调节。

## 基础使用

<demo src="./base.vue"></demo>

## 支持透明度

<demo src="./alpha.vue"></demo>

## Props

| 字段         | 描述               | 类型                      | 默认值      |
| ------------ | ------------------ | ------------------------- | ----------- |
| id           | 组件唯一标识       | `string \| undefined`     | `undefined` |
| class        | 自定义类名         | `string`                  | `undefined` |
| style        | 自定义样式         | `Record<string, string>`  | `undefined` |
| value        | 初始颜色值         | `string`                  | `undefined` |
| modelValue   | 当前选中的颜色值   | `string`                  | `#000000`   |
| disabled     | 是否禁用           | `boolean`                 | `false`     |
| showAlpha    | 是否支持透明度     | `boolean`                 | `false`     |
| showInput    | 是否显示颜色输入框 | `boolean`                 | `false`     |
| presetColors | 预设颜色列表       | `string[]`                | `undefined` |
| onChange     | 颜色变化回调       | `(color: string) => void` | `undefined` |
| onOpen       | 打开时回调         | `() => void`              | `undefined` |
| onClose      | 关闭时回调         | `() => void`              | `undefined` |
