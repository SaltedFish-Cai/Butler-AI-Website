import { MessageBoxOptions } from "@/package/components/sa-message-box/type";

export type SaButtonType = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * @description 该值的类型为 `string`，可以是任意类型，但是建议不要重复
   * */
  id?: string;

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
   * **内置样式**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 可选值为  `add` | `cancel` | `check` | `download` | `edit` | `export` | `file` | `go` | `import` | `ok` | `refresh` | `remove` | `save` | `search` | `submit` | `switch` | `sync` | `time` | `trash` | `upload` | `view` | `more`
   * */
  is?:
    | "add"
    | "cancel"
    | "check"
    | "download"
    | "edit"
    | "export"
    | "file"
    | "go"
    | "import"
    | "more"
    | "ok"
    | "refresh"
    | "remove"
    | "save"
    | "search"
    | "submit"
    | "switch"
    | "sync"
    | "time"
    | "trash"
    | "upload"
    | "view";

  /**
   * **按钮样式类型**
   * @type `string`
   * @default `primary`
   * @description 可选值为 "danger" | "default" | "info" | "primary" | "success" | "warning"
   * @description
   * - 当设置该值为 `primary` 时，按钮为主题色
   * - 当设置该值为 `success` 时，按钮为绿色
   * - 当设置该值为 `warning` 时，按钮为黄色
   * - 当设置该值为 `danger` 时，按钮为红色
   * - 当设置该值为 `info` 时，按钮为灰色
   * - 当设置该值为 `default` 时，按钮为黑色
   * */
  type?: "danger" | "default" | "info" | "primary" | "success" | "warning";

  /**
   * **是否禁用状态**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，按钮为禁用状态
   * @description 当设置该值为 `false` 时，按钮为正常状态
   * */
  disabled?: boolean;

  /**
   * **加载状态**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，按钮为加载状态
   * @description 当设置该值为 `false` 时，按钮为正常状态
   * */
  loading?: boolean;

  /**
   * **自动Loading来源**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会自动判断是否为 `loading` 状态，且会自动添加 `loading` 样式
   * */
  loadingBy?: string;

  /**
   * **是否开启防抖功能**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会开启防抖功能
   * @description 当设置该值为 `false` 时，不会开启防抖功能
   * */
  debounced?: boolean;

  /**
   * **防抖按钮时间**
   * @type `number`
   * @default `300`
   * @description 当设置该值为 `number` 时，会设置防抖按钮时间
   * @description 当设置该值为 `0` 时，不会开启防抖功能
   * */
  debouncedTime?: number;

  /**
   * **Icon位置**
   * @type `left` | `right`
   * @default `left`
   * @description 可选值为 `left` | `right`
   * @description
   * - 当设置该值为 `left` 时，Icon在按钮的左侧
   * - 当设置该值为 `right` 时，Icon在按钮的右侧
   * */
  iconPosition?: "left" | "right";

  /**
   * **按钮ICON**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为ICON
   * @description
   * - 该值的类型为 `string`，可以是任意类型
   * */
  iconName?: string;

  /**
   * **是否使用Icon**
   * @type `boolean`
   * @default `true`
   * @description 当设置该值为 `true` 时，会使用Icon
   * @description 当设置该值为 `false` 时，不会使用Icon
   * */
  useFont?: boolean;

  /**
   * **是否使用下划线按钮**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用下划线按钮
   * @description 当设置该值为 `false` 时，不会使用下划线按钮
   * */
  useLine?: boolean;

  /**
   * **是否使用朴素按钮**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用朴素按钮
   * @description 当设置该值为 `false` 时，不会使用朴素按钮
   * */
  usePlain?: boolean;

  /**
   * **确认弹窗配置**
   * @type `ConfirmConfig` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会开启确认弹窗功能
   * @description 当设置该值为 `undefined` 时，不会开启确认弹窗功能
   * */
  confirmConfig?: MessageBoxOptions;

  onConfirmClick?: () => void;
  onSubmitClick?: () => void;
  onDeleteClick?: () => void;
};
