import { MOptionV2Type } from "../manager-type";
import { MCellItemV2Type } from "../cell";
import { DatePickerShortcut } from "../m-time-v2/type";
import { MFormV2ChildType } from "../m-form-v2/type";

export type MTableV2ExDependentType = {
  disabledRule?: { [x: string]: (value) => boolean };
  displayRule?: { [x: string]: (value) => boolean };
  exCellRules?: { [x: string]: Array<{ validator: (rule: any, value: any, callback: any) => void; trigger: string }> };
};

type languageKey = "en-US" | "zh-CN";

export type MTableV2CellExDependentType = {
  /**
   * **选择器请求Api**
   * @type `(params: { query: string }) => Promise<MOptionV2Type.SelectList>`
   * @description 当设 cellConfig.type=='select' 时，会使用该值作为选择器请求Api
   * */
  select_RequestApi?: { [x: string]: ({ query: string }) => Promise<MOptionV2Type.SelectList> };
  /**
   * **时间选择器禁用日期函数**
   * @type `(date: any) => boolean`
   * @description 当设 cellConfig.type=='time' 时，会使用该值作为时间选择器禁用日期函数
   * */
  time_disabledDateFn?: { [x: string]: (date: any) => boolean };
  /**
   * **时间选择器快捷选项**
   * @type `DatePickerShortcut[]`
   * @description 当设 cellConfig.type=='time' 时，会使用该值作为时间选择器快捷选项
   * */
  time_shortcuts?: { [x: string]: DatePickerShortcut[] };
  /**
   * **文件上传附带数据**
   * @type `(params: { file: File }) => Promise<any>`
   * @description 当设 cellConfig.type=='file' 时，会使用该值作为文件上传附带数据
   * */
  file_attachedData?: { [x: string]: Record<string, string> };

  /**
   * **文件下载模板**
   * @type `() => void`
   * @description 当设 cellConfig.type=='file' 时，会使用该值作为文件下载模板
   * */
  file_downloadTemplate?: { [x: string]: () => void };

  /**
   * **标签点击事件**
   * @type `(params: { row: Record<string, string> }) => void`
   * @description 当设 cellConfig.type=='tag' 时，会使用该值作为标签点击事件
   * */
  tag_click?: { [x: string]: (params: { row: MTableV2UseType.MTableV2InDataType }) => void };

  /**
   * **标签禁用函数**
   * @type `(params: { value: boolean | number | string }) => boolean`
   * @description 当设 cellConfig.type=='tag' 时，会使用该值作为标签禁用函数
   * */
  tag_disabled?: { [x: string]: (params: { value: boolean | number | string }) => boolean };
};

export interface MTableV2Type {
  /**
   * **多表时唯一ID**
   * @type `string`
   * @description 当设置该值时，会使用该值作为唯一ID
   * @example
   * ```ts
   * <m-table id="table1" :structure="structure" :requestApi="requestApi"></m-table>
   * ```
   * */
  id: string;

  /**
   * **自定义类名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  class?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **表格结构**
   * @type `Array<MStructureType.Table>`
   * @description 当设置该值时，会使用该值作为表格结构
   * @example
   * ```ts
   * <m-table :structure="structure" :requestApi="requestApi"></m-table>
   * ```
   * */
  structure: Array<MTableV2ItemType>;

  /**
   * **是否使用选择器**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用选择器
   * @description 当设置该值为 `false` 时，不会使用选择器
   * @example
   * ```ts
   * <m-table :useSelect="true"></m-table>
   * ```
   * */
  useSelect?: boolean;

  /**
   * **是否使用单选器**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用单选器
   * @description 当设置该值为 `false` 时，不会使用单选器
   * @example
   * ```ts
   * <m-table :useRadio="true"></m-table>
   * ```
   * */
  useRadio?: boolean;

  /**
   * **是否使用子表**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用子表
   * @description 当设置该值为 `false` 时，不会使用子表
   * @example
   * ```ts
   * <m-table :useChildren="true"></m-table>
   * ```
   * */
  useChildren?: boolean;

  /**
   * **是否使用展开行**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用展开行
   * @description 当设置该值为 `false` 时，不会使用展开行
   * @example
   * ```ts
   * <m-table :useExpand="true"></m-table>
   * ```
   * */
  useExpand?: boolean;

