# Tabs 选项卡

常用的选项卡。

## `MTabsV2Props`

| 属性名        | 类型                                   | 默认值    | 描述         |
| ------------- | -------------------------------------- | --------- | ------------ |
| modelValue    | —                                      | —         | 默认选中 tab |
| visibleMode   | `display` `visible`                    | `visible` | 显示类型     |
| mode          | `default` `portrait` `slider` `sticky` | `default` | 布局模式     |
| styleMode     | `default` `card`                       | `card`    | 样式模式     |
| align         | `edge` `default`                       | `default` | 对齐方式     |
| useHeaderLine | `boolean`                              | `false`   | 表头下划线   |
| useShadow     | `boolean`                              | `true`    | 是否使用阴影 |

## `MTabsV2ItemProps`

| 属性名     | 类型               | 默认值  | 描述             |
| ---------- | ------------------ | ------- | ---------------- |
| label      | `number` `string`  | —       | 标签名           |
| name       | `number` `string`  | —       | 标签唯一名       |
| scroll     | `boolean`          | `true`  | 是否可以滚动     |
| tips       | `number` `string`  | —       | 提示文字         |
| lazy       | `boolean` `number` | `false` | 懒加载           |
| useScrollX | `boolean`          | `false` | 是否使用水平滚动 |

## `MTabsV2Events`

| 字段       | 类型       | 描述              |
| ---------- | ---------- | ----------------- |
| tab-change | `function` | 当 tab 切换时触发 |

## 基础用法

基础样式展示，使用 `padding` 控制内边距

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
<m-tabs-v2 v-model="activeName">
  <m-tabs-v2-item label="第一页" name="page1">
    <template #label>
      <m-icon name="applet_line" />
      <span>Page1</span>
    </template>
    page1
  </m-tabs-v2-item>
</m-tabs-v2>
```

<demo src="./slot.vue" ></demo>

## 滚动模式（锚点）

当设置 `slider` 模式，可实现全展示与 `锚点` 功能

```html
<m-tabs-v2 v-model="state.activeName" slider>
  <m-tabs-v2-item label="User" name="one"></m-tabs-v2-item>
</m-tabs-v2>
```

<demo src="./slider.vue" ></demo>

## 内页是否可滚动

当设置 tabs 高度时，内部元素 `m-tabs-v2-item` 高度会被拦截，可添加 `scroll` 是否滚动属性

```html
<m-tabs-v2 v-model="state.activeName">
  <m-tabs-v2-item label="User" name="one" scroll></m-tabs-v2-item>
</m-tabs-v2>
```

<demo src="./scroll.vue" ></demo>
