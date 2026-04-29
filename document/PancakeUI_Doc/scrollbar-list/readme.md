# Scrollbar List 滚动列表

`pa-scrollbar-list` 用于展示带有虚拟滚动和分页功能的列表组件。

## 基础使用

<demo src="./base.vue"></demo>

## ComponentProps

| 属性名         | 描述                 | 类型                                                     | 默认值      |
| -------------- | -------------------- | -------------------------------------------------------- | ----------- |
| id             | 组件唯一标识         | `string`                                                 | -           |
| class          | 自定义类名           | `Array<string>` \| `string`                              | -           |
| style          | 自定义样式           | `Record<string, string \| number>`                       | -           |
| styleMode      | 样式模式             | `"color"` \| `"default"`                                 | `"default"` |
| requestApi     | 请求表格数据接口     | `(params: any, id?: string) => Promise<any> \| any`      | -           |
| rowKey         | 行数据 Key           | `string`                                                 | `"id"`      |
| useShadow      | 是否使用阴影         | `boolean`                                                | `false`     |
| useBackTop     | 是否显示回到顶部按钮 | `boolean`                                                | `false`     |
| showPagination | 是否显示分页器       | `boolean`                                                | `true`      |
| padding        | 内边距方向           | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">` | -           |
| paddingWidth   | 内边距宽度           | `number`                                                 | `10`        |

## ComponentEmits

| 事件名              | 描述             | 回调函数                    |
| ------------------- | ---------------- | --------------------------- |
| intersecting        | 元素进入可见区域 | `(el: HTMLElement) => void` |
| directly-scroll-end | 滚动到底部       | `(data: any) => void`       |

## ComponentSlots

| 插槽名称     | 作用                                               |
| ------------ | -------------------------------------------------- |
| 'default'    | 列表行内容，可通过 `#default="{ row }"` 获取行数据 |
| 'empty'      | 空状态内容                                         |
| 'footer'     | 底部区域自定义内容                                 |
| 'footerLeft' | 底部左侧区域内容                                   |

## DefineExpose

| 方法名称     | 描述         | 参数                      |
| ------------ | ------------ | ------------------------- |
| refresh      | 刷新列表     | -                         |
| setScrollTop | 设置滚动位置 | `(value: number) => void` |
