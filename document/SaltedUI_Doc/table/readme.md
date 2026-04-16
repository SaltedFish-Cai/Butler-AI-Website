# Table 表格

`sa-table` 能够快速搭建你需要的表格，只需简单的配置即可创建一个带有 `筛选/搜索/排序/分页` 等功能的完善表格，当然你还可以使用 `插槽` 功能扩展使你的表格更加强大！

## 基础使用

只需要配置 `structure` 即表格的结构配置，并添加数据来源 `request-api` 即可完成表格的创建，如果表格数据中存根据 `选项（select）` 获取展示的值，还需配置 `ex-options` 来匹配选项的值。
点击表格右上角 `工具图标按钮`，即可打开表格的筛选配置，在这里你可以对每一个列进行 `筛选/选择/左右固定/是否展示列` 的处理。
点击表格右上角 `刷新图标按钮`，即可单独再次获取当前已经筛选后的表数据，数据来源会再次请求 `request-api` 所提供的接口。
通过 `ref` 可以获取到表格实例，然后带去表格内值的方法，如刷新页面。获取数据等功能

<demo src="./base.vue"></demo>

## 选择功能（Selection / Radio）

在使用带有多选的表格时，必须选择填写 `row-key` 其值为返回对象数组中对象的 `唯一` 键值，并且在表格配置中添加 `selection / radio` 一行以打开表的选择列。 \*如果 `row-key` 出现非唯一时，可能出现勾选内容和实际内容 `错误/偏差/无法勾选` 等情况！
`获取选中值` 可以通过 `ref` 获取实例，然后获取实例中 `selectedList` 字段，数据包含单条数据的完整内容。

### 多选（Selection）

```typescript
<sa-table
  id="select-table-v2-demo"
  ref="proTable"
  row-key="Text" // [!code warning]
  use-select // [!code warning]
  :structure="tableConfig"
  :request-api="getTableList"
  :ex-options="exOptions"
  @select-row-back="selectRowBack" // [!code warning]
  @select-row-all-back="selectRowAllBack" // [!code warning]
/>
```

<demo src="./select.vue"></demo>

### 单选（Radio）

```typescript
<sa-table
  id="select-table-v2-demo"
  ref="proTable"
  row-key="Text" // [!code warning]
  use-radio // [!code warning]
  :structure="tableConfig"
  :request-api="getTableList"
  :ex-options="exOptions"
  @select-row-back="selectRowBack" // [!code warning]
 />
```

<demo src="./radio.vue"></demo>

## 额外展示（Expand）

使用 `use-expand` 打开表的展开按钮，在表格内添加插槽 `expand` 以展示展开内容

```typescript
<sa-table
  id="select-table-v2-demo"
  ref="proTable"
  row-key="Text" // [!code warning]
  use-expand // [!code warning]
  :structure="tableConfig"
  :request-api="getTableList"
  :ex-options="exOptions"
/>
```

<demo src="./expand.vue"></demo>

## 子数据（Children）

在使用带有子数据的表格时，必须选择填写 `row-key` 其值为返回对象数组中对象的 `唯一` 键值，并且在表格配置中添加 `row` 一行以打开表的展开列。
列表渲染表格时，当表格数据中出现 `children` 切其值为 `数组` 类型则回被视为子数据。 \*如果 `row-key` 出现非唯一时，可能出现勾选内容和实际内容 `错误/偏差/无法展开` 等情况！

:::danger
`children` 作为关键字，不可作为自定义对象使用，其值必须与同级结构相同。
:::

```typescript
<sa-table
  id="select-table-v2-demo"
  ref="proTable"
  row-key="Text" // [!code warning]
  use-children // [!code warning]
  :structure="tableConfig"
  :request-api="getTableList"
  :ex-options="exOptions"
/>
```

<demo src="./children.vue"></demo>

## 单元格（Cell）

只需在配置中设置 `cellConfig` 即可使用 `Cell元素` 作为表格内容展示。通过 `getSubmitTableList` 获取表格内填写的内容。

```typescript
const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Cell-Input", prop: "Input", cellConfig: { type: "input" } },
  { label: "Cell-Select", prop: "Select", cellConfig: { type: "select" } },
  ...
];
```

<demo src="./case-cell.vue"></demo>

## 单元格的校验（Cell Submit）

在使用 `getSubmitTableList` 时，同 'm-form' 相同内部会进行数据校验，默认情况下每个单元格都是 `必填项` ，可以通过配置修改，也可以通过 `exDependent.submitRule` 对其就行独立的校验。

