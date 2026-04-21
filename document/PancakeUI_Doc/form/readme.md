# Form 表单

`pa-form` 能够快速搭建你需要的表单，只需简单的配置即可创建一个带有 `校验/组合/拆分` 等功能的完善表单，当然你还可以使用 `插槽` 功能扩展使你的表单更加强大！

## 基础使用

最简单的使用方式，只需要配置 `config` 即表单的结构配置，即可完成表单的创建，如果表单数据中存根据 `选项（select）` 获取展示的值，还需配置 `ex-options` 来匹配选项的值，你还可以在配置中设置 `rules` 规则项，给单独一个字端设置校验规则。

通过 `ref` 可以获取到表单实例，调用 `submitForm` 即可完成表单的校验。

<demo src="./base.vue"></demo>

## 组件展示

常用组件的展示和配置演示，你可以使用 `useRequired` 字端来给整个表单去除校验功能。

<demo src="./show.vue"></demo>

## 归档

如果你想为你的表单内容进行归档，只需在 `config` 中添加 `groupName` 类即可完成页面归档展示。

```typescript
const formConfig: FormItemType[] = [
  {
    unitName: "groupName#1", // [!code warning]
    ...
  }
];
```

<demo src="./classify.vue"></demo>

## 数据变更

你可以使用 `changeData_All` 变更所有数据，也可以使用 `changeData_Item` 变更单个数据。

<demo src="./default-data.vue"></demo>

## Tab Form

高阶组件的展示和配置演示，在使用时需在 `config` 配置中添加字段 `tabsFormConfig` 其值为基础组件配置。
获取结果时，组件会对内容进行校验，当单个 Tab 页面出现 `错误`，组件会 `自动跳转` 至错误页，并提示错误内容.

```typescript
const tabsFormConfig: MStructureV2Type.FormV2[] = [
  { groupName: "Tab-groupName1", label: "Input1", prop: "Input1", type: "input" },
  ...
];

const formConfig: MStructureV2Type.FormV2[] = [
  { groupName: "高阶组件——标签", label: "标签组件", prop: "Tab1", type: "tabs-form", tabsFormConfig }
];
```

<demo src="./tab.vue"></demo>

## Group Form

高阶组件的展示和配置演示，在使用时需在 `config` 配置中添加字段 `groupFormConfig` 其值为基础组件配置。
`groupFormConfig` 内的元素，当 `prop` `相同`，返回时只会产生一个数据。

```typescript
const formConfig: MStructureV2Type.FormV2[] = [
  {
    label: "group组",
    prop: "groupProp",
    type: "group",
    groupFormConfig: [
      {
        label: "选项1",
        prop: "childProp1",
        type: "input",
        value: "value1"
      },
      {
        label: "选项2",
        prop: "childProp1",
        value: "value2",
        type: "textarea"
      }
    ]
  }
];
```

<demo src="./group.vue"></demo>

## 展示模式（Display）

使用 `Display` 模式时，将无法修改任何数据，数据只做展示使用，但是 `span` `labelWidth` 等配置依然生效。

```html
<pa-form :labelWidth="100" display ... />
```

<demo src="./show-display.vue"></demo>

## 使用 `外置校验规则` 配置

该场景使用 `ex-dependent.exCellRules` 给 `Form组件` 提供内部参数，支持延迟和异步方式赋值。

```typescript
const exRules = ref({
  exCellRules: {
    Input1: [{ validator: Input1Rules, trigger: "blur" }]
  }
});

function ruleFunction({ value, callback }) {
  callback();
}
```

<demo src="./case-ex-rules.vue"></demo>

## 使用 `Slot 插槽` 进行扩展

对于非基础表单组件或无法满足需求的，可以使用 `Slot 插槽` 对表单进行扩展。

### 基础的使用

```html
<pa-form id="case-slot-from-demo" ref="proForm" :structure="formConfig">
  <template #SlotKey> ... </template>
</pa-form>
```

