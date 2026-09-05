import { LanguagePackageType } from "../manager-type";

/**
 * 菜单项配置
 * @description 定义菜单项的数据结构
 */
export type MenuItemConfig = {
  /**
   * 菜单项文本
   * @type LanguagePackageType | string
   * @description 菜单项显示文本，支持多语言对象 { 'zh-CN': '编辑', 'en-US': 'Edit' }
   */
  label: LanguagePackageType | string;
  /**
   * 图标名称
   * @type string | undefined
   * @default undefined
   * @description 图标名称，如 "butler-edit_line"
   */
  icon?: string;
  /**
   * 是否危险操作
   * @type boolean | undefined
   * @default false
   * @description 危险操作项（如删除）使用红色样式
   */
  danger?: boolean;
  /**
   * 是否显示分割线
   * @type boolean | undefined
   * @default false
   * @description 在该菜单项上方显示分割线
   */
  divided?: boolean;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default false
   * @description 是否禁用该菜单项
   */
  disabled?: boolean;
  /**
   * 命令标识
   * @type string | number | undefined
   * @default undefined
   * @description 选中菜单项时通过 @select 事件返回的唯一标识，用于区分不同操作
   */
  command?: number | string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   */
  style?: Record<string, string>;
};

/**
 * 组件属性
 * @type {ComponentProps}
 * @description 右键菜单组件的属性类型
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
   * render-id
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  renderId?: string;
  /**
   * 是否可见
   * @type boolean
   * @default false
   * @description 控制菜单显示/隐藏
   */
  visible: boolean;
  /**
   * 触发事件
   * @type MouseEvent | undefined
   * @default undefined
   * @description 右键触发事件，组件从此事件提取 clientX/clientY 自行计算菜单位置
   */
  triggerEvent?: MouseEvent | null;
  /**
   * 右键遮罩层时是否自动关闭菜单
   * @type boolean
   * @default true
   * @description 设为 false 时，右键遮罩层不会自动关闭菜单，仅触发 backdrop-contextmenu 事件，由父组件自行处理（可实现无缝切换）
   */
  closeOnBackdropContextmenu?: boolean;
  /**
   * 指示点位置
   * @type boolean | string | undefined
   * @default false
   * @description 在菜单边缘显示装饰性圆点。true 或 "tl" 为左上，"tr" 为右上，"bl" 为左下，"br" 为右下
   */
  point?: boolean | "bl" | "br" | "tl" | "tr";
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   */
  style?: Record<string, string>;
};

/**
 * 组件事件定义
 * @type {ComponentEmits}
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 关闭事件
   * @description 点击菜单项或点击外部时触发
   */
  (e: "close"): void;
  /**
   * 遮罩层右键事件
   * @description 右键遮罩层时触发，返回鼠标事件和下方元素信息，父组件可用于实现无缝切换
   */
  (e: "backdrop-contextmenu", payload: { event: MouseEvent; target: Element | null }): void;
  /**
   * 选中事件
   * @description 子菜单中的叶子节点被点击时触发，返回选中的菜单项配置
   */
  (e: "select", item: MenuItemConfig): void;
};

/**
 * 菜单项组件属性
 * @type {ItemComponentProps}
 * @description 菜单项组件的属性类型
 */
export type ItemComponentProps = {
  /**
   * 菜单项文本
   * @type LanguagePackageType | string
   * @description 菜单项显示文本，支持多语言对象 { 'zh-CN': '编辑', 'en-US': 'Edit' }
   */
  label: LanguagePackageType | string;
  /**
   * 图标名称
   * @type string | undefined
   * @default undefined
   * @description 图标名称，如 "butler-edit_line"
   */
  icon?: string;
  /**
   * 是否危险操作
   * @type boolean | undefined
   * @default false
   * @description 危险操作项（如删除）使用红色样式
   */
  danger?: boolean;
  /**
   * 是否显示分割线
   * @type boolean | undefined
   * @default false
   * @description 在该菜单项上方显示分割线
   */
  divided?: boolean;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default false
   * @description 是否禁用该菜单项
   */
  disabled?: boolean;
  /**
   * 命令标识
   * @type string | number | undefined
   * @default undefined
   * @description 选中菜单项时通过 @select 事件返回的唯一标识
   */
  command?: number | string;
  /**
   * 子菜单触发方式
   * @type "click" | "hover"
   * @default "click"
   * @description "click"：点击展开子菜单；"hover"：鼠标悬停展开子菜单
   */
  subMenuTrigger?: "click" | "hover";
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   */
  style?: Record<string, string>;
};

/**
 * 菜单项组件事件
 * @type {ItemComponentEmits}
 * @description 定义菜单项可触发的事件
 */
export type ItemComponentEmits = {
  /**
   * 点击事件
   * @description 点击菜单项时触发
   */
  (e: "click"): void;
};

/**
 * 菜单上下文（provide/inject）
 * @type {MenuContext}
 * @description 用于子菜单与根菜单之间的通信，传递关闭和选中事件
 */
export type MenuContext = {
  /** 关闭所有菜单 */
  closeAll: () => void;
  /** 选中菜单项 */
  onSelect: (item: MenuItemConfig) => void;
  /** 重置子菜单打开状态（菜单关闭时调用） */
  resetActiveSubMenu?: () => void;
};

/**
 * 同级子菜单协调上下文
 * @type {MenuGroupContext}
 * @description 用于同一级菜单项之间协调哪个子菜单处于打开状态。
 *              点击模式下，点击一个项打开其子菜单时通知同级关闭各自的子菜单。
 */
export type MenuGroupContext = {
  /** 当前处于打开状态的子菜单项 ID（null 表示无打开的子菜单） */
  activeSubMenuId: { value: symbol | null };
  /** 通知同级：某个菜单项被点击打开子菜单 */
  notifyClick: (id: symbol) => void;
};
