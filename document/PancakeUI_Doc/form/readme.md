# Form 表单

`pa-form` 能够快速搭建你需要的表单，只需简单的配置即可创建一个带有 `校验/组合/拆分` 等功能的完善表单，当然你还可以使用 `插槽` 功能扩展使你的表单更加强大！

## 基础使用

最简单的使用方式，只需要配置 `structure` 即表单的结构配置，即可完成表单的创建，如果表单数据中存根据 `选项（select）` 获取展示的值，还需配置 `exOptions` 来匹配选项的值，你还可以在配置中设置 `rules` 规则项，给单独一个字端设置校验规则。

通过 `ref` 可以获取到表单实例，调用 `getSubmitForm` 即可完成表单的校验。

<demo src="./base.vue"></demo>

## 组件展示

常用组件的展示和配置演示，你可以使用 `useRequired` 字端来给整个表单去除校验功能。

<demo src="./show.vue"></demo>

## 归档

如果你想为你的表单内容进行归档，只需在 `structure` 中添加 `unitName` 即可完成页面归档展示。

```typescript
const formConfig: ComponentItemProps[] = [
  {
    unitName: "groupName#1",
    ...
  }
];
```

<demo src="./classify.vue"></demo>

## 数据变更

你可以使用 `changeData_All` 变更所有数据，也可以使用 `changeData_Item` 变更单个数据。

<demo src="./default-data.vue"></demo>

## Tab Form

高阶组件的展示和配置演示，在使用时需在 `structure` 配置中添加字段 `tabsFormConfig` 其值为基础组件配置。
获取结果时，组件会对内容进行校验，当单个 Tab 页面出现 `错误`，组件会 `自动跳转` 至错误页，并提示错误内容.

```typescript
const tabsFormConfig: ComponentItemProps[] = [
  { unitName: "Tab-groupName1", label: "Input1", prop: "Input1", type: "input" },
  ...
];

const formConfig: ComponentItemProps[] = [
  { unitName: "高阶组件——标签", label: "标签组件", prop: "Tab1", type: "tabs-form", tabsFormConfig }
];
```

<demo src="./tab.vue"></demo>

## Group Form

高阶组件的展示和配置演示，在使用时需在 `structure` 配置中添加字段 `groupFormConfig` 其值为基础组件配置。
`groupFormConfig` 内的元素，当 `prop` `相同`，返回时只会产生一个数据。

```typescript
const formConfig: ComponentItemProps[] = [
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

使用 `Display` 模式时，将无法修改任何数据，数据只做展示使用，但是 `exSpan` `labelWidth` 等配置依然生效。

```html
<pa-form :labelWidth="100" display ... />
```

<demo src="./show-display.vue"></demo>

## 使用 `外置校验规则` 配置

该场景使用 `exDependent.exCellRules` 给 `Form组件` 提供内部参数，支持延迟和异步方式赋值。

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
const formConfig: ComponentItemProps[] = [
  {
    label: "Slot1",
    prop: "SlotKey",
    type: "slot"
  }
];
```

<demo src="./case-slot.vue"></demo>

### Option 的扩展

对于下拉框结构的现实可以使用 `Options-Slot` 进行扩展，使用时插槽名称只需在 `key` 前面添加 `option-` 即可。

```html
<pa-form id="case-slot-from-demo" ref="proForm" :structure="formConfig">
  <template #option-Select="scope"> {{ scope }} </template>
</pa-form>
```

<demo src="./case-slot-options.vue"></demo>

### Cell 的扩展

`Cell元素` 的两侧预留了插槽用于内容的展示与扩展，使用时插槽名称只需在 `key` 前面添加 `cell-` 即可。

```html
<pa-form id="case-slot-from-demo" ref="proForm" :structure="formConfig" :exSpan="2">
  <template #cell-Select> <pa-button is="go">Cell 单元扩展</pa-button> </template>
</pa-form>
```

<demo src="./case-slot-cell.vue"></demo>

## ComponentProps

