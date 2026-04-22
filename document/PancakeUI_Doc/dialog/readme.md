# Dialog 弹窗

常用的弹窗组件。

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

## `SaDialogType`

| 属性名             | 描述            | 类型                                             | 默认值      |
| ------------------ | --------------- | ------------------------------------------------ | ----------- |
| id                 | 唯一标识        | `string`                                         | - |
| class              | 自定义类名      | `string`                                         | - |
| modelValue         | 是否打开 Dialog | `boolean`                                        | `false`     |
| size               | Dialog 尺寸     | `l` `m` `max` `s`                                | `m`         |
| height             | Dialog 高度     | `string` `number` `"auto"` `"default"`           | —           |
| width              | Dialog 宽度     | `string` `number`                                | —           |
| offsetX            | X 轴偏移量      | `string` `number`                                | `0`         |
| offsetY            | Y 轴偏移量      | `string` `number`                                | `0`         |
| keepAlive          | 缓存模式        | `boolean`                                        | `false`     |
| title              | Dialog 标题     | `string`                                         | —           |
| subTitle           | Dialog 子标题   | `string`                                         | —           |
| useFull            | 使用全屏模式    | `boolean`                                        | `true`      |
| scroll             | 开启滚动        | `boolean`                                        | `true`      |
| useScrollX         | 开启 X 轴滚动   | `boolean`                                        | `false`     |
| titleAlign         | 标题对齐方式    | `center` `left` `right`                          | `center`    |
| closeOnClickModal  | 点击 Modal 退出 | `boolean`                                        | `true`      |
| closeOnPressEscape | 按下 Esc 退出   | `boolean`                                        | `true`      |
| padding            | 内边距          | `Array<"all"  "bottom"  "left"  "right"  "top">` | —           |

## 使用 `插槽位置` 展示

| 描述        | 字段   |
| ----------- | ------ |
| Dialog 底部 | footer |
| Dialog 标题 | header |
