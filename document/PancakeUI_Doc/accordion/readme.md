# Accordion 手风琴

用于折叠/展开内容区域，支持自定义头部插槽和禁用状态。

## 基础用法

使用 `pa-accordion` 包裹 `pa-accordion-item`，通过 `v-model:expanded` 控制展开状态。

<demo src="./base.vue"></demo>

## 禁用状态

使用 `disabled` 禁用指定项，禁止展开或折叠。

<demo src="./disabled.vue"></demo>

## 自定义头部

使用 `header` 插槽自定义展开项头部内容，插槽暴露 `expanded` 和 `toggle` 方法。

<demo src="./header.vue"></demo>

## ComponentProps

### PaAccordionProps

| 属性名 | 描述 | 类型 | 默认值 |
| ---------------- | ---------------- | ---------------- | ---------------- |
| id | 组件唯一标识 | `string` | - |
| class | 自定义类名 | `Array<string>` `string` | - |
| style | 自定义样式 | `Record<string, string>` | - |

### PaAccordionItemProps

| 属性名 | 描述 | 类型 | 默认值 |
| ---------------- | ---------------- | ---------------- | ---------------- |
| id | 组件唯一标识 | `string` | - |
| class | 自定义类名 | `Array<string>` `string` | - |
| style | 自定义样式 | `Record<string, string>` | - |
| expanded | 是否展开 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |

## ComponentEmits

### PaAccordionItemEmits

| 事件名 | 描述 | 回调函数 |
| ---------------- | ---------------- | ---------------- |
| update:expanded | 展开状态更新时触发 | `(value: boolean) => void` |

## ComponentSlots

### PaAccordionItemSlots

| 插槽名称 | 作用 |
| ---------------- | ---------------- |
| `'default'` | 默认内容插槽，作用域：`{ expanded: boolean }` |
| `'header'` | 自定义头部插槽，作用域：`{ expanded: boolean; toggle: () => void }` |