| 字段             | 描述                 | 类型                                                                                                                                                                         | 默认值  |
| ---------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| id               | 唯一标识             | `string`                                                                                                                                                                     | `-`     |
| class            | 自定义类名           | `Array<string>` \| `string`                                                                                                                                                  | `-`     |
| style            | 自定义样式           | `Record<string, string \| number>`                                                                                                                                           | `-`     |
| data             | 外置默认数据         | [`FormDataType`](#formdatatype)                                                                                                                                              | `-`     |
| contrastData     | 外置对比数据         | `Record<string, any>`                                                                                                                                                        | `-`     |
| alwaysContrast   | 是否一直展示对比数据 | `boolean`                                                                                                                                                                    | `false` |
| exOptions        | 外置选项依赖         | [`PaOptionType.Default`](/document/PancakeUI_Doc/options#optiontypedefault)                                                                                                  | `-`     |
| useRequired      | 是否使用校验         | `boolean`                                                                                                                                                                    | `true`  |
| noLabel          | 是否隐藏 label       | `boolean`                                                                                                                                                                    | `false` |
| labelWidth       | 标签宽度             | `number` \| `string`                                                                                                                                                         | `-`     |
| labelPosition    | 标签位置             | `'left'` \| `'right'` \| `'top'`                                                                                                                                             | `'top'` |
| structure        | 表单结构配置         | `Array<ComponentItemProps>`                                                                                                                                                  | `-`     |
| disabled         | 是否禁用表单         | `boolean`                                                                                                                                                                    | `false` |
| display          | 是否纯展示表单       | `boolean`                                                                                                                                                                    | `false` |
| exDependent      | 表单额外依赖         | [`PaFormExDependentType`](#paformexdependenttype)                                                                                                                            | `-`     |
| exCellDependent  | 单元格外置依赖       | [`PaFormCellExDependentType`](#paformcellexdependenttype)                                                                                                                    | `-`     |
| maxSpan          | 单行最大分栏         | `1` \| `2` \| `3` \| `4`                                                                                                                                                     | `4`     |
| exSpan           | 单行强制分栏         | `1` \| `2` \| `3` \| `4`                                                                                                                                                     | `1`     |
| onFormCellChange | 单元素变化回调       | `(params: { prop: string; value: Array<number \| string> \| number \| string; oldValue: Array<number \| string> \| number \| string; option: PaOptionType.Select }) => void` | `-`     |
| onFormDataChange | 表单数据变化回调     | `(data: Record<string, any>) => void`                                                                                                                                        | `-`     |

## ComponentEmits

| 字段              | 描述               | 类型                                                                       |
| ----------------- | ------------------ | -------------------------------------------------------------------------- |
| formDataChange    | 表单数据变化时触发 | `(data: Record<string, any>) => void`                                      |
| formCellChange    | 单元素变化时触发   | `(data: { prop: string; value: any; oldValue: any; option: any }) => void` |
| onFormStateChange | 表单状态变化时触发 | `(data: string) => void`                                                   |

## ComponentItemProps

| 字段     | 描述             | 类型                                                                                                                                 | 默认值  |
| -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| prop     | 表单单元唯一 Key | `string`                                                                                                                             | `-`     |
| unitName | 自动划组名称     | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string`                                             | `-`     |
| unitTip  | 自动划组提示     | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string`                                             | `-`     |
| label    | 表单项标题       | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string`                                             | `-`     |
| tip      | 表单项提示       | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string`                                             | `-`     |
| disabled | 是否禁用         | `boolean`                                                                                                                            | `false` |
| rules    | 外置校验规则     | `Array<{ required?: boolean; message?: LanguagePackageType \| string }>` \| `boolean`                                                | `-`     |
| exSpan   | 单行分栏         | `1` \| `2` \| `3` \| `4`                                                                                                             | `1`     |
| required | 是否必填         | `boolean`                                                                                                                            | `false` |
| exStyles | 额外样式         | `{ style?: Record<string, string>; message?: string; class?: string; messageClass?: string; messageStyle?: Record<string, string> }` | `-`     |

## CellItemType

| 描述       | 单元格类型                                                       |
| ---------- | ---------------------------------------------------------------- |
| 输入框     | [`ComponentProps`](/document/PancakeUI_Doc/input/readme.html)    |
| 数字输入框 | [`ComponentProps`](/document/PancakeUI_Doc/number/readme.html)   |
| 选择器     | [`ComponentProps`](/document/PancakeUI_Doc/select/readme.html)   |
| 联级选择器 | [`ComponentProps`](/document/PancakeUI_Doc/cascader/readme.html) |
| 多选       | [`ComponentProps`](/document/PancakeUI_Doc/checkbox/readme.html) |
| 单选       | [`ComponentProps`](/document/PancakeUI_Doc/radio/readme.html)    |
| 开关       | [`ComponentProps`](/document/PancakeUI_Doc/switch/readme.html)   |
| 时间选择器 | [`ComponentProps`](/document/PancakeUI_Doc/time/readme.html)     |
| 文件选择器 | [`ComponentProps`](/document/PancakeUI_Doc/file/readme.html)     |

## PaFormExDependentType

| 字段         | 描述               | 类型                                                                                                                 |
| ------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| disabledRule | 禁用规则           | `{ [x: string]: (value: any) => boolean }`                                                                           |
| displayRule  | 显示规则           | `{ [x: string]: (value: any) => boolean }`                                                                           |
| exCellRules  | 单元格外置依赖规则 | `{ [x: string]: Array<{ validator: (params: { rule: any; value: any; callback: any }) => void; trigger: string }> }` |

## PaFormCellExDependentType

| 字段                  | 描述                   | 类型                                                                               |
| --------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| select_RequestApi     | 选择器请求 Api         | `{ [x: string]: (params: { query: string }) => Promise<PaOptionType.SelectList> }` |
| time_disabledDateFn   | 时间选择器禁用日期函数 | `{ [x: string]: (date: any) => boolean }`                                          |
| time_shortcuts        | 时间选择器快捷选项     | `{ [x: string]: Array<DatePickerShortcut> }`                                       |
| file_attachedData     | 文件上传附带数据       | `{ [x: string]: Record<string, string> }`                                          |
| file_downloadTemplate | 文件下载模板           | `{ [x: string]: () => void }`                                                      |
| clickTagClick         | 点击标签回调函数       | `{ [x: string]: (prop: string, data: object) => void }`                            |

## ComponentRef

| 方法名称         | 描述                                       | 请求参数                                           |
| ---------------- | ------------------------------------------ | -------------------------------------------------- |
| getSubmitForm    | 获取提交表单数据（校验表单数据并获取数据） | `-`                                                |
| clean_All        | 清除所有数据                               | `-`                                                |
| setStructure_All | 设置所有结构                               | `(structure: Array<ComponentItemProps>) => void`   |
| setStructureItem | 设置单个结构                               | `(prop: string, item: ComponentItemProps) => void` |
| changeData_All   | 设置所有数据                               | `(data: object) => void`                           |
| changeData_Item  | 设置单个数据                               | `(prop: string, value: any) => void`               |

## FormItemRule

| 字段      | 描述           | 类型                                                                                                                                                                                             | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| type      | 验证规则名称   | `'any'` \| `'array'` \| `'boolean'` \| `'date'` \| `'email'` \| `'enum'` \| `'float'` \| `'hex'` \| `'integer'` \| `'method'` \| `'number'` \| `'object'` \| `'regexp'` \| `'string'` \| `'url'` | `-`    |
| required  | 是否必填       | `boolean`                                                                                                                                                                                        | `-`    |
| message   | 验证错误信息   | `string`                                                                                                                                                                                         | `-`    |
| trigger   | 验证触发方式   | `'blur'` \| `'change'` \| `'input'`                                                                                                                                                              | `-`    |
| min       | 最小值         | `number`                                                                                                                                                                                         | `-`    |
| max       | 最大值         | `number`                                                                                                                                                                                         | `-`    |
| len       | 长度           | `number`                                                                                                                                                                                         | `-`    |
| pattern   | 正则表达式     | `RegExp`                                                                                                                                                                                         | `-`    |
| validator | 自定义验证函数 | `(params: { rule: FormItemRule; value: any; callback: (error?: string) => void }) => Promise<void> \| void`                                                                                      | `-`    |
| enum      | 枚举值         | `Array<boolean \| number \| string \| null \| undefined>`                                                                                                                                        | `-`    |
| transform | 转换值         | `(value: any) => any`                                                                                                                                                                            | `-`    |

## FormDataType

| 字段    | 描述       | 类型      | 默认值 |
| ------- | ---------- | --------- | ------ |
| name    | 表单名称   | `string`  | `-`    |
| isError | 是否有错误 | `boolean` | `-`    |

## ExMultipleConfigType

| 字段             | 描述         | 类型                        | 默认值 |
| ---------------- | ------------ | --------------------------- | ------ |
| inMultipleConfig | 多配置选项   | `Array<MultipleConfigType>` | `-`    |
| tabsFormConfig   | Tab 表单配置 | `Array<PaFormChildType>`    | `-`    |

## MultipleConfigType

| 字段     | 描述         | 类型                        | 默认值 |
| -------- | ------------ | --------------------------- | ------ |
| unitName | 自动划组名称 | `string`                    | `-`    |
| unitTip  | 自动划组提示 | `string`                    | `-`    |
| configs  | 配置列表     | `Array<ComponentItemProps>` | `-`    |
