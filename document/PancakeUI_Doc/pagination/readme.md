# Pagination 分页器

`pa-pagination` 用于展示分页导航，支持多种布局配置。

## 基础使用

<demo src="./base.vue"></demo>

## 带总数显示

<demo src="./with-total.vue"></demo>

## ComponentProps

| 属性名       | 描述               | 类型                                   | 默认值                                      |
| ------------ | ------------------ | -------------------------------------- | ------------------------------------------- |
| id           | 唯一标识           | `string`                               | -                                           |
| class        | 自定义类名         | `Array<string>` \| `string`            | -                                           |
| style        | 自定义样式         | `Record<string, string>`               | -                                           |
| currentPage  | 当前页码           | `number`                               | `1`                                         |
| pageSize     | 每页显示数量       | `number`                               | `10`                                        |
| total        | 总条数             | `number`                               | —                                           |
| pageSizes    | 每页数量选择器选项 | `Array<number>`                        | `[10, 20, 30, 40, 50, 100]`                 |
| pagerCount   | 页码按钮数量       | `number`                               | `3`                                         |
| background   | 是否添加背景色     | `boolean`                              | `false`                                     |
| layout       | 组件布局           | `string`                               | `'total, sizes, prev, pager, next, jumper'` |
| disabled     | 是否禁用           | `boolean`                              | `false`                                     |

## ComponentEmits

| 事件名            | 描述         | 回调参数              |
| ----------------- | ------------ | --------------------- |
| update:currentPage | 当前页码变化 | `page: number`        |
| update:pageSize    | 每页数量变化 | `size: number`        |
| size-change        | 每页数量变化 | `size: number`        |
| current-change     | 当前页变化   | `currentPage: number` |
| change-max-page    | 最大页数变化 | `maxPage: number`     |
| prev-click         | 点击上一页   | `currentPage: number` |
| next-click         | 点击下一页   | `currentPage: number` |