  /**
   * **请求表格数据的Api**
   * @type `(params: any, id?: string) => Promise<any> | any`
   * @param `params` 请求参数
   * @param `id` 表格的唯一ID
   * @returns `Promise<any> | any`
   * @description 当设置该值时，会使用该值作为请求表格数据的Api
   * @example
   * ```ts
   * <m-table :requestApi="requestApi"></m-table>
   * ```
   * */
  requestApi: (params: any, id?: string) => Promise<any> | any;

  /**
   * **否自动执行请求**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会自动执行请求
   * @description 当设置该值为 `false` 时，不会自动执行请求
   * @example
   * ```ts
   * <m-table :requestAuto="true"></m-table>
   * ```
   * */
  requestAuto?: boolean;

  /**
   * **是否直接打开Expand**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会直接打开Expand
   * @description 当设置该值为 `false` 时，不会直接打开Expand
   * @example
   * ```ts
   * <m-table :expandAuto="true"></m-table>
   * ```
   * */
  expandAuto?: boolean;

  /**
   * **行数据的 Key**
   * @type `string`
   * @default `id`
   * @description 当设置该值时，会使用该值作为行数据的 Key
   * @example
   * ```ts
   * <m-table rowKey="id"></m-table>
   * ```
   * */
  rowKey?: string;

  /**
   * **是否显示表格功能按钮**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示表格功能按钮
   * @description 当设置该值为 `false` 时，不会显示表格功能按钮
   * @example
   * ```ts
   * <m-table :useToolButton="true"></m-table>
   * ```
   * */
  useToolButton?: boolean;

  /**
   * **是否需要分页组件**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会需要分页组件
   * @description 当设置该值为 `false` 时，不会需要分页组件
   * @example
   * ```ts
   * <m-table :usePagination="true"></m-table>
   * ```
   * */
  usePagination?: boolean;

  /**
   * **是否显示展开全部按钮**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示展开全部按钮
   * @description 当设置该值为 `false` 时，不会显示展开全部按钮
   * @example
   * ```ts
   * <m-table :useExpandAll="true"></m-table>
   * ```
   * */
  useExpandAll?: boolean;

  /**
   * **是否显示尾行合计**
   * @type `boolean`
   * @default `false`
   * @description `此项开启时，usePagination 必须为 false`
   * @description 当设置该值为 `true` 时，会显示尾行合计
   * @description 当设置该值为 `false` 时，不会显示尾行合计
   * @example
   * ```ts
   * <m-table :useSummary="true"></m-table>
   * ```
   * */
  useSummary?: boolean;

  /**
   * **是否显示表格序号**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示表格序号
   * @description 当设置该值为 `false` 时，不会显示表格序号
   * @example
   * ```ts
   * <m-table :useTableIndex="true"></m-table>
   * ```
   * */
  useTableIndex?: boolean;

  /**
   * **是否使用超出格子使用**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会使用超出格子使用
   * @description 当设置该值为 `false` 时，不会使用超出格子使用
   * @example
   * ```ts
   * <m-table :useOverflowTooltip="true"></m-table>
   * ```
   * */
  useOverflowTooltip?: boolean;

  /**
   * **是否显示表格功能按钮嵌入式样式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示表格功能按钮嵌入式样式
   * @description 当设置该值为 `false` 时，不会显示表格功能按钮嵌入式样式
   * @example
   * ```ts
   * <m-table :embeddedToolButton="true"></m-table>
   * ```
   * */
  embeddedToolButton?: boolean;

  /**
   * **外置选择框选项**
   * @type `MOptionV2Type.Default`
   * @description 当设置该值时，会使用该值作为外置选择框选项
   * @example
   * ```ts
   * <m-table :exOptions="exOptions"></m-table>
   * ```
   * */
  exOptions?: MOptionV2Type.Default;

  /**
   * **表格额外依赖**
   * @type `MTableV2ExDependentType`
   * @description 当设置该值时，会使用该值作为请求时额外数据
   * @example
   * ```ts
   * <m-table :exDependent="exDependent"></m-table>
   * ```
   * */
  exDependent?: MTableV2ExDependentType;

