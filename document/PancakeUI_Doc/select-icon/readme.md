# Select Icon 图标选择器

`pa-select-icon` 用于从预设的图标库中选择图标。

## 基础使用

<demo src="./base.vue"></demo>

## Props

| 字段                | 描述             | 类型                                    | 默认值      |
| ------------------- | ---------------- | --------------------------------------- | ----------- |
| id                  | 组件唯一标识     | `string \| undefined`                   | `undefined` |
| class               | 自定义类名       | `string`                                | `undefined` |
| style               | 自定义样式       | `Record<string, string>`                | `undefined` |
| modelValue          | 双向绑定值       | `string`                                | `undefined` |
| placeholder         | 占位符           | `Record<languageKey, string> \| string` | —           |
| disabled            | 是否禁用         | `boolean`                               | `false`     |
| display             | 纯展示模式       | `boolean`                               | `false`     |
| teleportInContainer | Teleport 目标    | `boolean`                               | `false`     |
| contrastData        | 对比数据         | `string`                                | `undefined` |
| alwaysContrast      | 是否显示对比数据 | `boolean`                               | `false`     |

## Events

| 事件   | 描述           | 类型                            |
| ------ | -------------- | ------------------------------- |
| change | 图标变化时触发 | `({ value, oldValue }) => void` |
