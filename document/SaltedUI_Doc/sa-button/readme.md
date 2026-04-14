# MButton 按钮

常用的操作按钮。

## `SaButtonType`

| 属性名        | 类型                                                                    | 默认值    | 描述                                                                          |
| ------------- | ----------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| is            | `string`                                                                | —         | 内置样式选择 [样式展示](/document/SaltedUI_Doc/sa-button/readme.html#内置样式) |
| type          | `default` `info` `primary` `success` `warning`                          | `default` | 类型                                                                          |
| disabled      | `boolean`                                                               | `false`   | 是否禁用按钮                                                                  |
| loading       | `boolean`                                                               | `false`   | 是否 `Loading` 状态                                                           |
| loadingBy     | `string`                                                                | —         | 自动 `Loading` 监听依赖源                                                     |
| debounced     | `boolean`                                                               | `true`    | 开启防抖                                                                      |
| debouncedTime | `number`                                                                | `300`     | 防抖延迟时间                                                                  |
| iconPosition  | `left` `right`                                                          | `left`    | Icon 位置                                                                     |
| iconName      | `string`                                                                | —         | icon 图标([`sa-icon`](/document/SaltedUI_Doc/sa-icon/readme.html))           |
| useFont       | `boolean`                                                               | `true`    | 是否使用字体图标                                                              |
| useLine       | `boolean`                                                               | `false`   | 是否为链接按钮                                                                |
| usePlain      | `boolean`                                                               | `true`    | 是否为朴素按钮                                                                |
| confirmConfig | [`MessageBoxOptions`](/document/SaltedUI_Doc/sa-message-box/readme.html) | —         | 确认弹窗配置                                                                  |

## 基础用法

使用 `type`、`usePlain` 来定义按钮的样式。

<demo src="./base.vue" ></demo>

## Group 组合

使用 `sa-button-group` 组件来定义按钮的组合样式。

<demo src="./group.vue" ></demo>

## 禁用状态

使用 `disabled` 来定义按钮的禁用。

<demo src="./disabled.vue"  ></demo>

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
