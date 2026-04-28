# Col 栅格列

`pa-col` 用于栅格布局中的列组件，需要配合 `pa-row` 使用。

## 基础用法

配合 `pa-row` 实现栅格布局。

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占据的列数（共24列） | `number` | - |
| offset | 栅格左侧的间隔格数 | `number` | `0` |
| xs | `<576px` 响应式配置 | `Responsive \| number` | - |
| sm | `≥576px` 响应式配置 | `Responsive \| number` | - |
| md | `≥768px` 响应式配置 | `Responsive \| number` | - |
| lg | `≥992px` 响应式配置 | `Responsive \| number` | - |
| xl | `≥1200px` 响应式配置 | `Responsive \| number` | - |

## Responsive 类型

```typescript
type Responsive = {
  span?: number;
  offset?: number;
};
```
