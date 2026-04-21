# Scrollbar List 滚动列表

`pa-scrollbar-list` 用于展示带有虚拟滚动和分页功能的列表组件。

## 基础使用

<demo src="./base.vue"></demo>

## Props

| 字段            | 描述                   | 类型                                       | 默认值      |
| --------------- | ---------------------- | ------------------------------------------ | ----------- |
| class           | 自定义类名             | `string`                                   | `undefined` |
| style           | 自定义样式             | `Record<string, string>`                   | `undefined` |
| styleMode       | 样式模式               | `"color" | "default"`            | `"default"` |
| requestApi      | 请求表格数据接口       | `(params, id?) => Promise<any> | any`    | —           |
| rowKey          | 行数据 Key             | `string`                                   | `"id"`      |
| useShadow       | 是否使用阴影           | `boolean`                                  | `false`     |
| useBackTop      | 是否显示回到顶部按钮   | `boolean`                                  | `false`     |
| showPagination  | 是否显示分页器         | `boolean`                                  | `true`      |
| padding         | 内边距方向             | `Array<"all" | "bottom" | "left" | "right" | "top">` | `undefined` |
| paddingWidth    | 内边距宽度             | `number`                                   | `10`        |

## DefineExpose

| 方法名称 | 描述         | 参数     |
| -------- | ------------ | -------- |
| refresh  | 刷新列表     | —        |
| setScrollTop | 设置滚动位置 | `(value: number) => void` |
