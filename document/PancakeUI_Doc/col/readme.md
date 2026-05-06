# Col 栅格列

`pa-col` 用于栅格布局中的列组件，需要配合 `pa-row` 使用。

## 基础用法

配合 `pa-row` 实现栅格布局，默认使用 `pa-row` 组件的 `gutter` 属性作为栅格间隔，或者通过 `gutter` 参数自定义栅格间隔。

<demo src="./base.vue">
</demo>

## 自适应布局

使用 `xs`、`sm`、`md`、`lg`、`xl` 参数自定义栅格布局。

<demo src="./auto.vue">
</demo>

## ComponentProps

| 属性名 | 描述                         | 类型                                 | 默认值 |
| ------ | ---------------------------- | ------------------------------------ | ------ |
| id     | 唯一标识                     | `string`                             | -      |
| class  | 自定义类名                   | `Array<string>` `string`             | -      |
| style  | 自定义样式                   | `Record<string, number` `string>`    | -      |
| gutter | 栅格间隔，覆盖 Row 的 gutter | `number` `string`                    | -      |
| span   | 栅格占据的列数               | `number`                             | -      |
| offset | 栅格左侧的间隔格数           | `number`                             | `0`    |
| xs     | <576px 响应式配置            | [`Responsive`](#responsive) `number` | -      |
| sm     | ≥576px 响应式配置            | [`Responsive`](#responsive) `number` | -      |
| md     | ≥768px 响应式配置            | [`Responsive`](#responsive) `number` | -      |
| lg     | ≥992px 响应式配置            | [`Responsive`](#responsive) `number` | -      |
| xl     | ≥1200px 响应式配置           | [`Responsive`](#responsive) `number` | -      |

## ComponentEmits

无

## ComponentSlots

| 插槽名称  | 描述   |
| --------- | ------ |
| 'default' | 列内容 |

## BreakPoint

| 类型值 | 说明             |
| ------ | ---------------- |
| `'lg'` | 大屏幕 ≥992px    |
| `'md'` | 中等屏幕 ≥768px  |
| `'sm'` | 小屏幕 ≥576px    |
| `'xl'` | 超大屏幕 ≥1200px |
| `'xs'` | 超小屏幕 <576px  |

## Responsive

| 属性名 | 描述               | 类型     | 默认值 |
| ------ | ------------------ | -------- | ------ |
| span   | 栅格占据的列数     | `number` | -      |
| offset | 栅格左侧的间隔格数 | `number` | -      |
