# Transfer 穿梭框

`pa-transfer` 用于在两个列表之间进行数据的选择和移动。

## 基础使用

<demo src="./base.vue"></demo>

## 搜索功能

<demo src="./search.vue"></demo>

## Props

| 字段           | 描述               | 类型                                          | 默认值      |
| -------------- | ------------------ | --------------------------------------------- | ----------- |
| id             | 组件唯一标识       | `string | undefined`                          | `undefined` |
| class          | 自定义类名         | `string`                                      | `undefined` |
| style          | 自定义样式         | `Record<string, string>`                      | `undefined` |
| modelValue     | 双向绑定值         | `Array<boolean | number | string>`          | `undefined` |
| displayValue   | 纯展示数据         | `string`                                      | `undefined` |
| exOptions      | 外置数据选项       | `PaOptionType.SelectList`                     | —          |
| optionKey      | 选项 Key           | `string`                                      | `"value"`  |
| placeholder    | 占位符             | `string`                                      | `"请选择"` |
| disabled       | 是否禁用           | `boolean`                                     | `false`    |
| display        | 纯展示模式         | `boolean`                                     | `false`    |
| useSearch      | 是否使用搜索       | `boolean`                                     | `false`    |
| contrastData   | 对比数据           | `Array<number | string> | number | string` | `undefined` |
| alwaysContrast | 是否显示对比数据   | `boolean`                                     | `false`    |
| onChange       | 数据变化回调       | `({ value, oldValue }) => void`              | `undefined` |