  /**
   * **单元格额外依赖**
   * @type `MTableV2CellExDependentType`
   * @type `MTableV2CellExDependentType.select_RequestApi` 为 `(params: { query: string }) => Promise<MOptionV2Type.SelectList>`
   * @type `MTableV2CellExDependentType.file_attachedData` 为 `{ [x: string]: Record<string, string> }`
   * @type `MTableV2CellExDependentType.time_disabledDateFn` 为 `(date: any) => boolean`
   * @type `MTableV2CellExDependentType.time_shortcuts` 为 `DatePickerShortcut[]`
   * @description 当设置该值时，会使用该值作为单元格额外依赖
   * @example
   * ```ts
   * <m-table :exCellDependent="exCellDependent"></m-table>
   * ```
   * */
  exCellDependent?: MTableV2CellExDependentType;

  /**
   * **外置分页配置**
   * @type `exPaginationType`
   * @type `exPaginationType.PageNum` 为 `number`
   * @type `exPaginationType.PageSize` 为 `number`
   * @type `exPaginationType.pageSizes` 为 `number[]`
   * @type `exPaginationType.layout` 为 `string`
   * @type `exPaginationType.pagerCount` 为 `number`
   * @description 当设置该值时，会使用该值作为外置分页配置
   * @example
   * ```ts
   * <m-table :exPagination="exPagination"></m-table>
   * ```
   * */
  exPagination?: {
    PageNum?: number;
    PageSize?: number;
    pageSizes?: number[];
    layout?: string;
    pagerCount?: number;
  };

  /**
   * **下载按钮请求接口**
   * @type `(params: any) => Promise<any> | any`
   * @param `params` 请求参数
   * @returns `Promise<any> | any`
   * @description 当设置该值时，会使用该值作为下载按钮请求接口
   * @example
   * ```ts
   * <m-table :exportApi="exportApi"></m-table>
   * ```
   * */
  exportApi?: (params: any) => Promise<any> | any;

  /**
   * **过滤 `选择表状态下` 可选择数据**
   * @type `(params: any) => Promise<any> | any`
   * @param `params` 请求参数
   * @returns `Promise<any> | any`
   * @description 当设置该值时，会使用该值作为过滤 `选择表状态下` 可选择数据
   * @example
   * ```ts
   * <m-table :filterSelectRow="filterSelectRow"></m-table>
   * ```
   * */
  filterSelectRow?: (params: any) => Promise<any> | any;

  /**
   * **纯展示模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @example
   * ```ts
   * <m-table :display="true"></m-table>
   * ```
   * */
  display?: boolean;

  /**
   * **合计参数**
   * @type `summaryConfigType`
   * @type `summaryConfigType.sumText` 为 `string`
   * @type `summaryConfigType.unitText` 为 `string`
   * @description 当设置该值时，会使用该值作为合计参数
   * @example
   * ```ts
   * <m-table :summaryConfig="summaryConfig"></m-table>
   * ```
   * */
  summaryConfig?: {
    sumText?: string;
    unitText?: string;
  };

  /**
   * **自定义合计方法**
   * @type `(params: any) => any`
   * @param `params` 请求参数
   * @returns `string[]`
   * @description 当设置该值时，会使用该值作为自定义合计方法
   * @example
   * ```ts
   * <m-table :summaryFunction="summaryFunction"></m-table>
   * ```
   * */
  summaryFunction?: (params: any) => string[];

  /**
   * **是否使用粘性表头**
   * @type `ElementRef<HTMLDivElement> | false`
   * @default `ElementRef<HTMLDivElement>`
   * @description 当设置该值为 `ElementRef<HTMLDivElement>` 时，会使用粘性表头
   * @description 当设置该值为 `false` 时，不会使用粘性表头
   * @example
   * ```ts
   * <m-table :useSticky="Ref<HTMLDivElement>"></m-table>
   * ```
   * */
  useSticky?: Element | false;

  /**
   * **选择表格行回调**
   * @type `(selected: Record<string, string>[], row: Record<string, string>) => void`
   * @param `selected` 已选择的行数据
   * @param `row` 为当前行数据
   * @returns `void`
   * @description 当选择表格行时，会触发该回调
   * @example
   * ```ts
   * <m-table :onSelectRowBack="onSelectRowBack"></m-table>
   * ```
   * */
  onSelectRowBack?: ({ selected, row }: { isSelected: boolean; row: any; parentRow: any }) => void;

  /**
   * **选择表格全选按钮回调**
   * @type `(value: boolean, selection: Record<string, string>[], allValue: boolean, allSelection: Record<string, string>[]) => void`
   * @param `value` 当前页是否被全选
   * @param `selection` 当前页被全选数据
   * @param `allValue` 全部页是否被全选
   * @param `allSelection` 全部页被全选数据
   * @returns `void`
   * @description 当选择表格全选按钮时，会触发该回调
   * @example
   * ```ts
   * <m-table :onSelectRowAllBack="onSelectRowAllBack"></m-table>
   * ```
   * */
  onSelectRowAllBack?: (params: { isSelected: boolean }) => void;

