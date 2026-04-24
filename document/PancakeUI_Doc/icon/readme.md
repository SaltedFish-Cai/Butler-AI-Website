# Icon 图标

常用的图标，多用于 [`pa-button`](/document/PancakeUI_Doc/button/readme) 的图标选择。

## 基础用法

使用 `name` 选择图标

<demo src="./base.vue"></demo>

## 带提示

使用 `tip` 来定义 icon 的 hover 提示

<demo src="./tip.vue"></demo>

## ComponentProps

| 属性名 | 描述 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| id | 唯一标识 | `string` \| `undefined` | `undefined` |
| class | 自定义类名 | `Array<string>` \| `string` \| `undefined` | `undefined` |
| style | 自定义样式 | `Record<string, string>` \| `undefined` | `undefined` |
| name | icon 名称 | `string` | `magic_line` |
| tip | icon 提示 | [`LanguagePackageType`](/document/PancakeUI_Doc/options#languagepackagetype) \| `string` \| `undefined` | `undefined` |

## ComponentEmits

| 事件名 | 描述 | 回调函数 |
| ------ | ---- | -------- |
| click | 点击 Icon 执行方法 | `(event: MouseEvent) => void` |

## Icon 选择

全 `Icon` 展示直接点击即可获取 `pa-icon` 所需的 `name` 值

<demo src="./copy.vue" control="false"></demo>
