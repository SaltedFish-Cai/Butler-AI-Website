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

## ComponentProps

| 属性名                       | 描述                 | 类型                                                     | 默认值      |
| ---------------------------- | -------------------- | -------------------------------------------------------- | ----------- |
| id                           | 唯一标识             | `string`                                                 | -           |
| class                        | 自定义类名           | `Array<string>` `string`                                 | -           |
| style                        | 自定义样式           | `Record<string, string>`                                 | -           |
| useShadow                    | 是否使用阴影         | `boolean`                                                | `true`      |
| useBackTop                   | 是否显示回到顶部按钮 | `boolean`                                                | `true`      |
| showThumb                    | 是否显示滚动条       | `boolean`                                                | `true`      |
| styleMode                    | 样式模式             | `'color'` `'default'`                                    | `'default'` |
| paddingWidth                 | 滚动条宽度           | `number` `string`                                        | `10`        |
| defaultScrollVerticalThumb   | 默认垂直滚动条位置   | `number`                                                 | `0`         |
| defaultScrollHorizontalThumb | 默认水平滚动条位置   | `number`                                                 | `0`         |
| useClosePopover              | 是否点击外部关闭     | `boolean`                                                | `true`      |
| useScrollY                   | 是否开启垂直滚动条   | `boolean`                                                | `true`      |
| useScrollX                   | 是否开启水平滚动条   | `boolean`                                                | `true`      |
| contentStyle                 | 自定义内容样式       | `Record<string, string>`                                 | -           |
| intersectClassName           | 监听元素类名         | `string`                                                 | -           |
| padding                      | 是否使用内边距       | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | -           |
| border                       | 是否使用边框         | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | -           |
| paddingBorder                | 是否使用内边距边框   | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | -           |
| parentBoxRef                 | 父元素引用           | `Ref<HTMLElement \| undefined>`                          | -           |

## ComponentEmits

| 字段                | 描述                                                 | 参数类型                      |
| ------------------- | ---------------------------------------------------- | ----------------------------- |
| renderEnd           | 当滚动条渲染结束时触发                               | `data: RenderEndData`         |
| bodySizeXChange     | 当滚动条水平尺寸变化时触发                           | -                             |
| bodySizeYChange     | 当滚动条垂直尺寸变化时触发                           | -                             |
| scroll              | 当滚动条滚动时触发，`存在`节流延迟                   | `data: ScrollDataType`        |
| scrollEnd           | 当滚动条滚动结束时触发，`存在`节流延迟               | `value: boolean`              |
| scrollStart         | 当滚动条滚动开始时触发，`存在`节流延迟               | `value: boolean`              |
| scrollLeft          | 当滚动条滚动到左侧时触发，`存在`节流延迟             | `value: boolean`              |
| scrollRight         | 当滚动条滚动到右侧时触发，`存在`节流延迟             | `value: boolean`              |
| intersecting        | 当滚动条与元素相交时触发                             | `el: Element`                 |
| directlyScroll      | 当滚动条直接滚动时触发，`不存在`节流延迟             | `data: DirectlyScrollData`    |
| scrollChildChange   | 当滚动条子元素变化时触发                             | `data: ScrollChildChangeData` |
| directlyScrollEnd   | 当滚动条直接滚动结束时触发，`不存在`节流延迟         | `value: boolean`              |
| directlyScrollStart | 当滚动条直接滚动开始时触发，`不存在`节流延迟         | `value: boolean`              |
| directlyScrollLeft  | 当滚动条直接滚动到左侧时触发，`不存在`节流延迟       | `value: boolean`              |
| directlyScrollRight | 当滚动条直接滚动到右侧时触发，`不存在`节流延迟       | `value: boolean`              |

## ComponentSlots

| 插槽名      | 作用         |
| ----------- | ------------ |
| `'default'` | 默认内容插槽 |
| `'footer'`  | 底部插槽     |

## ScrollDataType

| 属性名     | 描述             | 类型     |
| ---------- | ---------------- | -------- |
| scrollTop  | 垂直滚动位置     | `number` |
| scrollLeft | 水平滚动位置     | `number` |

## RenderEndData

| 属性名     | 描述         | 类型     |
| ---------- | ------------ | -------- |
| bodyWidth  | 内容宽度     | `number` |
| bodyHeight | 内容高度     | `number` |

## DirectlyScrollData

| 属性名           | 描述             | 类型     |
| ---------------- | ---------------- | -------- |
| scrollTop        | 垂直滚动位置     | `number` |
| scrollLeft       | 水平滚动位置     | `number` |
| scrollDirectionY | 垂直滚动方向     | `number` |
| scrollDirectionX | 水平滚动方向     | `number` |

## ScrollChildChangeData

| 属性名      | 描述             | 类型      |
| ----------- | ---------------- | --------- |
| bodyWidth   | 内容宽度         | `number`  |
| bodyHeight  | 内容高度         | `number`  |
| useScrollX  | 是否启用水平滚动 | `boolean` |
| useScrollY  | 是否启用垂直滚动 | `boolean` |
