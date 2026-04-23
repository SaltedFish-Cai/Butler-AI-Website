import { SaOptionType, LanguagePackageType } from "../manager-type";

export type ComponentProps = {
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
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  class?: string;

  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **双向绑定值**
   * @type `Array<number | string>` | `number` | `string` | `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 该值的类型为 `Array<number | string>` | `number` | `string` | `boolean`，可以是任意类型
   * */
  modelValue?: Array<number | string> | number | string;

  /**
   * **表单项标签**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标签
   * */
  title?: LanguagePackageType | string;

  /**
   * **表单项标签宽度**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项标签宽度
   * */
  titleWidth?: string;

  /**
   * **是否使用'AA-aa'格式的选项值模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，返回值为'AA-aa'格式的选项值
   * */
  useValueBylink?: boolean;

  /**
   * **是否使用'AA/aa'格式的选项标签模式**
   * @type `boolean` | `undefined`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示'AA/aa'格式的选项标签
   * */
  useTextByLink?: boolean;

  /**
   * **纯展示数据**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会显示该值
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  displayValue?: string;

  /**
   * **类型**
   * @type `cascader-check` | `cascader` | `multiple-cascader-check` | `multiple-cascader` | `undefined`
   * @default `cascader`
   * @description 当设置该值时，会使用该值作为类型
   * */
  type?: "cascader-check" | "cascader" | "multiple-cascader-check" | "multiple-cascader";

  /**
   * **外置数据**
   * @type `Array<SaOptionType.Select>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为配置数据
   * @description 该值的类型为 `Array<SaOptionType.Select>`，可以是任意类型
   * @example
   * ```tsx
   * <PaCascader exOptions={[]} />
   * ```
   * */
  exOptions?: SaOptionType.SelectList;

  /**
   * **表单项占位符**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `string` 时，会使用该值作为表单项占位符
   * */
  placeholder?: LanguagePackageType | string;

  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * @description 当设置该值为 `false` 时，不会禁用该组件
   * @example
   * ```tsx
   * <PaCascader disabled={true} />
   * ```
   * */
  disabled?: boolean;

  /**
   * **纯展示模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @example
   * ```tsx
   * <PaCascader display={true} />
   * ```
   * */
  display?: boolean;

  /**
   * **显示清除按钮**
   * @type `boolean` | `undefined`
   * @default `true`
   * @description 当设置该值为 `true` 时，会显示清除按钮
   * @description 当设置该值为 `false` 时，不会显示清除按钮
   * @example
   * ```tsx
   * <PaCascader clearable={true} />
   * ```
   * */
  clearable?: boolean;

  /**
   * **Teleport 目标**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会将组件挂载到指定的目标元素下
   * @description 该值的类型为 `boolean`，可以是任意类型
   * @example
   * ```tsx
   * <PaCascader teleportInContainer={true} />
   * ```
   * */
  teleportInContainer?: boolean;

  /**
   * **对比数据**
   * @type `Array<number | string>` | `number` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * @description 该值的类型为 `Array<number | string>` | `number` | `string`
   * @description 当设置该值时，会使用该值作为对比数据
   * @description 该值的类型为 `Array<number | string>` | `number` | `string`，可以是任意类型
   * @example
   * ```tsx
   * <PaCascader contrastData={[1, 2, 3]} />
   * ```
   * */
  contrastData?: Array<number | string> | number | string;

  /**
   * **是否显示对比数据**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，不会显示对比数据
   * @example
   * ```tsx
   * <PaCascader contrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue, option }) => void` | `undefined`
   * @default `undefined`
   * @type `value` 为当前值
   * @type `oldValue` 为旧值
   * @type `option` 为当前选项
   * @description 当设置该值为 `({ value, oldValue, option: SaOptionType.Select }) => void` 时，会使用该值作为回调函数
   * @example
   * ```tsx
   * <PaCascader onChange={({value, oldValue, option}) => { console.log(value, oldValue, option) }} />
   * ```
   * */
  onChange?: ({ value, oldValue, option }) => void;
};
