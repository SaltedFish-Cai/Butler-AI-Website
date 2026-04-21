# Tabs 选项卡

常用的选项卡。

## 基础用法

基础样式展示，组件提供 2 种样式风格，可以使用 `styleMode` 属性切换风格，使用 `padding` 控制内边距。

<demo src="./base.vue" ></demo>

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

## `SaTabsProps`

| 属性名        | 描述         | 类型                                   | 默认值    |
| ------------- | ------------ | -------------------------------------- | --------- |
| modelValue    | 默认选中 tab | —                                      | —         |
| visibleMode   | 显示类型     | `display` `visible`                    | `visible` |
| mode          | 布局模式     | `default` `portrait` `slider` `sticky` | `default` |
| styleMode     | 样式模式     | `default` `card`                       | `card`    |
| align         | 对齐方式     | `edge` `default`                       | `default` |
| useHeaderLine | 表头下划线   | `boolean`                              | `false`   |
| useShadow     | 是否使用阴影 | `boolean`                              | `true`    |

## `SaTabsItemProps`

| 属性名     | 描述             | 类型               | 默认值  |
| ---------- | ---------------- | ------------------ | ------- |
| label      | 标签名           | `number` `string`  | —       |
| name       | 标签唯一名       | `number` `string`  | —       |
| scroll     | 是否可以滚动     | `boolean`          | `true`  |
| tips       | 提示文字         | `number` `string`  | —       |
| lazy       | 懒加载           | `boolean` `number` | `false` |
| useScrollX | 是否使用水平滚动 | `boolean`          | `false` |

## `SaTabsEvents`

| 字段        | 描述              | 类型                                           |
| ----------- | ----------------- | ---------------------------------------------- | ----------- |
| id          | 多表时唯一 ID     | `string`                                       | `undefined` |
| class       | 自定义类名        | `string`                                       | `undefined` |
| style       | 自定义样式        | `Record<string, string>`                       | `undefined` |
| tab-change  | 当 tab 切换时触发 | `function`                                     |
| padding     | 是否使用内边距    | `Array<top \| right \| left \| bottom \| all>` | `[]`        |
| useBorder   | 是否使用边框      | `boolean`                                      | `false`     |
| onTabChange | Tab 变更回调函数  | `({ name, index }) => void`                    | `undefined` |
