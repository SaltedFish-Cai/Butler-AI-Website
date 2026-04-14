# Drawer 抽屉弹窗

抽屉弹窗组件，用于显示操作结果或提示信息。

## `MDrawerV2Type`

| 属性名             | 类型                                                     | 默认值   | 描述                                                 |
| ------------------ | -------------------------------------------------------- | -------- | ---------------------------------------------------- |
| modelValue         | `boolean`                                                | `false`  | 是否打开抽屉弹窗，当设置为 `true` 时，会打开抽屉弹窗 |
| title              | `Record<"en-US" \| "zh-CN", string>`                     | —        | 弹窗标题，支持多语言                                 |
| subTitle           | `Record<"en-US" \| "zh-CN", string>`                     | —        | 弹窗次标题，支持多语言                               |
| width              | `string`                                                 | `500px`  | 弹窗宽度，默认 `500px`                               |
| height             | `number`                                                 | `300px`  | 弹窗高度，默认 `300px`                               |
| scroll             | `boolean`                                                | `false`  | 是否开启抽屉弹窗滚动，默认不开启滚动                 |
| useScrollX         | `boolean`                                                | `false`  | 是否开启抽屉弹窗滚动，默认不开启滚动                 |
| closeOnClickModal  | `boolean`                                                | `true`   | 是否点击抽屉弹窗遮罩层关闭抽屉弹窗，默认开启         |
| closeOnPressEscape | `boolean`                                                | `true`   | 是否按下 `Escape` 键关闭抽屉弹窗，默认开启           |
| padding            | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | —        | 弹窗内边距                                           |
| position           | `"bottom"` `"left"` `"right"` `"top"`                    | `bottom` | 弹窗位置，默认 `right`                               |

## 基础用法

<demo src="./base.vue"></demo>

## 显示位置

抽屉弹窗可以在顶部、左侧、右侧、底部显示，抽屉弹窗默认在右侧显示。

<demo src="./position.vue"></demo>
