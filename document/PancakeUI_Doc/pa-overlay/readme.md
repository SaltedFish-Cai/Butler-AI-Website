# Overlay 遮罩层

`pa-overlay` 用于创建一个遮罩层，通常用于弹窗等场景的背景遮罩。

## 基础使用

<demo src="./base.vue"></demo>

## Props

| 字段       | 描述         | 类型                     | 默认值      |
| ---------- | ------------ | ------------------------ | ----------- |
| modelValue | 是否显示遮罩 | `boolean`                | `false`     |
| class      | 自定义类名   | `string[] \| string`     | `''`        |
| style      | 自定义样式   | `Record<string, string>` | `undefined` |
| useBlock   | 是否使用阻塞 | `boolean`                | `true`      |
| teleportTo | 目标挂载元素 | `HTMLElement`            | `null`      |