```typescript
const formConfig: MStructureV2Type.FormV2[] = [
  {
    label: "Slot1",
    prop: "SlotKey", // [!code warning]
    type: "slot" // [!code error]
  }
];
```

<demo src="./case-slot.vue"></demo>

### Option 的扩展

对于下拉框结构的现实可以使用 `Options-Slot` 进行扩展，使用时插槽名称只需在 `key` 前面添加 `option-` 即可。

```html
<pa-form id="case-slot-from-demo" ref="proForm" :structure="formConfig">
  <template #option-Select="scope"> {{ scope }} </template> // [!code warning]
</pa-form>
```

<demo src="./case-slot-options.vue"></demo>

### Cell 的扩展

`Cell元素` 的两侧预留了插槽用于内容的展示与扩展，使用时插槽名称只需在 `key` 前面添加 `cell-` 即可。

```html
<pa-form id="case-slot-from-demo" ref="proForm" :structure="formConfig" :span="2">
  <template #cell-Select> <pa-button is="go">Cell 单元扩展</pa-button> </template> // [!code warning]
</pa-form>
```

<demo src="./case-slot-cell.vue"></demo>

## `MStructureV2Type.FormV2`

```typescript
const formConfig: MStructureV2Type.FormV2[] = [
  { label: "输入框", prop: "Input1", type: "input" },
  ...
];
```

## `BaseType`

| 字段     | 描述                  | 类型                                                                                       | 类型    |
| -------- | --------------------- | ------------------------------------------------------------------------------------------ | ------- |
| prop     | 表头 prop 表 key 字段 | `string`                                                                                   | —       |
| unitName | 单位名称              | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       |
| unitTip  | 单位提示              | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       |
| label    | 表头展示              | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       |
| tip      | 提示信息              | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       |
| disabled | 是否禁用              | `boolean`                                                                                  | `false` |
| rules    | 外置校验规则          | `Array<{ required?: boolean; message?: Record<languageKey, string> \| string }>` `boolean` | `[]`    |
| exSpan   | 单行分栏              | `1` `2` `3` `4`                                                                            | `4`     |
| required | 是否必填              | `boolean`                                                                                  | `false` |
| colSpan  | 列宽分栏              | `1` `2` `3` `4` `5` `6` `7` `8` `9` `10` `11` `12`                                         | —       |

## `CellItemType`

| 描述       | 单元格类型                                                    |
| ---------- | ------------------------------------------------------------- |
| 输入框     | [SaInputType](/document/PancakeUI_Doc/input/readme.html)       |
| 数字输入框 | [SaNumberType](/document/PancakeUI_Doc/number/readme.html)     |
| 选择器     | [SaSelectType](/document/PancakeUI_Doc/select/readme.html)     |
| 联级选择器 | [SaCascaderType](/document/PancakeUI_Doc/cascader/readme.html) |
| 多选       | [SaCheckboxType](/document/PancakeUI_Doc/checkbox/readme.html) |
| 单选       | [SaRadioType](/document/PancakeUI_Doc/radio/readme.html)       |
| 开关       | [SaSwitchType](/document/PancakeUI_Doc/switch/readme.html)     |
| 时间选择器 | [SaTimeType](/document/PancakeUI_Doc/time/readme.html)         |
| 文件选择器 | [SaFileType](/document/PancakeUI_Doc/file/readme.html)         |

## `SaFormProps`

