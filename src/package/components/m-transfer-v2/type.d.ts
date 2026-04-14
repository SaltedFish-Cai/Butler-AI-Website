import { MOptionV2Type } from "../manager-type";

export type MTransferV2Type = {
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
   * **双向绑定值**
   * @type `Array<number | string>`
   * @default `undefined`
   * @description 当设置该值时，会绑定该值
   * @description 该值的类型为 `Array<number | string>`，可以是任意类型
   * */
  modelValue?: Array<boolean | number | string>;

  /**
   * **纯展示数据**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会显示该值
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  displayValue?: string;

  /**
   * **外置数据**
   * @type `MOptionV2Type.SelectList`
   * @description 当设置该值时，会使用该值作为配置数据
   * @description 该值的类型为 `MOptionV2Type.SelectList`，可以是任意类型
   * @example
   * ```tsx
   * <MoSelect exOptions={[]} />
   * ```
   * */
  exOptions?: MOptionV2Type.SelectList;

  /**
   * **选项KEy**
   * @type `string`
   * @default `value`
   * @description 当设置该值时，会使用该值作为选项的KEy
   * */
  optionKey?: string;

  /**
   * **占位字符串**
   * @type `string`
   * @default `请选择`
   * @description 当设置该值时，会使用该值作为占位字符串
   * @example
   * ```tsx
   * <MoSelect placeholder="请选择" />
   * ```
   * */
  placeholder?: string;

  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会禁用该组件
   * @description 当设置该值为 `false` 时，不会禁用该组件
   * @example
   * ```tsx
   * <MoSelect disabled={true} />
   * ```
   * */
  disabled?: boolean;

  /**
   * **纯展示模式**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用纯展示模式
   * @description 当设置该值为 `false` 时，不会使用纯展示模式
   * @example
   * ```tsx
   * <MoSelect display={true} />
   * ```
   * */
  display?: boolean;

  /**
   * **是否使用搜索**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会使用搜索功能
   * @description 当设置该值为 `false` 时，不会使用搜索功能
   * @example
   * ```tsx
   * <MoSelect useSearch={true} />
   * ```
   * */
  useSearch?: boolean;

  /**
   * **对比数据**
   * @type `Array<number | string>` | `number` | `string`
   * @default `undefined`
   * @description 当设置该值时，会使用该值作为对比数据
   * @description 该值的类型为 `Array<number | string>` | `number` | `string`，可以是任意类型
   * @example
   * ```tsx
   * <MoSelect contrastData={[1, 2, 3]} />
   * ```
   * */
  contrastData?: Array<number | string> | number | string;

  /**
   * **是否显示对比数据**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `true` 时，会显示对比数据
   * @description 当设置该值为 `false` 时，不会显示对比数据
   * @example
   * ```tsx
   * <MoSelect contrast={true} />
   * ```
   * */
  alwaysContrast?: boolean;

  /**
   * **当数据发生变更时触发**
   * @type `({ value, oldValue }) => void` | `undefined`
   * @type `value` 为当前值
   * @type `oldValue` 为旧值
   * @type 默认值为 `undefined`
   * @type 当设置该值为 `({ value, oldValue }) => void` 时，会使用该值作为回调函数
   * @example
   * ```tsx
   * <MoSelect onChange={({value, oldValue}) => { console.log(value, oldValue) }} />
   * ```
   * */
  onChange?: ({ value, oldValue }) => void;
};
