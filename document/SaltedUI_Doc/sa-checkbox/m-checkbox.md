# Checkbox 多选框

:::warning 注意
`sa-checkbox` 可独立使用，在 `sa-form/sa-table` 中可使用时，需配置 `prop` 字段。
:::

## `SaCheckboxType`

| 字段           | 类型                                 | 默认值  | 描述                 |
| -------------- | ------------------------------------ | ------- | -------------------- |
| modelValue     | `Array<boolean \| number \| string>` | —       | 绑定值               |
| disabled       | `boolean`                            | —       | 禁用状态             |
| display        | `boolean`                            | `false` | 纯展示               |
| exOptions      | `MOptionV2Type.SelectList`           | —       | 选项                 |
| contrastData   | `string` `number` `boolean`          | —       | 对比用原数据         |
| alwaysContrast | `boolean`                            | `false` | 是否总是显示对不数据 |

## `SaCheckboxItemType`

| 字段            | 类型                        | 默认值  | 描述     |
| --------------- | --------------------------- | ------- | -------- |
| modelValue      | `string` `number` `boolean` | —       | 绑定值   |
| label           | `string`                    | —       | 选项名   |
| value           | `string` `number` `boolean` | —       | 选项值   |
| isChecked       | `boolean`                   | `false` | 是否选中 |
| isIndeterminate | `boolean`                   | `false` | 是否半选 |
| disabled        | `boolean`                   | —       | 禁用状态 |

## `SaRadioEvents`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## `MOptionV2Type.SelectList(Array<SaSelectOptionsType>)`

| 字段     | 类型                                              | 默认值  | 描述     |
| -------- | ------------------------------------------------- | ------- | -------- |
| label    | `string`                                          |         | 选项名   |
| value    | `string` `number` `boolean`                       |         | 选项值   |
| children | `Array<SaSelectOptionsType>`                     |         | 子选项   |
| disabled | `boolean`                                         | `false` | 禁用状态 |
| base     | `any`                                             |         | 默认数据 |
| tagStyle | `{bgColor?: string, textColor?: string}` `string` |         | 标签样式 |

## 组件功能展示

```html
<sa-title :padding="['bottom']">基础使用</sa-title>
<sa-checkbox v-model="value1" :exOptions="exOptions"></sa-checkbox>

<sa-title :padding="['bottom']">Display</sa-title>
<sa-checkbox v-model="value1" :exOptions="exOptions" display></sa-checkbox>

<sa-title :padding="['bottom']">单组件使用</sa-title>
<sa-checkbox-item v-model="value2" label="选项1" value="1"></sa-checkbox-item>
<sa-checkbox-item v-model="value2" label="选项2" value="2" disabled></sa-checkbox-item>
```

```typescript
import { ref } from "vue";
const value1 = ref([1]);
const value2 = ref(1);

const exOptions = ref([
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 }
]);
```
