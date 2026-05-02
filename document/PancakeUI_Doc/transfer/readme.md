# Transfer 穿梭框

`pa-transfer` 用于在两个列表之间进行数据的选择和移动。

## 基础使用

<demo src="./base.vue"></demo>

## 搜索功能

<demo src="./search.vue"></demo>

## ComponentProps

| 属性名         | 描述             | 类型                                                                                | 默认值     |
| -------------- | ---------------- | ----------------------------------------------------------------------------------- | ---------- |
| id             | 组件唯一标识     | `string`                                                                            | -          |
| class          | 自定义类名       | `Array<string>` \| `string`                                                         | -          |
| style          | 自定义样式       | `Record<string, string \| number>`                                                  | -          |
| modelValue     | 双向绑定值       | `Array<boolean \| number \| string>`                                                | -          |
| displayValue   | 纯展示数据       | `string`                                                                            | -          |
| exOptions      | 外置数据选项     | [`PaOptionType.SelectList`](/document/PancakeUI_Doc/options#paoptiontypeselectlist) | -          |
| optionKey      | 选项 Key         | `string`                                                                            | `"value"`  |
| placeholder    | 占位符           | `string`                                                                            | `"请选择"` |
| disabled       | 是否禁用         | `boolean`                                                                           | `false`    |
| display        | 纯展示模式       | `boolean`                                                                           | `false`    |
| useSearch      | 是否使用搜索     | `boolean`                                                                           | `false`    |
| contrastData   | 对比数据         | `Array<number \| string>` \| `number` \| `string`                                   | -          |
| alwaysContrast | 是否显示对比数据 | `boolean`                                                                           | `false`    |

## ComponentEmits

| 事件名            | 描述           | 回调函数                                                                                                         |
| ----------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| update:modelValue | 双向绑定更新   | `(value: Array<boolean \| number \| string>) => void`                                                            |
| change            | 数据变化时触发 | `(payload: { value: Array<boolean \| number \| string>; oldValue: Array<boolean \| number \| string> }) => void` |
| remoteMethod      | 远程搜索方法   | `(query: string) => void`                                                                                        |

## ComponentSlots

| 插槽名称     | 作用               |
| ------------ | ------------------ |
| 'default'    | 默认内容           |
| 'exDisplay'  | 展示模式自定义内容 |
| 'exContrast' | 对比数据自定义内容 |