  /**
   * **选择表格行回调**
   * @type `(selected: Record<string, string>[], row: Record<string, string>) => void`
   * @param `selected` 已选择的行数据
   * @param `row` 为当前行数据
   * @returns `void`
   * @description 当选择表格行时，会触发该回调
   * @example
   * ```ts
   * <m-table :onRadioRowBack="onRadioRowBack"></m-table>
   * ```
   * */
  onRadioRowBack?: ({ selected, row }: { isSelected: boolean; row: any; parentRow: any }) => void;

  /**
   * **打开/关闭表格行子数据回调**
   * @type `(index: number, row: Record<string, string>, state: boolean) => void`
   * @param `index` 为当前行索引
   * @param `row` 为当前行数据
   * @param `state` 为当前行打开状态
   * @returns `void`
   * @description 当打开/关闭表格行子数据时，会触发该回调
   * @example
   * ```ts
   * <m-table :onExpandRowBack="onExpandRowBack"></m-table>
   * ```
   * */
  onExpandRowBack?: ({ index, row, state }: { index: number; row: Record<string, string>; state: boolean }) => void;

  /**
   * **打开/关闭全部表格行子数据按钮回调**
   * @type `(state: boolean) => void`
   * @param `state` 是否打开全部表格行子数据
   * @returns `void`
   * @description 当打开/关闭全部表格行子数据按钮时，会触发该回调
   * @example
   * ```ts
   * <m-table :onExpandRowAllBack="onExpandRowAllBack"></m-table>
   * ```
   * */
  onExpandRowAllBack?: (state: boolean) => void;

  /**
   * **首次渲染完成后回调**
   * @type `(getTableList: (params?: paramsType) => Promise<any>) => void`
   * @param `getTableList` 为获取表格数据方法
   * @returns `void`
   * @description 当首次渲染完成后回调时，会触发该回调
   * @example
   * ```ts
   * <m-table :onRenderEnd="onRenderEnd"></m-table>
   * ```
   * */
  onRenderEnd?: (getTableList: (params?: Record<string, string>) => Promise<any>) => void;

  getTableList: (params?: Record<string, string>) => Promise<any>;

  /**
   * **单元格变化回调**
   * @type `({prop, value, oldValue, option}) => void`
   * @param `prop` 为当前单元格属性
   * @param `value` 为当前单元格值
   * @param `oldValue` 为当前单元格旧值
   * @param `option` 为当前单元格选项
   * @returns `void`
   * @description 当单元格变化时，会触发该回调
   * @example
   * ```ts
   * <m-table :onTableCellChange="onTableCellChange"></m-table>
   * ```
   * */
  onTableCellChange?: ({ prop, value, oldValue, option }: { prop: string; value: any; oldValue: any; option: any }) => void;
}

export type TypeProps = "index" | "radio" | "row" | "selection";

export type SearchType =
  | "cascader"
  | "date-picker"
  | "input-number"
  | "input"
  | "select-v2"
  | "select"
  | "slider"
  | "switch"
  | "time-picker"
  | "time-select"
  | "tree-select";

export type CellConfigType = MCellItemV2Type & {
  required?: boolean;
};

