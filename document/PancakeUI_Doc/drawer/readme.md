# Drawer 抽屉弹窗

抽屉弹窗组件，用于显示操作结果或提示信息。

## 基础用法

<demo src="./base.vue"></demo>

## 显示位置

抽屉弹窗可以在顶部、左侧、右侧、底部显示，抽屉弹窗默认在右侧显示。

<demo src="./position.vue"></demo>

## `SaDrawerType`

| 属性名             | 描述                                                 | 类型                                                     | 默认值      |
| ------------------ | ---------------------------------------------------- | -------------------------------------------------------- | ----------- |
| id                 | 唯一标识                                             | `string`                                                 | `undefined` |
| class              | 自定义类名                                           | `string`                                                 | `undefined` |
| style              | 自定义样式                                           | `Record<string, string>`                                 | `undefined` |
| modelValue         | 是否打开抽屉弹窗，当设置为 `true` 时，会打开抽屉弹窗 | `boolean`                                                | `false`     |
| title              | 弹窗标题，支持多语言                                 | `Record<"en-US" \| "zh-CN", string>`                     | —           |
| subTitle           | 弹窗次标题，支持多语言                               | `Record<"en-US" \| "zh-CN", string>`                     | —           |
| width              | 弹窗宽度，默认 `500px`                               | `string`                                                 | `500px`     |
| height             | 弹窗高度，默认 `300px`                               | `number`                                                 | `300px`     |
| scroll             | 是否开启抽屉弹窗滚动                                 | `boolean`                                                | `true`      |
| useScrollX         | 是否开启抽屉弹窗滚动，默认不开启滚动                 | `boolean`                                                | `false`     |
| closeOnClickModal  | 是否点击抽屉弹窗遮罩层关闭抽屉弹窗，默认开启         | `boolean`                                                | `true`      |
| closeOnPressEscape | 是否按下 `Escape` 键关闭抽屉弹窗，默认开启           | `boolean`                                                | `true`      |
| padding            | 弹窗内边距                                           | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | —           |
| position           | 弹窗位置                                             | `"bottom"` `"left"` `"right"` `"top"`                    | `right`     |
| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 组件唯一标识 | `string` | — |
| modelValue | 是否打开抽屉弹窗，当设置为 `true` 时，会打开抽屉弹窗 | `boolean` | `false` |
| title | 弹窗标题，支持多语言 | `Record<"en-US" \| "zh-CN", string>` | — |
| subTitle | 弹窗次标题，支持多语言 | `Record<"en-US" \| "zh-CN", string>` | — |
| width | 弹窗宽度，默认 `500px` | `string` | `500px` |
| height | 弹窗高度，默认 `300px` | `number` | `300px` |
| scroll | 是否开启抽屉弹窗滚动 | `boolean` | `true` |
| useScrollX | 是否开启抽屉弹窗滚动，默认不开启滚动 | `boolean` | `false` |
| closeOnClickModal | 是否点击抽屉弹窗遮罩层关闭抽屉弹窗，默认开启 | `boolean` | `true` |
| closeOnPressEscape | 是否按下 `Escape` 键关闭抽屉弹窗，默认开启 | `boolean` | `true` |
| padding | 弹窗内边距 | `Array<"all" | "bottom" | "left" | "right" | "top">` | — |
| position | 弹窗位置 | `"bottom"` `"left"` `"right"` `"top"` | `right` |

