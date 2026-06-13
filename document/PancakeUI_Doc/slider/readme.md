# Slider 滑块

通过拖动滑块在指定范围内选择数值，支持单选和范围选择模式。

## 基础用法

使用 `v-model` 绑定数值，拖动滑块选择值。

<demo src="./base.vue"></demo>

## 范围选择

使用 `range` 开启范围选择模式，选择数值区间。

<demo src="./range.vue"></demo>

## 刻度标记

使用 `marks` 添加刻度标记，滑块会自动吸附到标记位置。

<demo src="./marks.vue"></demo>

## 禁用状态

使用 `disabled` 禁用滑块。

<demo src="./disabled.vue"></demo>

## ComponentProps

| 属性名 | 描述 | 类型 | 默认值 |
| ---------------- | ---------------- | ---------------- | ---------------- |
| id | 组件唯一标识 | `string` | - |
| class | 自定义类名 | `Array<string>` `string` | - |
| style | 自定义样式 | `Record<string, string>` | - |
| modelValue | 绑定值 | `number` | - |
| min | 最小值 | `number` | `0` |
| max | 最大值 | `number` | `100` |
| step | 步长 | `number` | `1` |
| range | 是否为范围选择 | `boolean` | `false` |
| marks | 刻度标记 | `Record<number, string \| { label: string; style?: Record<string, string> }>` | - |
| showTooltip | 是否显示 tooltip | `boolean` | `true` |
| disabled | 是否禁用 | `boolean` | `false` |

## ComponentEmits

| 事件名 | 描述 | 回调函数 |
| ---------------- | ---------------- | ---------------- |
| update:modelValue | 绑定值更新时触发 | `(value: number) => void` |
| change | 值变化时触发 | `(value: number) => void` |
