# Col 栅格列

`pa-col` 用于栅格布局中的列组件，需要配合 `pa-row` 使用。

## 基础用法

配合 `pa-row` 实现栅格布局。

## ComponentProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占据的列数（共24列） | `number` | - |
| offset | 栅格左侧的间隔格数 | `number` | `0` |
| xs | `<576px` 响应式配置 | `Responsive \| number` | - |
| sm | `≥576px` 响应式配置 | `Responsive \| number` | - |
| md | `≥768px` 响应式配置 | `Responsive \| number` | - |
| lg | `≥992px` 响应式配置 | `Responsive \| number` | - |
| xl | `≥1200px` 响应式配置 | `Responsive \| number` | - |
| class | 自定义类名 | `Array<string> \| string` | - |
| style | 自定义样式 | `Record<string, string \| number>` | - |
| id | 元素 id | `string` | - |

## ComponentEmits

无

## ComponentSlots

| 插槽名 | 说明 |
| --- | --- |
| default | 列内容 |

## 类型定义

### BreakPoint

```typescript
type BreakPoint = "lg" | "md" | "sm" | "xl" | "xs";
```

### Responsive

```typescript
type Responsive = {
  span?: number;
  offset?: number;
};
```
