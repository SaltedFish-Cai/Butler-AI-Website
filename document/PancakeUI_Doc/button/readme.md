# Button 按钮

常用的操作按钮。

## 基础用法

使用 `type`、`usePlain` 来定义按钮的样式。

<demo src="./base.vue" ></demo>

## Group 组合

使用 `pa-button-group` 组件来定义按钮的组合样式。

<demo src="./group.vue" ></demo>

## 禁用状态

使用 `disabled` 来定义按钮的禁用。

<demo src="./disabled.vue"  ></demo>

## 链接按钮

使用 `useLine` 来定义按钮的链接样式。

<demo src="./link.vue" ></demo>

## 内置样式

内置样式只需使用 `is` 即可完成样式选择

<demo src="./is.vue" ></demo>

## 防抖按钮

使用 `debounced` 即可控制防抖模式，`debouncedTime` 用于设置延迟触发事件，该功能默认 `开启`

<demo src="./debounced.vue" ></demo>

## Icon 位置

使用 `iconPosition` 控制按钮图标显示位置。

<demo src="./position.vue" ></demo>

## 内置执行提示

使用 `@submit-click` `@delete-click` `@confirm-click` 即可开启内置执行提示, 或者配置 `confirmConfig` 来自定义弹窗提示

<demo src="./confirm.vue" ></demo>

## ComponentProps

| 属性名        | 描述                                                                         | 类型                                                                                  | 默认值     |
| ------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| id            | 唯一标识                                                                     | `string`                                                                              | -          |
| class         | 自定义类名                                                                   | `Array<string>` `string`                                                              | -          |
| style         | 自定义样式                                                                   | `Record<string, string>`                                                              | -          |
| useFont       | 是否使用字体图标                                                             | `boolean`                                                                             | `true`     |
| usePlain      | 是否为朴素按钮                                                               | `boolean`                                                                             | `true`     |
| useStop       | 是否阻止事件冒泡                                                             | `boolean`                                                                             | `true`     |
| debounced     | 开启防抖                                                                     | `boolean`                                                                             | `true`     |
| debouncedTime | 防抖延迟时间                                                                 | `number`                                                                              | `300`      |
| iconPosition  | Icon 位置                                                                    | `'left'` `'right'`                                                                    | `'left'`   |
| size          | 按钮大小                                                                     | `'large'` `'medium'` `'small'`                                                        | `'medium'` |
| type          | 类型                                                                         | `'danger'` `'default'` `'info'` `'primary'` `'success'` `'warning'`                   | -          |
| text          | 按钮文本，支持多语言                                                         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -          |
| is            | 内置样式选择 [样式展示](/document/PancakeUI_Doc/button/readme.html#内置样式) | `string`                                                                              | -          |
| disabled      | 是否禁用按钮                                                                 | `boolean`                                                                             | -          |
| loading       | 是否 `Loading` 状态                                                          | `boolean`                                                                             | -          |
| loadingBy     | 自动 `Loading` 监听依赖源                                                    | `string`                                                                              | -          |
| iconName      | icon 图标([`pa-icon`](/document/PancakeUI_Doc/icon/readme.html))             | `string`                                                                              | -          |
| useLine       | 是否为链接按钮                                                               | `boolean`                                                                             | -          |
| confirmConfig | 确认弹窗配置                                                                 | [`MessageBoxOptions`](/document/PancakeUI_Doc/message-box/readme.html)                | -          |

## ComponentEmits

| 事件名       | 描述             | 参数                | 回调函数                        |
| ------------ | ---------------- | ------------------- | ------------------------------- |
| click        | 点击按钮执行方法 | `event: MouseEvent` | `(event?: MouseEvent) => void`  |
| confirmClick | 确认按钮执行方法 | -                   | `() => void`                    |
| submitClick  | 提交按钮执行方法 | -                   | `() => void`                    |
| deleteClick  | 删除按钮执行方法 | -                   | `() => void`                    |