export type MTableV2ItemType = {
  /**
   * **表单唯一Key**
   * @type `string`
   * @description
   * - 该属性为表单唯一Key
   * - 当设置该值为 `string` 时，会使用该值作为表单唯一Key
   * */
  prop?: string;

  /**
   * **单元格基础类型**
   * @type `"index" | "radio" | "row" | "selection"`
   * @description
   * - 当设置该值为 `index` 时，会使用索引列
   * - 当设置该值为 `radio` 时，会使用单选列
   * - 当设置该值为 `row` 时，会使用行数据列
   * - 当设置该值为 `selection` 时，会使用选择列
   * */
  type?: TypeProps;

  /**
   * **表单项标题**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标题
   * */
  label?: Record<languageKey, string> | string;

  /**
   * **固定宽度**
   * @type `number | string`
   * @description 当设置该值为 `number | string` 时，会使用该值作为宽度
   * */
  width?: number | string;

  /**
   * **是否显示在表格当中**
   * @type `boolean`
   * @default `true`
   * @description
   * - 当设置该值为 `true` 时，会显示在表格当中
   * - 当设置该值为 `false` 时，不会显示在表格当中
   * */
  isShow?: boolean;

  /**
   * **是否使用排序**
   * @type `boolean`
   * @default `true`
   * @description
   * - 当设置该值为 `true` 时，会使用排序
   * - 当设置该值为 `false` 时，不会使用排序
   * */
  useSort?: boolean;

  /**
   * **是否使用筛选**
   * @type `boolean`
   * @default `true`
   * @description
   * - 当设置该值为 `true` 时，会使用筛选
   * - 当设置该值为 `false` 时，不会使用筛选
   * */
  useFilter?: boolean; // 是否使用筛选

  /**
   * **筛选类型**
   * @type `string`
   * @default `input`
   * @description 筛选类型
   * - 当设置该值为 `input` 时，会使用 `input` 类型的筛选
   * - 当设置该值为 `number` 时，会使用 `number` 类型的筛选
   * - 当设置该值为 `select` 时，会使用 `select` 类型的筛选
   * - 当设置该值为 `time` 时，会使用 `time` 类型的筛选
   * */
  filterType?: "input" | "number" | "select" | "tag" | "time";

  /**
   * **固定类型**
   * @type `"left" | "right" ｜ undefined`
   * @description
   * - 当设置该值为 `left` 时，会固定在左侧
   * - 当设置该值为 `right` 时，会固定在右侧
   * - 当设置该值为 `undefined` 时，不会固定
   * */
  fixed?: "left" | "right";

  /**
   * **单位文本**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为单位文本
   * */
  unitText?: string;

  /**
   * **单元格是否进行拆分折行**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为单元格是否进行拆分折行
   * */
  textWarp?: string;

  /**
   * **单元格配置**
   * @type `MFormV2ChildType`
   * @description 当设置该值为 `MFormV2ChildType` 时，会使用该值作为单元格配置
   * */
  cellConfig?: MFormV2ChildType;

  /**
   * **列是否使用合计**
   * @type `boolean`
   * @default `true`
   * @description
   * - 当设置该值为 `true` 时，会使用合计
   * - 当设置该值为 `false` 时，不会使用合计
   * */
  useSum?: boolean;

  /**
   * **是否使用高级搜索**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用高级搜索
   * - 当设置该值为 `false` 时，不会使用高级搜索
   * */
  useSenior?: boolean;
};

export type MTableV2UseItemType = MTableV2ItemType & {
  label?: string;
  /**
   * **最小宽度（当元素为flex宽元素时使用）**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为最小宽度
   * */
  minWidth?: string;
  fixedValue?: string;
  fixedValueIndex?: number;
  lastLeftFixed?: boolean;
  lastRightFixed?: boolean;
  /**
   * **用户默认设置原始基础宽度**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为基础宽度
   * */
  baseWidth?: string;
  /**
   * **搜索值**
   * @type `string`
   * @description 当设置该值为 `string` 时，会使用该值作为搜索值
   * */
  searchCriteria?: string[] | string;

  /**
   * **是否使用高级搜索**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用高级搜索
   * - 当设置该值为 `false` 时，不会使用高级搜索
   * */
  useSeniorFilter?: boolean;
};

export namespace MTableV2UseType {
  export interface Pageable {
    PageNum?: number;
    PageSize?: number;
    pageSizes?: number[];
    total: number;
  }
  export interface TableStateProps {
    tableData: any[];
    flatTableData: any[];
    pageable: Pageable;
    searchParam: {
      [key: string]: any;
    };
    searchInitParam: {
      [key: string]: any;
    };
    totalParam: {
      [key: string]: any;
    };
    icon?: {
      [key: string]: any;
    };
    tableQuery: {
      [key: string]: any;
    };

    tableLoadStatus: boolean;

    useSelectionTable: boolean;

    useOrderPropName: string;
  }

  export type SortValue = "ascending" | "descending" | null;

  export type RelationshipGroupType = {
    groupName: string;
    group: Array<{
      fieldValue: string;
      conditionalType: 0 | 1 | 3 | 5 | 6 | 11;
      key: string;
    }>;
    groupLinkType: string;
  };

  export type AdvancedFilterType = {
    fieldName: string;
    relationshipGroupLinkType: string;
    relationshipGroup: Array<relationshipGroupType>;
    label: string;
    props: string;
  };

