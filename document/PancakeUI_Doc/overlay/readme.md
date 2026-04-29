# Overlay 遮罩层

`pa-overlay` 用于创建一个遮罩层，通常用于弹窗等场景的背景遮罩。

## 基础使用

<demo src="./base.vue"></demo>

## ComponentProps

| 属性名     | 描述             | 类型                                   | 默认值     |
| ---------- | ---------------- | -------------------------------------- | ---------- |
| id         | 唯一标识         | `string`                               | -          |
| class      | 自定义类名       | `Array<string>` \| `string`            | -          |
| style      | 自定义样式       | `Record<string, string>`               | -          |
| modelValue | 是否显示遮罩     | `boolean`                              | `false`    |
| useBlock   | 是否使用阻塞     | `boolean`                              | `true`     |
| teleportTo | 目标挂载元素     | `HTMLElement`                          | -          |

## ComponentEmits

| 字段名            | 描述                   | 回调参数              |
| ----------------- | ---------------------- | --------------------- |
| update:modelValue | 更新 modelValue 时触发 | `value: boolean`      |
| clickOverlay      | 点击遮罩层时触发       | -                     |

## ComponentSlots

| 插槽名    | 作用         |
| --------- | ------------ |
| `'default'` | 默认内容插槽 |
