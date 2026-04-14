# Checkbox 多选框

:::warning 注意
`m-checkbox-v2` 可独立使用，在 `m-form-v2/m-table-v2` 中可使用时，需配置 `prop` 字段。
:::

## `MCheckboxV2Type`

| 字段           | 类型                                 | 默认值  | 描述                 |
| -------------- | ------------------------------------ | ------- | -------------------- |
| modelValue     | `Array<boolean \| number \| string>` | —       | 绑定值               |
| disabled       | `boolean`                            | —       | 禁用状态             |
| display        | `boolean`                            | `false` | 纯展示               |
| exOptions      | `MOptionV2Type.SelectList`           | —       | 选项                 |
| contrastData   | `string` `number` `boolean`          | —       | 对比用原数据         |
| alwaysContrast | `boolean`                            | `false` | 是否总是显示对不数据 |

## `MCheckboxV2ItemType`

| 字段            | 类型                        | 默认值  | 描述     |
| --------------- | --------------------------- | ------- | -------- |
| modelValue      | `string` `number` `boolean` | —       | 绑定值   |
| label           | `string`                    | —       | 选项名   |
| value           | `string` `number` `boolean` | —       | 选项值   |
| isChecked       | `boolean`                   | `false` | 是否选中 |
| isIndeterminate | `boolean`                   | `false` | 是否半选 |
| disabled        | `boolean`                   | —       | 禁用状态 |

## `MRadioV2Events`

| 字段   | 类型       | 描述           |
| ------ | ---------- | -------------- |
| change | `function` | 当值改变时触发 |

## `MOptionV2Type.SelectList(Array<MSelectV2OptionsType>)`

| 字段     | 类型                                              | 默认值  | 描述     |
| -------- | ------------------------------------------------- | ------- | -------- |
| label    | `string`                                          |         | 选项名   |
| value    | `string` `number` `boolean`                       |         | 选项值   |
| children | `Array<MSelectV2OptionsType>`                     |         | 子选项   |
| disabled | `boolean`                                         | `false` | 禁用状态 |
| base     | `any`                                             |         | 默认数据 |
| tagStyle | `{bgColor?: string, textColor?: string}` `string` |         | 标签样式 |

## 组件功能展示

```html
<m-title-v2 :padding="['bottom']">基础使用</m-title-v2>
<m-checkbox-v2 v-model="value1" :exOptions="exOptions"></m-checkbox-v2>

<m-title-v2 :padding="['bottom']">Display</m-title-v2>
<m-checkbox-v2 v-model="value1" :exOptions="exOptions" display></m-checkbox-v2>

<m-title-v2 :padding="['bottom']">单组件使用</m-title-v2>
<m-checkbox-v2-item v-model="value2" label="选项1" value="1"></m-checkbox-v2-item>
<m-checkbox-v2-item v-model="value2" label="选项2" value="2" disabled></m-checkbox-v2-item>
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