  /**
   * **表格查询参数**
   */
  export type TableQueryType = {
    Filter?: Array<FilterType>;
    AdvancedFilter?: Array<AdvancedFilterType>;
    Page?: { PageNum?: number; PageSize?: number };
    Params?: {};
    Sort?: Array<{ SortKey: string; SortValue: SortValue }>;
  };

  type allType = Array<boolean | number | string> | boolean | number | string | null | undefined;

  export type dataType = Array<MTableV2InDataType>;

  export type MTableV2InDataType = {
    parentRenderIndex: number;
    rowIndex: number;
    renderIndex: number;
    isOpenChild?: boolean;
    isSelected?: boolean;
    isIndeterminate?: boolean;
    children?: dataType;
    type?: string;
    name?: string;
    errorList?: Record<string, string>;
  };

  /**
   * 内部状态
   */
  export type TableStateType = {
    /**
     * **表格数据（原始数据）**
     * @type `Record<string, string>[]`
     * @description 表格数据
     * */
    tableData: Array<dataType>;

    /**
     * **表格数据（扁平化数据）**
     * @type `Record<string, string | number>[]`
     * @description 表格数据
     * */
    flatTableData: Array<Record<string, allType>>;
    /**
     * **选中的表格数据的 key 列表**
     * @type `{ [key: string]: string[] }`
     * @description 选中的表格数据的 key 列表
     * */
    selectTableData: Array<MTableV2InDataType>;
    /**
     * **表格数据（汇总数据）**
     * @type `(string | number)[]`
     * @description 表格数据
     * */
    summaryData: Array<number | string>;
    /**
     * **当前页码**
     * @type `number`
     * @description 当前页码
     * */
    PageNum: number;
    /**
     * **最大页码**
     * @type `number`
     * @description 最大页码
     * */
    maxPage: number;
    /**
     * **分页数据（接口使用）**
     * @type `Pageable`
     * @description 分页数据
     * */
    pageable: {
      PageNum: number;
      PageSize: number;
      pageSizes: number[];
      total: number;
    };
    /**
     * **查询参数（接口使用）**
     * @type `TableQueryType`
     * @description 查询参数
     */
    tableQuery: TableQueryType;
    /**
     * **是否设置单元格宽度中**
     * @type `boolean`
     * @description 当设置该值为 `true` 时，会设置单元格宽度中
     * */
    setCellWidthIng: boolean;
    /**
     * **表格加载状态**
     * @type `boolean`
     * @description 表格加载状态
     */
    tableLoadStatus: boolean;
    /**
     * **表格加载结束状态**
     * @type `boolean`
     * @description 表格加载结束状态
     */
    tableLoadEndStatus: boolean;
    /**
     * **排序使用字段**
     * @type `string`
     * @description 排序字段
     */
    useOrderPropName: string;
    /**
     * **是否展开行**
     * @type `boolean`
     * @description 当设置该值为 `true` 时，会展开行
     * */
    isRowOpenStatus: boolean;

    /**
     * **是否展示选择列表**
     * @type `boolean`
     * @description 当设置该值为 `true` 时，会展示选择列表
     * */
    showSelectList: boolean;

    /**
     * **悬停行索引**
     * @type `number`
     * @description 悬停行索引
     */
    hoveredRowIndex: number;

    /**
     * **悬停列索引**
     * @type `number`
     * @description 悬停列索引
     */
    hoveredColumnIndex: number;

    /**
     * **是否打开监听单元格是否进入视窗状态**
     * @type `boolean`
     * @description 当设置该值为 `true` 时，会监听单元格是否进入视窗
     */
    listenCellInViewIng: boolean;

    /**
     * **旧页码索引**
     * @type `number`
     * @description 旧页码索引
     */
    oldPageIndex: number;

    /**
     * **是否使用平均宽度**
     * @type `boolean`
     * @description 当设置该值为 `true` 时，会使用平均宽度
     */
    useAverageWidth: -1 | 0 | 1;

    /**
     * **校验规则**
     * @type `Record<string, any[]>`
     * @description 校验规则
     */
    inRules: Record<string, any[]>;
  };

  export type FilterType = {
    fieldName?: string;
    conditionalType?: 0 | 1 | 3 | 5 | 6 | 11;
    fieldValue?: Array<string> | string;
  };
}
