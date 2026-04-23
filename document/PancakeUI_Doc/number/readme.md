# Number 数字框

常用与数字相关的场景。

:::warning 注意
`pa-number` 可独立使用，在 `pa-form/pa-table` 中可使用时，需配置 `prop` 字段。
:::

## 组件功能展示

<demo src="./base.vue" ></demo>

## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式。

<demo src="./display.vue" ></demo>

## ComponentProps

| 属性名         | 描述                 | 类型                                                                                  | 默认值 |
| -------------- | -------------------- | ------------------------------------------------------------------------------------- | ------ |
| id             | 组件唯一标识         | `string`                                                                              | -      |
| class          | 自定义类名           | `string`                                                                              | -      |
| style          | 自定义样式           | `Record<string, string>`                                                              | -      |
| controls       | 显示控制器           | `boolean`                                                                             | `true` |
| clearable      | 显示清除按钮         | `boolean`                                                                             | `true` |
| step           | 计数器步长           | `number`                                                                              | `1`    |
| precision      | 小数点精度           | `number`                                                                              | `0`    |
| modelValue     | 绑定值               | `string` `number`                                                                     | -      |
| placeholder    | 输入框提示           | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -      |
| disabled       | 禁用状态             | `boolean`                                                                             | -      |
| display        | 纯展示               | `boolean`                                                                             | -      |
| max            | 最大值               | `number`                                                                              | -      |
| min            | 最小值               | `number`                                                                              | -      |
| unit           | 单位                 | `string`                                                                              | -      |
| autofocus      | 自动获取焦点         | `boolean`                                                                             | -      |
| contrastData   | 对比用原数据         | `number` `string`                                                                     | -      |
| alwaysContrast | 是否总是显示对不数据 | `boolean`                                                                             | -      |
| title          | 表单项标签           | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) `string` | -      |
| titleWidth     | 表单项标签宽度       | `string`                                                                              | -      |

## ComponentEmits

| 事件名   | 描述             | 类型                            |
| ------ | ---------------- | ------------------------------- |
| change | 数据变更回调函数 | `({ value, oldValue }) => void` |
| blur   | 失去焦点回调函数 | `() => void`                    |
| focus  | 获得焦点回调函数 | `() => void`                    |
