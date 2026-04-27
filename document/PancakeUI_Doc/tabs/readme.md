# pa-tabs 选项卡

常用的选项卡组件，支持多种布局模式、样式风格和自定义插槽。

## 基础用法

基础样式展示，组件提供 2 种样式风格，可以使用 `styleMode` 属性切换风格，使用 `padding` 控制内边距。

<demo src="./base.vue" ></demo>

## 横向用法

使用 `portrait` 属性切换为横向布局。

<demo src="./portrait.vue" ></demo>

## 混合使用

混合使用展示

<demo src="./group.vue" ></demo>

## 对齐方式展示

对齐方式展示

<demo src="./align.vue" ></demo>

## 自定义标签

使用 `插槽` 对选项卡标签进行自定义内容修改。

```html
<pa-tabs v-model="activeName">
  <pa-tabs-item label="第一页" name="page1">
    <template #label>
      <m-icon name="applet_line" />
      <span>Page1</span>
    </template>
    page1
  </pa-tabs-item>
</pa-tabs>
```

<demo src="./slot.vue" ></demo>

## 滚动模式（锚点）

当设置 `slider` 模式，可实现全展示与 `锚点` 功能

```html
<pa-tabs v-model="state.activeName" slider>
  <pa-tabs-item label="User" name="one"></pa-tabs-item>
</pa-tabs>
```

<demo src="./slider.vue" ></demo>

## 内页是否可滚动

当设置 tabs 高度时，内部元素 `pa-tabs-item` 高度会被拦截，可添加 `scroll` 是否滚动属性

```html
<pa-tabs v-model="state.activeName">
  <pa-tabs-item label="User" name="one" scroll></pa-tabs-item>
</pa-tabs>
```

<demo src="./scroll.vue" ></demo>

## ComponentProps

| 属性名        | 描述                 | 类型                                                    | 默认值      |
| ------------- | -------------------- | ------------------------------------------------------- | ----------- |
| id            | 组件唯一标识         | `string`                                                | `undefined` |
| class         | 自定义类名           | `Array<string> \| string`                               | `undefined` |
| style         | 自定义样式           | `Record<string, string>`                                | `undefined` |
| modelValue    | 双向绑定值           | `string`                                                | `undefined` |
| visibleMode   | 隐藏 tabs 方式       | `'display' \| 'visible'`                                | `visible`   |
| mode          | 布局模式             | `'default' \| 'portrait' \| 'slider' \| 'sticky'`      | `default`   |
| styleMode     | 样式模式             | `'border-card' \| 'card' \| 'default'`                  | `default`   |
| align         | 对齐方式             | `'default' \| 'edge'`                                   | `default`   |
| useHeaderLine | 是否使用底线         | `boolean`                                               | `false`     |
| useShadow     | 是否使用滚动阴影     | `boolean`                                               | `true`      |

## TabsItemProps

| 属性名     | 描述             | 类型                            | 默认值      |
| ---------- | ---------------- | ------------------------------- | ----------- |
| label      | 标签页显示的名称 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) | string | undefined | `undefined` |
| name       | 标签页唯一标识   | `number | string`              | `undefined` |
| scroll     | 是否开启滚动     | `boolean`                       | `true`      |
| tips       | 提示信息         | `string`                        | `undefined` |
| lazy       | 懒加载           | `boolean \| number`             | `1000`      |
| padding    | 内边距方向       | `Array<TabsPadding>`            | `[]`        |
| useScrollX | 是否使用水平滚动 | `boolean`                       | `false`     |
| useBorder  | 是否使用边框     | `boolean`                       | `false`     |

## ComponentEmits

| 事件名              | 描述             | 回调函数                                      |
| ------------------- | ---------------- | --------------------------------------------- |
| update:modelValue   | 更新绑定值事件   | `(value: string) => void`                     |
| tabChange           | 标签页切换事件   | `(name: string, index: number) => void`       |

## ComponentSlots（pa-tabs）

| 插槽名      | 作用           |
| ----------- | -------------- |
| default     | 默认内容插槽   |
| HeaderLeft  | 头部左侧插槽   |
| HeaderRight | 头部右侧插槽   |
| afterLabel  | 标签后插槽     |
| footer      | 底部插槽       |

## ComponentSlots（pa-tabs-item）

| 插槽名  | 作用           |
| ------- | -------------- |
| default | 默认内容插槽   |
| before  | 内容前插槽     |
| tips    | 提示信息插槽   |
| footer  | 底部插槽       |

## 非标准类型说明

| 类型名称 | 说明 | 定义位置 |
| -------- | ---- | -------- |
| `ComponentTabsMode` | tabs 布局模式 | [types.d.ts](/document/PancakeUI_Doc/types#componenttabsmode) |
| `ComponentTabsStyleMode` | tabs 样式模式 | [types.d.ts](/document/PancakeUI_Doc/types#componenttabsstylemode) |
| `ComponentTabsAlign` | tabs 对齐方式 | [types.d.ts](/document/PancakeUI_Doc/types#componenttabsalign) |
| `ComponentVisibleMode` | 组件隐藏方式 | [types.d.ts](/document/PancakeUI_Doc/types#componentvisiblemode) |
| `ComponentPadding` | 组件内边距方向 | [types.d.ts](/document/PancakeUI_Doc/types#componentpadding) |
