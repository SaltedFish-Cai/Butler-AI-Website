# pa-playground 可视化配置面板

可视化的配置管理面板，支持动态生成表单、表格、标签页等界面元素，适用于后台管理系统、低代码平台等场景。

## 基础用法

通过 `data` 属性传入配置数据，快速构建可配置的管理界面。

<demo src="./base.vue"></demo>

## ComponentProps

| 属性名                | 描述           | 类型                                                          | 默认值 |
| --------------------- | -------------- | ------------------------------------------------------------- | ------ |
| id                    | 组件唯一标识   | `string`                                                      | -      |
| class                 | 自定义类名     | `string`                                                      | -      |
| style                 | 自定义样式     | `Record<string, string>`                                      | -      |
| data                  | 配置数据       | `PaPlaygroundType`                                            | `{}`   |
| requestFunction       | 请求函数       | `any`                                                         | -      |
| actionFunction        | 操作函数数组   | `Array<PaOptionType.Select & PaPlaygroundActionFunctionType>` | -      |
| authorizationFunction | 授权函数数组   | `Array<PaStructureType.TableV2>`                              | -      |
| visibleBefore         | 可见性判断函数 | `(data: any) => boolean`                                      | -      |
| actionBefore          | 操作前判断函数 | `(data: any) => boolean`                                      | -      |

## MInterfaceConfig

| 属性名            | 描述         | 类型                                   | 默认值 |
| ----------------- | ------------ | -------------------------------------- | ------ |
| id                | 接口唯一标识 | `string`                               | -      |
| name              | 接口名称     | `string`                               | -      |
| apiUrl            | API 请求地址 | `string`                               | -      |
| apiType           | API 请求类型 | `"delete" \| "get" \| "post" \| "put"` | -      |
| dataStructure     | 数据结构标识 | `string`                               | -      |
| requestParameters | 请求参数列表 | `Array<string>`                        | -      |

## MOptionsType

| 属性名         | 描述         | 类型                                             | 默认值 |
| -------------- | ------------ | ------------------------------------------------ | ------ |
| id             | 选项唯一标识 | `string`                                         | -      |
| description    | 选项描述     | `string`                                         | -      |
| OptionsType    | 选项类型     | `"interface" \| "select" \| "switch"`            | -      |
| config         | 选项配置     | `PaOptionType.SelectList \| PaOptionType.Switch` | -      |
| dictionaryType | 字典类型     | `string`                                         | -      |
| dictionaryKey  | 字典键名     | `string`                                         | -      |
| columnName     | 列名         | `string`                                         | -      |
| tableName      | 表名         | `string`                                         | -      |

## MStructureType

| 属性名      | 描述       | 类型                        | 默认值 |
| ----------- | ---------- | --------------------------- | ------ |
| id          | 唯一标识   | `string`                    | -      |
| description | 描述       | `string`                    | -      |
| indexKey    | 索引键名   | `string`                    | -      |
| config      | 配置项列表 | `Array<MStructureTypeItem>` | -      |

## MStructureTypeItem

| 属性名      | 描述     | 类型                  | 默认值 |
| ----------- | -------- | --------------------- | ------ |
| id          | 唯一标识 | `string`              | -      |
| prop        | 属性名   | `string`              | -      |
| description | 描述     | `string`              | -      |
| label       | 标签     | `LanguagePackageType` | -      |

## PaPlaygroundItem

| 属性名        | 描述          | 类型                                                              | 默认值 |
| ------------- | ------------- | ----------------------------------------------------------------- | ------ |
| itemId        | 项目唯一标识  | `string`                                                          | -      |
| width         | 宽度          | `number`                                                          | -      |
| height        | 高度          | `number`                                                          | -      |
| type          | 项目类型      | `"form" \| "table" \| "tabs"`                                     | -      |
| structure     | 结构配置      | `Array<PaStructureType.FormV2> \| Array<PaStructureType.TableV2>` | -      |
| actionButtons | 操作按钮列表  | `Array<PaPlaygroundPageButtonType>`                               | -      |
| exOptions     | 扩展选项映射  | `Record<string, string>`                                          | -      |
| sourceTable   | 源数据表名    | `string`                                                          | -      |
| actionApi     | 操作 API 标识 | `string`                                                          | -      |
| title         | 标题          | `LanguagePackageType \| object`                                   | -      |
| otherProps    | 其他属性      | `Record<string, any>`                                             | -      |

## PaPlaygroundPagesType

