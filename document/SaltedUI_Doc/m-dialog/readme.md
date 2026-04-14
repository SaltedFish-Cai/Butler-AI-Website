# Dialog 弹窗

常用的弹窗组件。

## `MDialogV2Type`

| 属性名             | 类型                                             | 默认值  | 描述            |
| ------------------ | ------------------------------------------------ | ------- | --------------- |
| modelValue         | `boolean`                                        | `false` | 是否打开 Dialog |
| size               | `l` `m` `max` `s`                                | `m`     | Dialog 尺寸     |
| height             | `string` `number` `"auto"` `"default"`           | —       | Dialog 高度     |
| width              | `string` `number`                                | —       | Dialog 宽度     |
| offsetX            | `string` `number`                                | `0`     | X 轴偏移量      |
| offsetY            | `string` `number`                                | `0`     | Y 轴偏移量      |
| keepAlive          | `boolean`                                        | `false` | 缓存模式        |
| title              | `string`                                         | —       | Dialog 标题     |
| subTitle           | `string`                                         | —       | Dialog 子标题   |
| useFull            | `boolean`                                        | `true`  | 使用全屏模式    |
| scroll             | `boolean`                                        | `true`  | 开启滚动        |
| useScrollX         | `boolean`                                        | `false` | 开启 X 轴滚动   |
| titleAlign         | `center` `left` `right`                          | `left`  | 标题对齐方式    |
| closeOnClickModal  | `boolean`                                        | `true`  | 点击 Modal 退出 |
| closeOnPressEscape | `boolean`                                        | `true`  | 按下 Esc 退出   |
| padding            | `Array<"all"  "bottom"  "left"  "right"  "top">` | —       | 内边距          |

## 基础用法

开盖即用，更可配置 `自定义` 个性化使用。

<demo src="./base.vue" ></demo>

## 宽度设置

使用 `size` 来定义弹出框尺寸。

<demo src="./size.vue"  ></demo>

## 高度设置

使用 `height` 来定义弹窗框高度。

<demo src="./height.vue"  ></demo>

## 偏移设置

使用 `offsetX` 与 `offsetY` 来定义弹窗框位置偏移量。

<demo src="./offset.vue"  ></demo>

## 使用 `插槽位置` 展示

| 字段   | 描述        |
| ------ | ----------- |
| footer | Dialog 底部 |
| header | Dialog 标题 |
