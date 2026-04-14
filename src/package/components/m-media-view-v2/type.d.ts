export type MMediaViewV2ItemType = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * @description 该值的类型为 `string`，可以是任意类型，但是建议不要重复
   * */
  id?: string;
  /**
   * **文件源对象**
   * @type `object`
   * @description 当设置该值时，会使用该值作为文件源对象
   * @description 该值的类型为 `object`，可以是任意类型
   * */
  file: objectType;
  /**
   * **文件路径**
   * @type `string`
   * @description 当设置该值时，会使用该值作为文件路径
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  filePath: string;

  /**
   * **文件完整路径**
   * @type `string`
   * @description 当设置该值时，会使用该值作为文件完整路径
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  fullPath?: string;

  /**
   * **文件名称**
   * @type `string`
   * @description 当设置该值时，会使用该值作为文件名称
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  fileName?: string;

  /**
   * **文件名称**
   * @type `string`
   * @description 当设置该值时，会使用该值作为文件名称
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  OriginalName?: string;

  /**
   * **文件名称**
   * @type `string`
   * @description 当设置该值时，会使用该值作为文件名称
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  FileName?: string;
};

export type MMediaViewV2Type = {
  /**
   * **文件列表**
   * @type `Array<MMediaViewV2ItemType>`
   * */
  fileList: Array<MMediaViewV2ItemType>;

  /**
   * **是否显示开启按钮**
   * @type `boolean`
   * @default `false`
   * @description 当设置该值为 `false` 时，会显示按钮
   * @description 当设置该值为 `true` 时，不会显示按钮
   * @example
   * ```tsx
   * <MoMediaView hideBtn />
   * ```
   * */
  hideBtn?: boolean;
};
