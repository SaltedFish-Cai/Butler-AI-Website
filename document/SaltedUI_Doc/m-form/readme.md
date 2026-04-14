# Form 表单

`m-form-v2` 能够快速搭建你需要的表单，只需简单的配置即可创建一个带有 `校验/组合/拆分` 等功能的完善表单，当然你还可以使用 `插槽` 功能扩展使你的表单更加强大！

## `MStructureV2Type.FormV2`

```typescript
const formConfig: MStructureV2Type.FormV2[] = [
  { label: "输入框", prop: "Input1", type: "input" },
  ...
];
```

## `BaseType`

| 字段     | 类型                                                                                       | 类型    | 描述                  |
| -------- | ------------------------------------------------------------------------------------------ | ------- | --------------------- |
| prop     | `string`                                                                                   | —       | 表头 prop 表 key 字段 |
| unitName | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       | 单位名称              |
| unitTip  | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       | 单位提示              |
| label    | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       | 表头展示              |
| tip      | `Record<"en-US" \| "zh-CN", string>` `string`                                              | —       | 提示信息              |
| disabled | `boolean`                                                                                  | `false` | 是否禁用              |
| rules    | `Array<{ required?: boolean; message?: Record<languageKey, string> \| string }>` `boolean` | `[]`    | 外置校验规则          |
| exSpan   | `1` `2` `3` `4`                                                                            | `4`     | 单行分栏              |
| required | `boolean`                                                                                  | `false` | 是否必填              |
| colSpan  | `1` `2` `3` `4` `5` `6` `7` `8` `9` `10` `11` `12`                                         | —       | 列宽分栏              |

## `CellItemType`

| 单元格类型                                                       | 描述       |
| ---------------------------------------------------------------- | ---------- |
| [MInputV2Type](/document/SaltedUI_Doc/m-input/readme.html)       | 输入框     |
| [MNumberV2Type](/document/SaltedUI_Doc/m-number/readme.html)     | 数字输入框 |
| [MSelectV2Type](/document/SaltedUI_Doc/m-select/readme.html)     | 选择器     |
| [MCascaderV2Type](/document/SaltedUI_Doc/m-cascader/readme.html) | 联级选择器 |
| [MCheckBoxV2Type](/document/SaltedUI_Doc/m-checkbox/readme.html) | 多选       |
| [MRadioV2Type](/document/SaltedUI_Doc/m-radio/readme.html)       | 单选       |
| [MSwitchV2Type](/document/SaltedUI_Doc/m-switch/readme.html)     | 开关       |
| [MTimeV2Type](/document/SaltedUI_Doc/m-time/readme.html)         | 时间选择器 |
| [MFileV2Type](/document/SaltedUI_Doc/m-file/readme.html)         | 文件选择器 |

## `MFormV2Props`

