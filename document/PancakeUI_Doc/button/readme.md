# Button 按钮

常用的操作按钮。

## 基础用法

使用 `type`、`usePlain` 来定义按钮的样式。

<demo src="./base.vue"></demo>

## Group 组合

使用 `pa-button-group` 组件来定义按钮的组合样式。

<demo src="./group.vue"></demo>

## 禁用状态

使用 `disabled` 来定义按钮的禁用。

<demo src="./disabled.vue"></demo>

## 尺寸

使用 `size` 来定义按钮的大小。

<demo src="./size.vue"></demo>

## 链接按钮

使用 `useLine` 来定义按钮的链接样式。

<demo src="./link.vue"></demo>

## 内置样式

内置样式只需使用 `is` 即可完成样式选择

<demo src="./is.vue"></demo>

## 防抖按钮

使用 `debounced` 即可控制防抖模式，`debouncedTime` 用于设置延迟触发事件，该功能默认 `开启`

<demo src="./debounced.vue"></demo>

## Icon 位置

使用 `iconPosition` 控制按钮图标显示位置。

<demo src="./position.vue"></demo>

## 内置执行提示

使用 `@submit-click` `@delete-click` `@confirm-click` 即可开启内置执行提示, 或者配置 `confirmConfig` 来自定义弹窗提示

<demo src="./confirm.vue"></demo>

## ComponentProps

| 属性名        | 描述               | 类型                                                                                  | 默认值   |
| ------------- | ------------------ | ------------------------------------------------------------------------------------- | -------- |
| id            | 唯一标识           | `string`                                                                              | -        |
| class         | 自定义类名         | `Array<string>` `string`                                                              | -        |
| style         | 自定义样式         | `Record<string, string>`                                                              | -        |
| text          | 按钮文本           | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -        |
| size          | 按钮大小           | `'large'` `'medium'` `'small'`                                                        | `medium` |
| is            | 内置样式           | [`ButtonTypeV2Is`](#buttontypev2is)                                                   | -        |
| type          | 按钮样式类型       | `'danger'` `'default'` `'info'` `'primary'` `'success'` `'warning'`                   | -        |
| disabled      | 是否禁用状态       | `boolean`                                                                             | -        |
| loading       | 加载状态           | `boolean`                                                                             | -        |
| loadingBy     | 自动 Loading 来源  | `string`                                                                              | -        |
| debounced     | 是否开启防抖功能   | `boolean`                                                                             | `true`   |
| debouncedTime | 防抖按钮时间       | `number`                                                                              | `300`    |
| iconPosition  | Icon 位置          | `'left'` `'right'`                                                                    | `left`   |
| iconName      | 按钮 ICON          | `string`                                                                              | -        |
| useFont       | 是否使用 Icon      | `boolean`                                                                             | `true`   |
| useLine       | 是否使用下划线按钮 | `boolean`                                                                             | -        |
| usePlain      | 是否使用朴素按钮   | `boolean`                                                                             | `true`   |
| confirmConfig | 确认弹窗配置       | [`MessageBoxOptions`](/document/PancakeUI_Doc/message-box/readme#messageboxoptions)   | -        |
| useStop       | 是否阻止事件冒泡   | `boolean`                                                                             | `true`   |

## ComponentEmits

| 事件名       | 描述             | 回调函数                      |
| ------------ | ---------------- | ----------------------------- |
| click        | 点击按钮事件     | `(event: MouseEvent) => void` |
| confirmClick | 确认按钮点击事件 | `() => void`                  |
| submitClick  | 提交按钮点击事件 | `() => void`                  |
| deleteClick  | 删除按钮点击事件 | `() => void`                  |

## ButtonTypeV2Is

预设按钮样式类型。

| 值           | 描述   |
| ------------ | ------ |
| `'add'`      | 新增   |
| `'cancel'`   | 取消   |
| `'check'`    | 勾选   |
| `'delete'`   | 删除   |
| `'download'` | 下载   |
| `'edit'`     | 编辑   |
| `'export'`   | 导出   |
| `'file'`     | 文件   |
| `'go'`       | 前往   |
| `'import'`   | 导入   |
| `'more'`     | 更多   |
| `'ok'`       | 确认   |
| `'refresh'`  | 刷新   |
| `'remove'`   | 移除   |
| `'save'`     | 保存   |
| `'search'`   | 搜索   |
| `'submit'`   | 提交   |
| `'switch'`   | 切换   |
| `'sync'`     | 同步   |
| `'time'`     | 时间   |
| `'trash'`    | 回收站 |
| `'upload'`   | 上传   |
| `'view'`     | 查看   |
