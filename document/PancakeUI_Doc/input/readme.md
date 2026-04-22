# Input 输入框

常用与输入相关的场景。

:::warning 注意
`pa-input` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式。

<demo src="./display.vue" ></demo>

## ComponentProps

| 属性名         | 描述                 | 类型                                                       | 默认值      |
| -------------- | -------------------- | ---------------------------------------------------------- | ----------- |
| id             | 组件唯一标识         | `string` `undefined`                                       | `undefined` |
| class          | 自定义类名           | `string` `undefined`                                       | `undefined` |
| style          | 自定义样式           | `Record<string, string>` `undefined`                       | `undefined` |
| clearable      | 显示清除按钮         | `boolean` `undefined`                                      | `true`      |
| type           | 输入框类型           | `input` `textarea` `text` `undefined`                      | `textarea`  |
| modelValue     | 绑定值               | `string` `undefined`                                       | `undefined` |
| placeholder    | 输入框提示           | `Record<"en-US" \| "zh-CN", string>` ` string``undefined ` | `undefined` |
| disabled       | 禁用状态             | `boolean` `undefined`                                      | `undefined` |
| display        | 纯展示               | `boolean` `undefined`                                      | `undefined` |
| maxLength      | 内容长度的最大数     | `string` `number` `undefined`                              | `undefined` |
| autofocus      | 自动获取焦点         | `boolean` `undefined`                                      | `undefined` |
| contrastData   | 对比用原数据         | `number` `string` `undefined`                              | `undefined` |
| alwaysContrast | 是否总是显示对不数据 | `boolean` `undefined`                                      | `undefined` |
| title          | 表单项标签           | `Record<'en-US' \| 'zh-CN', string>` `string` `undefined`  | `undefined` |
| titleWidth     | 表单项标签宽度       | `string` `undefined`                                       | `undefined` |

## ComponentEvents

| 字段     | 描述             | 类型                            |
| -------- | ---------------- | ------------------------------- |
| onChange | 数据变更回调函数 | `({ value, oldValue }) => void` |
| onBlur   | 失去焦点回调函数 | `() => void`                    |
| onFocus  | 获得焦点回调函数 | `() => void`                    |
| onEnter  | 回车回调函数     | `() => void`                    |
