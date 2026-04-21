# Empty 空状态

`pa-empty` 用于展示空数据状态时的占位提示。

## 基础使用

<demo src="./base.vue"></demo>

## Props

| 字段    | 描述         | 类型                      | 默认值       |
| ------- | ------------ | ------------------------- | ------------ |
| id      | 组件唯一标识 | `string \| undefined`     | `undefined`  |
| class   | 自定义类名   | `Array<string> \| string` | `undefined`  |
| style   | 自定义样式   | `Record<string, string>`  | `undefined`  |
| message | 提示信息     | `string`                  | `'暂无数据'` |
| icon    | 图标名称     | `string`                  | `'dakai'`    |
