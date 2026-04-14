# MButton 按钮

常用的操作按钮。

## `MButtonTypeV2`

| 属性名        | 类型                                                                    | 默认值    | 描述                                                                          |
| ------------- | ----------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| is            | `string`                                                                | —         | 内置样式选择 [样式展示](/document/SaltedUI_Doc/m-button/readme.html#内置样式) |
| type          | `default` `info` `primary` `success` `warning`                          | `default` | 类型                                                                          |
| disabled      | `boolean`                                                               | `false`   | 是否禁用按钮                                                                  |
| loading       | `boolean`                                                               | `false`   | 是否 `Loading` 状态                                                           |
| loadingBy     | `string`                                                                | —         | 自动 `Loading` 监听依赖源                                                     |
| debounced     | `boolean`                                                               | `true`    | 开启防抖                                                                      |
| debouncedTime | `number`                                                                | `300`     | 防抖延迟时间                                                                  |
| iconPosition  | `left` `right`                                                          | `left`    | Icon 位置                                                                     |
| iconName      | `string`                                                                | —         | icon 图标([`m-icon-v2`](/document/SaltedUI_Doc/m-icon/readme.html))           |
| useFont       | `boolean`                                                               | `true`    | 是否使用字体图标                                                              |
| useLine       | `boolean`                                                               | `false`   | 是否为链接按钮                                                                |
| usePlain      | `boolean`                                                               | `true`    | 是否为朴素按钮                                                                |
| confirmConfig | [`MessageBoxOptions`](/document/SaltedUI_Doc/m-message-box/readme.html) | —         | 确认弹窗配置                                                                  |

## 基础用法

使用 `type`、`usePlain` 来定义按钮的样式。

```html
<m-button-v2 iconName="star_arc_line" :usePlain="false" type="primary">Primary</m-button-v2>
<m-button-v2 iconName="star_arc_line" :usePlain="false" type="success">Success</m-button-v2>
<m-button-v2 iconName="star_arc_line" :usePlain="false" type="info">Info</m-button-v2>
<m-button-v2 iconName="star_arc_line" :usePlain="false" type="warning">Warning</m-button-v2>
<m-button-v2 iconName="star_arc_line" :usePlain="false" type="danger">Danger</m-button-v2>
```

## Group 组合

使用 `m-button-v2-group` 组件来定义按钮的组合样式。

```html
<m-button-v2-group>
  <m-button-v2 iconName="star_arc_line" is="upload">Upload</m-button-v2>
  <m-button-v2 iconName="star_arc_line" is="download">Download</m-button-v2>
  <m-button-v2 iconName="star_arc_line" is="add">Add</m-button-v2>
  <m-button-v2 iconName="star_arc_line" is="cancel">Cancel</m-button-v2>
  <m-button-v2 iconName="star_arc_line" is="ok">OK</m-button-v2>
  <m-button-v2 iconName="star_arc_line" is="trash">Trash</m-button-v2>
</m-button-v2-group>
```

## 禁用状态

使用 `disabled` 来定义按钮的禁用。

```html
<m-button-v2 iconName="star_arc_line" disabled :plain="false" type="primary">Primary</m-button-v2>
<m-button-v2 iconName="star_arc_line" disabled :plain="false" type="success">Success</m-button-v2>
<m-button-v2 iconName="star_arc_line" disabled :plain="false" type="info">Info</m-button-v2>
<m-button-v2 iconName="star_arc_line" disabled :plain="false" type="warning">Warning</m-button-v2>
<m-button-v2 iconName="star_arc_line" disabled :plain="false" type="danger">Danger</m-button-v2>
```

## 链接按钮

使用 `useLine` 来定义按钮的链接样式。

```html
<m-button-v2 iconName="star_arc_line" useLine :plain="false" type="primary">Primary</m-button-v2>
<m-button-v2 iconName="star_arc_line" useLine :plain="false" type="success">Success</m-button-v2>
<m-button-v2 iconName="star_arc_line" useLine :plain="false" type="info">Info</m-button-v2>
<m-button-v2 iconName="star_arc_line" useLine :plain="false" type="warning">Warning</m-button-v2>
<m-button-v2 iconName="star_arc_line" useLine :plain="false" type="danger">Danger</m-button-v2>
```

## 内置样式

内置样式只需使用 `is` 即可完成样式选择

```html
<m-button-v2 is="add">Add</m-button-v2>
<m-button-v2 is="cancel">Cancel</m-button-v2>
<m-button-v2 is="check">Check</m-button-v2>
<m-button-v2 is="download">Download</m-button-v2>
<m-button-v2 is="edit">Edit</m-button-v2>
```

## 防抖按钮

使用 `debounced` 即可控制防抖模式，`debouncedTime` 用于设置延迟触发事件，该功能默认 `开启`

```html
<m-button-v2 iconName="star_arc_line" :debounced="false" @click="debouncedClick">非防抖按钮</m-button-v2>

<m-button-v2 iconName="star_arc_line" @click="debouncedClick">防抖按钮</m-button-v2>
```

## Icon 位置

使用 `iconPosition` 控制按钮图标显示位置。

```html
<m-button-v2 iconName="star_arc_line" @click="debouncedClick">左侧</m-button-v2>

<m-button-v2 iconName="star_arc_line" iconPosition="right" @click="debouncedClick">右侧</m-button-v2>
```

## 内置执行提示

使用 `@submit-click` `@delete-click` `@confirm-click` 即可开启内置执行提示, 或者配置 `confirmConfig` 来自定义弹窗提示

```html
<m-button-v2 iconName="star_arc_line" :confirmConfig="confirmConfig">快捷使用Confirm</m-button-v2>
<m-button-v2 is="submit" @submit-click="confirmClick">快捷使用Submit</m-button-v2>
<m-button-v2 is="trash" @delete-click="confirmClick">快捷使用Delete</m-button-v2>
<m-button-v2 is="ok" @confirm-click="confirmClick">快捷使用Confirm</m-button-v2>
```