| 字段                               | 描述            | 类型                                                                                           | 默认值  |
| ---------------------------------- | --------------- | ---------------------------------------------------------------------------------------------- | ------- |
| 表单 ID                            | id              | `string`                                                                                       | —       |
| 外置默认数据(`非双向绑定数据`)     | data            | `object`                                                                                       | —       |
| 外置对比数据                       | contrastData    | `object`                                                                                       | —       |
| 是否一直展示对比数据               | alwaysContrast  | `boolean`                                                                                      | `false` |
| 外置 `Option 参数` 依赖            | exOptions       | `object`                                                                                       | —       |
| 强制不使用校验                     | useRequired     | `object`                                                                                       | `true`  |
| 是否不展示 `label`                 | noLabel         | `boolean`                                                                                      | `false` |
| `label` 宽度，不设置时使用弹性宽度 | labelWidth      | `number`                                                                                       | —       |
| `labelWidth==true` 时 `label` 位置 | labelPosition   | `'left'` `'top'`                                                                               | —       |
| 表单配置                           | structure       | `Array<MStructureV2Type.FormV2>`                                                               | —       |
| 设置表单为纯展示                   | disabled        | `boolean`                                                                                      | `false` |
| 是否纯展示表单                     | display         | `boolean`                                                                                      | `false` |
| 外置依赖                           | exDependent     | [SaFormExDependentType](/document/PancakeUI_Doc/form/readme.html#SaFormexdependenttype)         | —       |
| 单元格外置依赖                     | exCellDependent | [SaFormCellExDependentType](/document/PancakeUI_Doc/form/readme.html#SaFormcellexdependenttype) | —       |
| 最大分栏数                         | maxSpan         | `1` `2` `3` `4`                                                                                | `4`     |
| 最大分栏数                         | exSpan          | `1` `2` `3` `4`                                                                                | `4`     |

## `SaFormExDependentType`

| 字段         | 描述               | 类型                                                                                                     |
| ------------ | ------------------ | -------------------------------------------------------------------------------------------------------- |
| disabledRule | 禁用规则           | `{ [x: string]: (value) => boolean }`                                                                    |
| displayRule  | 显示规则           | `{ [x: string]: (value) => boolean }`                                                                    |
| exCellRules  | 单元格外置依赖规则 | `{ [x: string]: Array<{ validator: (rule: any, value: any, callback: any) => void; trigger: string }> }` |

## `SaFormCellExDependentType`

| 字段                  | 描述                   | 类型                                                                        |
| --------------------- | ---------------------- | --------------------------------------------------------------------------- |
| select_RequestApi     | 选择器请求 Api         | `{ [x: string]: ({ query: string }) => Promise<MOptionV2Type.SelectList> }` |
| time_disabledDateFn   | 时间选择器禁用日期函数 | `{ [x: string]: (date: any) => boolean }`                                   |
| time_shortcuts        | 时间选择器快捷选项     | `{ [x: string]: DatePickerShortcut[] }`                                     |
| file_attachedData     | 文件上传附带数据       | `{ [x: string]: Record<string, string> }`                                   |
| file_downloadTemplate | 文件下载模板           | `{ [x: string]: () => void }`                                               |

## `SaFormEvents`

| 字段             | 描述                               | 类型                                        |
| ---------------- | ---------------------------------- | ------------------------------------------- |
| onFormDataChange | 当表单数据发生变化时调用的回调方法 | `(data: object) => void`                    |
| onFormCellChange | 当`单元`发生变化时调用的回调方法   | `({prop, value, oldValue, option}) => void` |

## `DefineExpose`

```typescript
const proForm = ref();
async function submitForm() {
  const data = await proForm.value.getSubmitForm();
  if (data) {
    formData.value = data;
  }
}
```

| 方法名称          | 描述                                       | 请求参数                                                |
| ----------------- | ------------------------------------------ | ------------------------------------------------------- |
| getSubmitForm     | 获取提交表单数据（校验表单数据并获取数据） | `null`                                                  |
| clean_All         | 清除所有数据                               | `null`                                                  |
| setStructure_All  | 设置表格所有结构                           | `(structure: Array<MStructureV2Type.FormV2>) => void`   |
| setStructure_Item | 设置表格单个结构                           | `(prop: string, item: MStructureV2Type.FormV2) => void` |
| changeData_All    | 设置表格所有数据                           | `(data: Array<object>) => void`                         |
| changeData_Item   | 设置表格单个数据                           | `(prop: string, value: object) => void`                 |
| class | 自定义类名 | `string` | `undefined` |
| style | 自定义样式 | `Record<string, string>` | `undefined` |