```typescript
<sa-table
  id="cell-table-demo-submit"
  ref="proTable"
  :structure="tableConfig"
  :request-api="getTableList"
  :ex-dependent="exDependent" // [!code warning]
  row-key="Text"
>
  <template #operation>
    <sa-button is="edit"> 编辑 </sa-button>
  </template>

  <template #FooterCenter>
    <sa-button is="edit" @click="submitTable"> 提交表格 </sa-button>
  </template>
</sa-table>

const exDependent = {
  submitRule: {
    exCellRules: {
      Input1: [{ validator: validatorRules, trigger: "blur" }] // [!code warning]
    }
};

function validatorRules({ value, callback }) { // [!code warning]
  if (value >= 99) {
    callback();
  } else {
    callback(new Error(`Input值必须大于99`));
  }
}
```

<demo src="./case-cell-submit.vue"></demo>

## 标记（Tag）

使用 [useDictionaries](/document/SaltedUI_Doc/tools/dictionaries.html#获取字典选项-usedictionaries) 获取字典结果更快捷。

```typescript
const tableConfig: MStructureType.Table[] = [
  { label: "Cell-Text", prop: "Text" },
  { label: "Cell-Input", prop: "Select", cellConfig: { type: "tag" } }, // [!code warning]
  { label: "操作", prop: "operation" }
];

const exOptions = ref({});
nextTick(async () => {
  const Select: mTagOptionType[] = await useDictionaries("table", ["Dealer"]);
  const bgColor = ["#33b698", "#409eff"]; // [!code warning]
  for (let index = 0; index < Select.length; index++) {
    Select[index].tagStyle = { bgColor: bgColor[index], textColor: "#fff" }; // [!code warning]
  }
  exOptions.value = { Select };
});
```

<demo src="./case-tag.vue"></demo>

## 外部依赖（ExDependent）

- 使用 `useToolButton` 打开表格工具按钮区域，默认情况下会展示 `搜索按钮/筛选配置`。
- 使用 `usePagination` 打开表格分页组件区域。
- 使用 `embeddedToolButton` 嵌入工具按钮区域，默认情况下会展示 `搜索按钮/筛选配置`。
- 使用 `exPagination` 对分页组件进行额外的配置。
- 使用 `exDependent` 对表格进行额外的配置。
- 使用 `exCellDependent` 对单元格进行额外的配置。

```typescript
<m-table
  :ex-options="exOptions"
  :useToolButton="state.useToolButton" // [!code warning]
  :usePagination="state.usePagination" // [!code warning]
  use-select
  :embeddedToolButton="state.embeddedToolButton" // [!code warning]
  :exDependent="exDependent" // [!code warning]
  :exCellDependent="exCellDependent" // [!code warning]
  :exPagination="exPagination" // [!code warning]
>
</m-table>
```

<demo src="./case-options.vue"></demo>

## 插槽（Slots）

```html
<m-table ref="proTable" :structure="tableConfig" :request-api="getTableList">
  <template #HeaderLeft>>HeaderLeft Slot</template>
  ...
</m-table>
```

| 字段             | 描述                                             |
| ---------------- | ------------------------------------------------ |
| HeaderLeft       | 表头左侧区域                                     |
| HeaderCenter     | 表头中间区域                                     |
| ToolButton       | 表头右侧按钮工具区域，替换（搜索按钮/筛选配置）  |
| ToolButtonInline | 表头右侧按钮工具区域内部元素左侧                 |
| HeaderAfter      | 表头下方区域                                     |
| BodyAppend       | 表格之后区域                                     |
| Empty            | 表格无数据时，展示区域                           |
| Expand           | 用于 expand 模式下展示元素（需配合 config 配置） |
| Pagination       | 表格分页组件区域，替换（默认分页组件）           |
| FooterLeft       | 表底左侧区域                                     |
| FooterCenter     | 表底中间区域                                     |

<demo src="./case-slots.vue"></demo>

```typescript
const tableConfig: MStructureV2Type.TableV2[] = [
  { label: "Label-Text", prop: "Text" },
  ...
];
```

## `MStructureV2Type.TableV2`

| 字段       | 描述                     | 类型                                                                  | 类型    |
| ---------- | ------------------------ | --------------------------------------------------------------------- | ------- |
| label      | 表头展示                 | `Record<"en-US" \| "zh-CN", string>` `string`                         | —       |
| prop       | 表头 prop 表 key 字段    | `string`                                                              | —       |
| width      | 表列列宽                 | `string` `number`                                                     | —       |
| isShow     | 是否显示在表格当中       | `boolean`                                                             | `true`  |
| useSort    | 是否使用排序             | `boolean`                                                             | `true`  |
| useFilter  | 是否使用筛选             | `boolean`                                                             | `true`  |
| filterType | 筛选时使用类型           | `"input"` `"number"` `"select"` `"tag"` `"time"`                      | —       |
| fixed      | 表列固定位置             | `"left"` `"right"`                                                    | —       |
| unitText   | 单位文本                 | `string`                                                              | —       |
| textWarp   | 单元格内文字折行依据     | `string`                                                              | —       |
| cellConfig | 单元格使用类型，详细配置 | [CellItemType](/document/SaltedUI_Doc/table/readme.html#cellitemtype) | —       |
| useSenior  | `是否使用高级筛选        | `boolean`                                                             | `true`  |
| useSum     | 是否计入合计内容         | `boolean`                                                             | `false` |

## `CellItemType`

| 描述       | 单元格类型                                                    |
| ---------- | ------------------------------------------------------------- |
| 输入框     | [SaInputType](/document/SaltedUI_Doc/input/readme.html)       |
| 数字输入框 | [SaNumberType](/document/SaltedUI_Doc/number/readme.html)     |
| 选择器     | [SaSelectType](/document/SaltedUI_Doc/select/readme.html)     |
| 联级选择器 | [SaCascaderType](/document/SaltedUI_Doc/cascader/readme.html) |
| 多选       | [SaCheckboxType](/document/SaltedUI_Doc/checkbox/readme.html) |
| 单选       | [SaRadioType](/document/SaltedUI_Doc/radio/readme.html)       |
| 开关       | [SaSwitchType](/document/SaltedUI_Doc/switch/readme.html)     |
| 时间选择器 | [SaTimeType](/document/SaltedUI_Doc/time/readme.html)         |
| 文件选择器 | [SaFileType](/document/SaltedUI_Doc/file/readme.html)         |

## `SaTableType`

| 字段               | 描述                                                                                          | 类型                                                                                              | 默认值  |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------- |
| id                 | 表格 ID                                                                                       | `string`                                                                                          | —       |
| structure          | [MStructureV2Type.TableV2](/document/SaltedUI_Doc/table/readme.html#mstructurev2type-tablev2) | —                                                                                                 | —       |
| useSelect          | 是否使用选择器                                                                                | `boolean`                                                                                         | `false` |
| useRadio           | 是否使用单选器                                                                                | `boolean`                                                                                         | `false` |
| useChildren        | 是否使用子项选择器                                                                            | `boolean`                                                                                         | `false` |
| useExpand          | 是否使用展开行                                                                                | `boolean`                                                                                         | `false` |
| expandAuto         | 是否自动展开行                                                                                | `boolean`                                                                                         | `false` |
| requestApi         | 表格数据来源接口                                                                              | `(params, id) => object[]`                                                                        | —       |
| requestAuto        | 是否自动执行请求                                                                              | `boolean`                                                                                         | `true`  |
| exportApi          | 页面导出按钮触发方法                                                                          | `(params) => object[]`                                                                            | —       |
| rowKey             | 当表格数据多选时，所指定的 `key` 需要保持数据 `唯一`                                          | `string`                                                                                          | —       |
| useToolButton      | 是否显示表格 `刷新 / 筛选` 功能                                                               | `boolean`                                                                                         | `true`  |
| usePagination      | 是否显示分页功能                                                                              | `boolean`                                                                                         | `true`  |
| useExpandAll       | 是否显示展开全部按钮                                                                          | `boolean`                                                                                         | `true`  |
| useSummary         | 是否显示尾部合集行                                                                            | `boolean`                                                                                         | `false` |
| useTableIndex      | 是否显示表格序号                                                                              | `boolean`                                                                                         | `false` |
| useOverflowTooltip | 是否使用文字超出后 Tooltip 提示完整内容                                                       | `boolean`                                                                                         | `true`  |
| embeddedToolButton | 是否显示表格功能按钮嵌入式样式                                                                | `boolean`                                                                                         | `false` |
| exOptions          | 外置筛选依赖                                                                                  | `MOptionV2Type.Default`                                                                           | —       |
| exDependent        | 外置依赖                                                                                      | [SaTableExDependentType](/document/SaltedUI_Doc/table/readme.html#SaTableexdependenttype)         | —       |
| exCellDependent    | 单元格外置依赖                                                                                | [SaTableCellExDependentType](/document/SaltedUI_Doc/table/readme.html#SaTablecellexdependenttype) | —       |
| exPagination       | 外置依赖                                                                                      | [ExPaginationType](/document/SaltedUI_Doc/table/readme.html#expaginationtype-外置页码配置)        | —       |
| summaryConfig      | 自定义合计参数                                                                                | sumText?: string; 合计文字 unitText?: string; // 单位文字                                         | —       |
| summaryFunction    | 自定义合计方法                                                                                | (params: any) => string[]                                                                         | —       |

## `SaTableExDependentType`

| 字段         | 描述               | 类型                                                                                                     |
| ------------ | ------------------ | -------------------------------------------------------------------------------------------------------- |
| disabledRule | 禁用规则           | `{ [x: string]: (value) => boolean }`                                                                    |
| displayRule  | 显示规则           | `{ [x: string]: (value) => boolean }`                                                                    |
| exCellRules  | 单元格外置依赖规则 | `{ [x: string]: Array<{ validator: (rule: any, value: any, callback: any) => void; trigger: string }> }` |

## `SaTableCellExDependentType`

| 字段                  | 描述                   | 类型                                                                           |
| --------------------- | ---------------------- | ------------------------------------------------------------------------------ |
| select_RequestApi     | 选择器请求 Api         | `{ [x: string]: ({ query: string }) => Promise<MOptionV2Type.SelectList> }`    |
| time_disabledDateFn   | 时间选择器禁用日期函数 | `{ [x: string]: (date: any) => boolean }`                                      |
| time_shortcuts        | 时间选择器快捷选项     | `{ [x: string]: DatePickerShortcut[] }`                                        |
| file_attachedData     | 文件上传附带数据       | `{ [x: string]: Record<string, string> }`                                      |
| file_downloadTemplate | 文件下载模板           | `{ [x: string]: () => void }`                                                  |
| tag_click             | 标签点击事件           | `{ [x: string]: (params: { row: SaTableUseType.SaTableInDataType }) => void }` |
| tag_disabled          | 标签禁用函数           | `{ [x: string]: (params: { value: boolean \| number \| string }) => boolean }` |

`ExPaginationType` 外置页码配置

| 字段       | 描述         | 默认值                                      | 类型       |
| ---------- | ------------ | ------------------------------------------- | ---------- |
| pageNum    | 当前页数     | `1`                                         | `number`   |
| pageSize   | 每页条数     | `30`                                        | `number`   |
| pageSizes  | 条数选择范围 | `[20, 50, 100, 150]`                        | `number[]` |
| layout     | 页码功能范围 | `"total, sizes, prev, pager, next, jumper"` | `string`   |
| pagerCount | 页数拆分数量 | `5`                                         | `number`   |

## `SaTableEvents`

| 字段               | 描述                         | 回调                                                                               |
| ------------------ | ---------------------------- | ---------------------------------------------------------------------------------- |
| onSelectRowBack    | 多选框点击回调               | `(params: { isSelected: boolean; row: any; parentRow: any }) => void`              |
| onSelectRowAllBack | 多选框全选点击回调           | `(params: { isSelected: boolean }) => void`                                        |
| onRadioRowBack     | 单选框点击回调               | `(params: { isSelected: boolean; row: any; parentRow: any }) => void`              |
| onExpandRowBack    | Expand 展开按钮点击回调      | `(params: { index: number; row: Record<string, string>; state: boolean }) => void` |
| onExpandRowAllBack | Expand 展开全部按钮点击回调  | `(state: boolean) => void`                                                         |
| onRenderEnd        | 表格渲染完成回调             | `(getTableList: (params?: Record<string, string>) => Promise<any>) => void`        |
| onTableCellChange  | 当单元格变化时调用的回调方法 | `({prop, value, oldValue, option}) => void`                                        |

## `DefineExpose`

```typescript
const proTable = ref();
async function RefreshTable() {
  await proTable.value.getTableList(); // [!code warning]
}
```

| 方法名称           | 描述                                         | 请求参数                                                             |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------- |
| getTableList       | 获取表数据，调用 request-api 提供的方法      | `null`                                                               |
| cleanTableData     | 清除表格数据                                 | `null`                                                               |
| getSubmitTableList | 获取提交表格用数据（校验表格数据并获取数据） | `null`                                                               |
| getTableData       | 获取表格内数据                               | `null`                                                               |
| setStructure_All   | 设置表格所有结构                             | `(structure: Array<SaTableItemType & SaTableUseItemType>) => void`   |
| setStructure_Item  | 设置表格单个结构                             | `(prop: string, item: SaTableItemType & SaTableUseItemType) => void` |
| changeData_All     | 设置表格所有数据                             | `(data: Array<SaTableUseType.SaTableInDataType>) => void`            |
| changeData_Item    | 设置表格单个数据                             | `(prop: string, value: SaTableUseType.SaTableInDataType) => void`    |
