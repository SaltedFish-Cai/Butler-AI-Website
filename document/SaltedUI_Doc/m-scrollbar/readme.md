# Scrollbar 滚动条

常用滚动条组件，用于在内容超出容器时显示滚动条。

## `MScrollbarV2Type`

| 字段               | 类型                                                     | 默认值      | 描述                                                     |
| ------------------ | -------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| useShadow          | `boolean`                                                | `true`      | 是否使用阴影 (styleMode='color'时：默认为 false)         |
| useBackTop         | `boolean`                                                | `true`      | 是否显示回到顶部按钮 (styleMode='color'时：默认为 false) |
| useScrollY         | `boolean`                                                | `true`      | 是否开启垂直滚动条                                       |
| useScrollX         | `boolean`                                                | `true`      | 是否开启水平滚动条                                       |
| showThumb          | `boolean`                                                | `true`      | 是否显示滚动条                                           |
| styleMode          | `color` `default`                                        | `default`   | 滚动条样式模式                                           |
| intersectClassName | `string`                                                 | `undefined` | 当设置该值时，会监听该元素的滚动事件                     |
| padding            | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | `0`         | 滚动条与内容的间距                                       |
| paddingBorder      | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | `0`         | 滚动条边框与内容的间距                                   |
| border             | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | `0`         | 滚动条边框宽度                                           |
| parentBoxRef       | `Ref<HTMLElement>`                                       | `undefined` | 滚动条父元素的引用                                       |

## `MCascaderV2Events`

| 字段                | 类型       | 描述                                                                   |
| ------------------- | ---------- | ---------------------------------------------------------------------- |
| renderEnd           | `function` | 当滚动条渲染结束时触发                                                 |
| scroll              | `function` | 当滚动条滚动时触发，`存在`节流延迟                                     |
| scrollEnd           | `function` | 当滚动条滚动结束时触发，`存在`节流延迟 ，返回 `true` or `false`        |
| scrollStart         | `function` | 当滚动条滚动开始时触发 ，`存在`节流延迟 ，返回 `true` or `false`       |
| scrollLeft          | `function` | 当滚动条滚动到左侧时触发，`存在`节流延迟 ，返回 `true` or `false`      |
| scrollRight         | `function` | 当滚动条滚动到右侧时触发，`存在`节流延迟 ，返回 `true` or `false`      |
| intersecting        | `function` | 当滚动条与元素相交时触发 ，返回相交元素的信息                          |
| directlyScroll      | `function` | 当滚动条直接滚动时触发，`不存在`节流延迟                               |
| directlyScrollEnd   | `function` | 当滚动条直接滚动结束时触发，`不存在`节流延迟，返回 `true` or `false`   |
| directlyScrollStart | `function` | 当滚动条直接滚动开始时触发，`不存在`节流延迟，返回 `true` or `false`   |
| directlyScrollLeft  | `function` | 当滚动条直接滚动到左侧时触发，`不存在`节流延迟，返回 `true` or `false` |
| directlyScrollRight | `function` | 当滚动条直接滚动到右侧时触发，`不存在`节流延迟，返回 `true` or `false` |

## 基础样式展示

包含 padding、border 样式展示。

<demo src="./base.vue" ></demo>

## Color 模式样式展示

此样式模式下部分功能默认值为 `false`

<demo src="./color.vue" ></demo>

## 监听该元素的滚动

此功能可以快速监听滚动条与元素的相交事件，当滚动条与元素相交时，会触发 `intersecting` 事件。

<demo src="./intersecting.vue" ></demo>
