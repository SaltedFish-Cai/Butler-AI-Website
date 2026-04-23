# Select Icon 图标选择器

`pa-select-icon` 用于从预设的图标库中选择图标。

## 基础使用

<demo src="./base.vue"></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue"></demo>

## ComponentProps

| 属性名              | 描述                     | 类型                                                      | 默认值      |
| ------------------- | ------------------------ | --------------------------------------------------------- | ----------- |
| id                  | 组件唯一标识             | `string` `undefined`                                      | `undefined` |
| class               | 自定义类名               | `string` `undefined`                                      | `undefined` |
| style               | 自定义样式               | `Record<string, string>` `undefined`                      | `undefined` |
| modelValue          | 双向绑定值               | `string` `undefined`                                      | `undefined` |
| displayValue        | 纯展示类型下，直接显示值 | `string` `undefined`                                      | `undefined` |
| placeholder         | 占位符                   | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined` | `undefined` |
| disabled            | 是否禁用                 | `boolean` `undefined`                                     | `undefined` |
| display             | 纯展示模式               | `boolean` `undefined`                                     | `undefined` |
| teleportInContainer | Teleport 目标            | `boolean` `undefined`                                     | `undefined` |
| contrastData        | 对比数据                 | `string` `undefined`                                      | `undefined` |
| alwaysContrast      | 是否显示对比数据         | `boolean` `undefined`                                     | `undefined` |
| title               | 表单项标签               | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined` | `undefined` |
| titleWidth          | 表单项标签宽度           | `string` `undefined`                                      | `undefined` |

## ComponentEvents

| 字段   | 描述           | 类型                            |
| ------ | -------------- | ------------------------------- |
| change | 图标变化时触发 | `({ value, oldValue }) => void` |
