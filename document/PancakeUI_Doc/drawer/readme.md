# Drawer 抽屉弹窗

抽屉弹窗组件，用于显示操作结果或提示信息。

## 基础用法

<demo src="./base.vue"></demo>

## 显示位置

抽屉弹窗可以在顶部、左侧、右侧、底部显示，抽屉弹窗默认在右侧显示。

<demo src="./position.vue"></demo>

## ComponentProps

| 属性名             | 描述                               | 类型                                                                                  | 默认值    |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------------------------- | --------- |
| id                 | 唯一标识                           | `string`                                                                              | -         |
| class              | 自定义类名                         | `Array<string>` \| `string`                                                           | -         |
| style              | 自定义样式                         | `Record<string, string>`                                                              | -         |
| modelValue         | 是否打开抽屉弹窗                   | `boolean`                                                                             | -         |
| title              | 弹窗标题                           | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | `'标题'`  |
| subTitle           | 弹窗副标题                         | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -         |
| width              | 弹窗宽度                           | `string`                                                                              | `'500px'` |
| height             | 弹窗高度                           | `string`                                                                              | `'300px'` |
| scroll             | 是否开启抽屉弹窗滚动               | `boolean`                                                                             | `true`    |
| useScrollX         | 是否开启 X 轴滚动                  | `boolean`                                                                             | `false`   |
| closeOnClickModal  | 是否点击抽屉弹窗遮罩层关闭抽屉弹窗 | `boolean`                                                                             | `true`    |
| closeOnPressEscape | 是否按下 `Escape` 键关闭抽屉弹窗   | `boolean`                                                                             | `true`    |
| padding            | 弹窗内边距                         | `Array<"all" \| "bottom" \| "left" \| "right" \| "top">`                              | -         |
| position           | 弹窗位置                           | `'bottom'` \| `'left'` \| `'right'` \| `'top'`                                        | `'right'` |

## ComponentEmits

| 字段              | 描述                         | 参数类型         |
| ----------------- | ---------------------------- | ---------------- |
| update:modelValue | 当抽屉弹窗显示状态改变时触发 | `value: boolean` |
| closed            | 当抽屉弹窗关闭时触发         | `value: boolean` |

## ComponentSlots

| 插槽名       | 作用         |
| ------------ | ------------ |
| `'default'`  | 默认内容插槽 |
| `'header'`   | 头部插槽     |
| `'title'`    | 标题插槽     |
| `'subTitle'` | 副标题插槽   |
| `'footer'`   | 底部插槽     |
