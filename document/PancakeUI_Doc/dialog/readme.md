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

<demo src="./height.vue" ></demo>

## 偏移设置

使用 `offsetX` 与 `offsetY` 来定义弹窗框位置偏移量。

<demo src="./offset.vue" ></demo>

## ComponentProps

| 属性名             | 描述               | 类型                                                                 | 默认值      |
| ------------------ | ------------------ | -------------------------------------------------------------------- | ----------- |
| id                 | 唯一标识           | `string`                                                             | -           |
| class              | 自定义类名         | `Array<string>` `string`                                             | -           |
| style              | 自定义样式         | `Record<string, string>`                                             | -           |
| modelValue         | 是否打开弹窗       | `boolean`                                                            | -           |
| size               | 弹窗尺寸           | `'full'` `'l'` `'m'` `'max'` `'s'`                                   | `'m'`       |
| height             | 弹窗高度           | `number` `string` `'auto'` `'default'`                               | `'auto'`    |
| width              | 弹窗宽度           | `number` `string`                                                    | -           |
| offsetX            | X轴偏移量          | `number` `string`                                                    | `0`         |
| offsetY            | Y轴偏移量          | `number` `string`                                                    | `0`         |
| keepAlive          | 是否使用缓存页面   | `boolean`                                                            | `true`      |
| title              | 弹窗标题           | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | `'标题'`    |
| subTitle           | 弹窗副标题         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -           |
| useFull            | 是否开启全屏按钮   | `boolean`                                                            | `true`      |
| scroll             | 内容是否支持滚动   | `boolean`                                                            | `true`      |
| useScrollX         | 是否使用X轴滚动    | `boolean`                                                            | `false`     |
| titleAlign         | 标题对齐方式       | `'center'` `'left'` `'right'`                                        | `'left'`    |
| closeOnClickModal  | 是否点击蒙层关闭   | `boolean`                                                            | `true`      |
| closeOnPressEscape | 是否按ESC键关闭    | `boolean`                                                            | `true`      |
| padding            | 内边距方向         | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">`             | -           |

## ComponentEmits

| 字段              | 描述                       | 参数类型         |
| ----------------- | -------------------------- | ---------------- |
| update:modelValue | 当弹窗显示状态改变时触发   | `value: boolean` |
| closed            | 当弹窗关闭时触发           | `value: boolean` |

## ComponentSlots

| 插槽名       | 作用           |
| ------------ | -------------- |
| `'default'`  | 默认内容插槽   |
| `'header'`   | 头部插槽       |
| `'title'`    | 标题插槽       |
| `'subTitle'` | 副标题插槽     |
| `'footer'`   | 底部插槽       |
| `'footerLeft'`  | 底部左侧插槽 |
| `'footerRight'` | 底部右侧插槽 |
