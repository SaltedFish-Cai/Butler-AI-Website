/**
 * @module pa-pagination/types
 * @description PaPagination 类型定义
 */
/**
 * 组件属性定义
 * @description 分页器组件的属性类型
 */
/**
 * 组件属性
 * @type object
 * @description PaPagination 组件的属性类型定义
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
  /**
   * 当前页码
   * @type number | undefined
   * @default 1
   * @description 分页器当前显示的页码
   */
  currentPage?: number;
  /**
   * 每页显示数量
   * @type number | undefined
   * @default 10
   * @description 每页显示的数据条数
   */
  pageSize?: number;
  /**
   * 总条数
   * @type number
   * @description 数据总条数，用于计算总页数
   */
  total: number;
  /**
   * 每页数量选择器选项
   * @type Array<number> | undefined
   * @default [10, 20, 30, 40, 50, 100]
   * @description 每页显示数量选择器的选项列表
   */
  pageSizes?: Array<number>;
  /**
   * 页码按钮数量
   * @type number | undefined
   * @default 3
   * @description 显示的页码按钮数量
   */
  pagerCount?: number;
  /**
   * 是否添加背景色
   * @type boolean | undefined
   * @default false
   * @description 是否为分页按钮添加背景色
   */
  background?: boolean;
  /**
   * 组件布局
   * @type string | undefined
   * @default 'total, sizes, prev, pager, next, jumper'
   * @description 组件布局，子组件名用逗号分隔
   */
  layout?: string;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default false
   * @description 是否禁用分页器
   */
  disabled?: boolean;
};
/**
 * 组件事件类型
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 更新当前页码
   * @param page - 新的页码
   * @description 当前页码变化时触发
   */
  (e: "update:currentPage", page: number): void;
  /**
   * 更新每页数量
   * @param size - 新的每页数量
   * @description 每页显示数量变化时触发
   */
  (e: "update:pageSize", size: number): void;
  /**
   * 每页数量变化
   * @param size - 新的每页数量
   * @description 每页显示数量变化时触发
   */
  (e: "size-change", size: number): void;
  /**
   * 当前页变化
   * @param currentPage - 新的当前页
   * @description 当前页码变化时触发
   */
  (e: "current-change", currentPage: number): void;
  /**
   * 最大页数变化
   * @param maxPage - 最大页数
   * @description 最大页数变化时触发
   */
  (e: "change-max-page", maxPage: number): void;
  /**
   * 点击上一页
   * @param currentPage - 当前页码
   * @description 点击上一页按钮时触发
   */
  (e: "prev-click", currentPage: number): void;
  /**
   * 点击下一页
   * @param currentPage - 当前页码
   * @description 点击下一页按钮时触发
   */
  (e: "next-click", currentPage: number): void;
};
