# Color 色彩选择器

颜色选择器，用于选择颜色。

## 基础用法

<demo src="./base.vue" control="false"></demo>

## 单独作为颜色盘使用

<demo src="./color-picker.vue" control="false"></demo>

## ComponentProps

| 属性名 | 描述 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| id | 唯一标识 | `string` \| `undefined` | `undefined` |
| class | 自定义类名 | `Array<string>` \| `string` \| `undefined` | `undefined` |
| style | 自定义样式 | `Record<string, string>` \| `undefined` | `undefined` |
| modelValue | 当前选中的颜色值 | `string` \| `undefined` | `undefined` |
| disabled | 是否禁用状态 | `boolean` \| `undefined` | `undefined` |
| useAlpha | 是否支持透明度 | `boolean` | `true` |
| useInput | 是否显示颜色值输入框 | `boolean` | `true` |
| presetColors | 预设颜色列表 | `Array<string>` \| `undefined` | `undefined` |

## ComponentEmits

| 事件名 | 描述 | 回调函数 |
| ------ | ---- | -------- |
| update:modelValue | 更新模型值事件 | `(value: string) => void` |
| change | 颜色变更事件 | `(value: string) => void` |