| 属性名      | 描述         | 类型                      | 默认值 |
| ----------- | ------------ | ------------------------- | ------ |
| pageId      | 页面唯一标识 | `string`                  | -      |
| name        | 页面名称     | `string`                  | -      |
| x           | X 坐标       | `number`                  | -      |
| y           | Y 坐标       | `number`                  | -      |
| itemConfigs | 项目配置列表 | `Array<PaPlaygroundItem>` | -      |

## PaPlaygroundType

| 属性名           | 描述         | 类型                           | 默认值 |
| ---------------- | ------------ | ------------------------------ | ------ |
| id               | 唯一标识     | `string`                       | -      |
| name             | 名称         | `string`                       | -      |
| description      | 描述         | `string`                       | -      |
| adminIndex       | 管理索引     | `string`                       | -      |
| adminX           | 管理 X 坐标  | `number`                       | -      |
| adminY           | 管理 Y 坐标  | `number`                       | -      |
| adminScale       | 管理缩放比例 | `number`                       | -      |
| pagesConfigs     | 页面配置列表 | `Array<PaPlaygroundPagesType>` | -      |
| interfaceConfigs | 接口配置列表 | `Array<MInterfaceConfig>`      | -      |
| dataStructures   | 数据结构列表 | `Array<MStructureType>`        | -      |
| exOptions        | 扩展选项列表 | `Array<MOptionsType>`          | -      |

## PaPlaygroundPageButtonType

| 属性名               | 描述             | 类型                                                                              | 默认值 |
| -------------------- | ---------------- | --------------------------------------------------------------------------------- | ------ |
| buttonId             | 按钮唯一标识     | `string`                                                                          | -      |
| text                 | 按钮文本         | `LanguagePackageType`                                                             | -      |
| type                 | 按钮类型         | `"danger" \| "default" \| "info" \| "primary" \| "success" \| "warning"`          | -      |
| icon                 | 图标名称         | `string`                                                                          | -      |
| useType              | 使用类型         | `"dialog" \| "HeaderCenter" \| "HeaderLeft" \| "operation" \| "ToolButtonInline"` | -      |
| is                   | 按钮类型         | `ButtonTypeV2Is`                                                                  | -      |
| isText               | 内置按钮文本     | `LanguagePackageType`                                                             | -      |
| styleType            | 样式类型         | `"Built" \| "Custom"`                                                             | -      |
| actionType           | 操作类型         | `string \| "delete" \| "dialog" \| "jump" \| "null" \| "save"`                    | -      |
| jumpTarget           | 跳转目标         | `string`                                                                          | -      |
| transmitData         | 传递数据字段     | `Array<string>`                                                                   | -      |
| actionApiId          | API 标识         | `string`                                                                          | -      |
| dialogContentId      | 弹窗内容标识     | `string`                                                                          | -      |
| dialogSize           | 弹窗尺寸         | `"l" \| "m" \| "max" \| "s"`                                                      | -      |
| dialogContentButtons | 弹窗内容按钮列表 | `Array<PaPlaygroundPageButtonType>`                                               | -      |
| dialogTitle          | 弹窗标题         | `LanguagePackageType \| string`                                                   | -      |
| dialogSubTitle       | 弹窗副标题键名   | `string`                                                                          | -      |
| closeBySave          | 保存后关闭弹窗   | `number`                                                                          | -      |
| refreshByDialogClose | 弹窗关闭后刷新   | `number`                                                                          | -      |
| dialogScroll         | 弹窗滚动         | `number`                                                                          | -      |

## PaPlaygroundActionFunctionType

| 属性名                | 描述       | 类型            | 默认值 |
| --------------------- | ---------- | --------------- | ------ |
| executionMethod       | 执行方法   | `any`           | -      |
| executionDependencies | 执行依赖项 | `Array<object>` | -      |

## useFormType

| 属性名    | 描述     | 类型     | 默认值 |
| --------- | -------- | -------- | ------ |
| submitUrl | 提交地址 | `string` | -      |

## useTableType

| 属性名          | 描述             | 类型     | 默认值 |
| --------------- | ---------------- | -------- | ------ |
| getTableDataUrl | 获取表格数据地址 | `string` | -      |

## 类型说明

| 类型名称            | 说明         | 链接                                                                         |
| ------------------- | ------------ | ---------------------------------------------------------------------------- |
| LanguagePackageType | 多语言包类型 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) |
| PaOptionType        | 选项类型     | [`PaOptionType`](/document/PancakeUI_Doc/options)                            |
| PaStructureType     | 结构类型     | [`PaStructureType`](/document/PancakeUI_Doc/options)                         |
| ButtonTypeV2Is      | 按钮内置类型 | [`ButtonTypeV2Is`](/document/PancakeUI_Doc/button/readme)                    |
