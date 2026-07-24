/**
 * 组件属性定义
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   */
  style?: Record<string, string>;
  /**
   * 表格列定义
   * @type Array<ColumnDef>
   */
  columns: Array<ColumnDef>;
  /**
   * 表格数据
   * @type Array<Record<string, any>>
   */
  data: Array<Record<string, any>>;
  /**
   * 表格标题
   * @type string | undefined
   */
  title?: string;
  /**
   * 行高
   * @type number | undefined
   * @default 78
   */
  rowHeight?: number;
  /**
   * 是否为卡片模式
   * @type boolean | undefined
   * @default false
   */
  card?: boolean;
};

/**
 * 组件事件定义
 */
export type ComponentEmits = {
  /**
   * 行点击事件
   * @param row - 点击的行数据
   */
  (e: "rowClick", row: Record<string, any>): void;
};

/**
 * 表格列定义
 */
export interface ColumnDef {
  /**
   * 列字段名
   * @type string
   */
  key: string;
  /**
   * 列表头文本
   * @type string
   */
  label: string;
  /**
   * 自定义插槽名
   * @type string | undefined
   */
  slot?: string;
  /**
   * 最大显示子元素数量，超出部分显示 "+N"
   * @type number | undefined
   */
  maxChild?: number;
  /**
   * 列宽度（px），未设置时自动测量
   * @type number | undefined
   */
  width?: number;
}