| 字段            | 类型                                                                                               | 默认值  | 描述                               |
| --------------- | -------------------------------------------------------------------------------------------------- | ------- | ---------------------------------- |
| id              | `string`                                                                                           | —       | 表单 ID                            |
| data            | `object`                                                                                           | —       | 外置默认数据(`非双向绑定数据`)     |
| contrastData    | `object`                                                                                           | —       | 外置对比数据                       |
| alwaysContrast  | `boolean`                                                                                          | `false` | 是否一直展示对比数据               |
| exOptions       | `object`                                                                                           | —       | 外置 `Option 参数` 依赖            |
| useRequired     | `object`                                                                                           | `true`  | 强制不使用校验                     |
| noLabel         | `boolean`                                                                                          | `false` | 是否不展示 `label`                 |
| labelWidth      | `number`                                                                                           | —       | `label` 宽度，不设置时使用弹性宽度 |
| labelPosition   | `'left'` `'top'`                                                                                   | —       | `labelWidth==true` 时 `label` 位置 |
| structure       | `Array<MStructureV2Type.FormV2>`                                                                   | —       | 表单配置                           |
| disabled        | `boolean`                                                                                          | `false` | 设置表单为纯展示                   |
| display         | `boolean`                                                                                          | `false` | 是否纯展示表单                     |
| exDependent     | [MFormV2ExDependentType](/document/SaltedUI_Doc/m-form/readme.html#mformv2exdependenttype)         | —       | 外置依赖                           |
| exCellDependent | [MFormV2CellExDependentType](/document/SaltedUI_Doc/m-form/readme.html#mformv2cellexdependenttype) | —       | 单元格外置依赖                     |
| maxSpan         | `1` `2` `3` `4`                                                                                    | `4`     | 最大分栏数                         |
| exSpan          | `1` `2` `3` `4`                                                                                    | `4`     | 最大分栏数                         |

## `MFormV2ExDependentType`

| 字段         | 类型                                                                                                     | 描述               |
| ------------ | -------------------------------------------------------------------------------------------------------- | ------------------ |
| disabledRule | `{ [x: string]: (value) => boolean }`                                                                    | 禁用规则           |
| displayRule  | `{ [x: string]: (value) => boolean }`                                                                    | 显示规则           |
| exCellRules  | `{ [x: string]: Array<{ validator: (rule: any, value: any, callback: any) => void; trigger: string }> }` | 单元格外置依赖规则 |

## `MFormV2CellExDependentType`

| 字段                  | 类型                                                                        | 描述                   |
| --------------------- | --------------------------------------------------------------------------- | ---------------------- |
| select_RequestApi     | `{ [x: string]: ({ query: string }) => Promise<MOptionV2Type.SelectList> }` | 选择器请求 Api         |
| time_disabledDateFn   | `{ [x: string]: (date: any) => boolean }`                                   | 时间选择器禁用日期函数 |
| time_shortcuts        | `{ [x: string]: DatePickerShortcut[] }`                                     | 时间选择器快捷选项     |
| file_attachedData     | `{ [x: string]: Record<string, string> }`                                   | 文件上传附带数据       |
| file_downloadTemplate | `{ [x: string]: () => void }`                                               | 文件下载模板           |

## `MFormV2Events`

| 字段             | 类型                                        | 描述                               |
| ---------------- | ------------------------------------------- | ---------------------------------- |
| onFormDataChange | `(data: object) => void`                    | 当表单数据发生变化时调用的回调方法 |
| onFormCellChange | `({prop, value, oldValue, option}) => void` | 当`单元`发生变化时调用的回调方法   |

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

| 方法名称          | 请求参数                                                | 描述                                       |
| ----------------- | ------------------------------------------------------- | ------------------------------------------ |
| getSubmitForm     | `null`                                                  | 获取提交表单数据（校验表单数据并获取数据） |
| clean_All         | `null`                                                  | 清除所有数据                               |
| setStructure_All  | `(structure: Array<MStructureV2Type.FormV2>) => void`   | 设置表格所有结构                           |
| setStructure_Item | `(prop: string, item: MStructureV2Type.FormV2) => void` | 设置表格单个结构                           |
| changeData_All    | `(data: Array<object>) => void`                         | 设置表格所有数据                           |
| changeData_Item   | `(prop: string, value: object) => void`                 | 设置表格单个数据                           |

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
<m-form-v2 :labelWidth="100" display ... />
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
<m-form-v2 id="case-slot-from-demo" ref="proForm" :structure="formConfig">
  <template #SlotKey> ... </template>
</m-form-v2>
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
<m-form-v2 id="case-slot-from-demo" ref="proForm" :structure="formConfig">
  <template #option-Select="scope"> {{ scope }} </template> // [!code warning]
</m-form-v2>
```

<demo src="./case-slot-options.vue"></demo>

### Cell 的扩展

`Cell元素` 的两侧预留了插槽用于内容的展示与扩展，使用时插槽名称只需在 `key` 前面添加 `cell-` 即可。

```html
<m-form-v2 id="case-slot-from-demo" ref="proForm" :structure="formConfig" :span="2">
  <template #cell-Select> <m-button-v2 is="go">Cell 单元扩展</m-button-v2> </template> // [!code warning]
</m-form-v2>
```

<demo src="./case-slot-cell.vue"></demo>
