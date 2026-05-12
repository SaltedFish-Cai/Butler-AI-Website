# Line 分割线

`pa-line` 用于在内容区域添加装饰性分割线，支持宽度、高度、颜色和内边距自定义。

## 基础使用

默认分割线样式，占满容器宽度，可在标签内添加内容。

<demo src="./base.vue">
</demo>

## 自定义样式

通过 `width`、`height`、`border-color` 属性自定义分割线样式。

<demo src="./custom.vue">
</demo>

## 内边距设置

使用 `padding` 属性控制分割线的内边距，数组格式依次为 `[上, 右, 下, 左]`。

<demo src="./padding.vue">
</demo>

## 边框样式

通过 `border-style` 属性自定义分割线的边框样式。

<demo src="./style.vue">
</demo>

## ComponentProps

| 属性名       | 描述       | 类型                                                                                                      | 默认值    |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------- | --------- |
| id           | 唯一标识   | `string`                                                                                                  | -         |
| class        | 自定义类名 | `Array<string>` `string`                                                                                  | -         |
| style        | 自定义样式 | `Record<string, string>`                                                                                  | -         |
| padding      | 内边距     | `Array<number \| string>`                                                                                 | -         |
| width        | 宽度       | `string`                                                                                                  | `'100%'`  |
| height       | 高度       | `string`                                                                                                  | `'2px'`   |
| border-color | 颜色       | `string`                                                                                                  | -         |
| border-style | 边框样式   | `'dashed'` \| `'dotted'` \| `'double'` \| `'groove'` \| `'inset'` \| `'outset'` \| `'ridge'` \| `'solid'` | `'solid'` |

## ComponentSlots

| 插槽名称  | 描述     |
| --------- | -------- |
| 'default' | 线条内容 |
