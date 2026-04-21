# Scrollbar 滚动条

常用滚动条组件，用于在内容超出容器时显示滚动条。

## 基础样式展示

包含 padding、border 样式展示。

<demo src="./base.vue" ></demo>

## Color 模式样式展示

此样式模式下部分功能默认值为 `false`

<demo src="./color.vue" ></demo>

## 监听该元素的滚动

此功能可以快速监听滚动条与元素的相交事件，当滚动条与元素相交时，会触发 `intersecting` 事件。

<demo src="./intersecting.vue" ></demo>

## `SaScrollBarType`

| 字段               | 描述                                                     | 类型                                                     | 默认值      |
| ------------------ | -------------------------------------------------------- | -------------------------------------------------------- | ----------- |
| useShadow          | 是否使用阴影 (styleMode='color'时：默认为 false)         | `boolean`                                                | `true`      |
| useBackTop         | 是否显示回到顶部按钮 (styleMode='color'时：默认为 false) | `boolean`                                                | `true`      |
| useScrollY         | 是否开启垂直滚动条                                       | `boolean`                                                | `true`      |
| useScrollX         | 是否开启水平滚动条                                       | `boolean`                                                | `true`      |
| showThumb          | 是否显示滚动条                                           | `boolean`                                                | `true`      |
| styleMode          | 滚动条样式模式                                           | `color` `default`                                        | `default`   |
| intersectClassName | 当设置该值时，会监听该元素的滚动事件                     | `string`                                                 | `undefined` |
| padding            | 滚动条与内容的间距                                       | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | `0`         |
| paddingBorder      | 滚动条边框与内容的间距                                   | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | `0`         |
| border             | 滚动条边框宽度                                           | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | `0`         |
| parentBoxRef       | 滚动条父元素的引用                                       | `Ref<HTMLElement>`                                       | `undefined` |

## `SaCascaderEvents`

| 字段                | 描述                                                                   | 类型       |
| ------------------- | ---------------------------------------------------------------------- | ---------- |
| renderEnd           | 当滚动条渲染结束时触发                                                 | `function` |
| scroll              | 当滚动条滚动时触发，`存在`节流延迟                                     | `function` |
| scrollEnd           | 当滚动条滚动结束时触发，`存在`节流延迟 ，返回 `true` or `false`        | `function` |
| scrollStart         | 当滚动条滚动开始时触发 ，`存在`节流延迟 ，返回 `true` or `false`       | `function` |
| scrollLeft          | 当滚动条滚动到左侧时触发，`存在`节流延迟 ，返回 `true` or `false`      | `function` |
| scrollRight         | 当滚动条滚动到右侧时触发，`存在`节流延迟 ，返回 `true` or `false`      | `function` |
| intersecting        | 当滚动条与元素相交时触发 ，返回相交元素的信息                          | `function` |
| directlyScroll      | 当滚动条直接滚动时触发，`不存在`节流延迟                               | `function` |
| directlyScrollEnd   | 当滚动条直接滚动结束时触发，`不存在`节流延迟，返回 `true` or `false`   | `function` |
| directlyScrollStart | 当滚动条直接滚动开始时触发，`不存在`节流延迟，返回 `true` or `false`   | `function` |
| directlyScrollLeft  | 当滚动条直接滚动到左侧时触发，`不存在`节流延迟，返回 `true` or `false` | `function` |
| directlyScrollRight | 当滚动条直接滚动到右侧时触发，`不存在`节流延迟，返回 `true` or `false` | `function` |

## Props

| 属性名                       | 描述                 | 类型                            | 默认值      |
| ---------------------------- | -------------------- | ------------------------------- | ----------- |
| class                        | 自定义类名           | `string`                        | `undefined` |
| style                        | 自定义样式           | `Record<string, string>`        | `undefined` |
| contentStyle                 | 自定义内容样式       | `Record<string, string>`        | `undefined` |
| useShadow                    | 是否使用阴影         | `boolean`                       | `true`      |
| useBackTop                   | 是否显示回到顶部按钮 | `boolean`                       | `true`      |
| showThumb                    | 是否显示滚动条       | `boolean`                       | `true`      |
| styleMode                    | 样式模式             | `color` `default`               | `default`   |
| paddingWidth                 | 滚动条宽度           | `number \| string`              | `10`        |
| intersectClassName           | 监听元素类名         | `string`                        | `undefined` |
| padding                      | 是否使用内边距       | `Array`                         | `[]`        |
| border                       | 是否使用边框         | `Array`                         | `[]`        |
| paddingBorder                | 是否使用内边距边框   | `Array`                         | `[]`        |
| defaultScrollVerticalThumb   | 默认垂直滚动条位置   | `number`                        | `0`         |
| defaultScrollHorizontalThumb | 默认水平滚动条位置   | `number`                        | `0`         |
| useClosePopover              | 是否点击外部关闭     | `boolean`                       | `true`      |
| parentBoxRef                 | 父元素引用           | `Ref<HTMLElement \| undefined>` | `undefined` |
| useScrollY                   | 是否开启垂直滚动条   | `boolean`                       | `true`      |
| useScrollX                   | 是否开启水平滚动条   | `boolean`                       | `true`      |
