# Tag 标签

`pa-tag` 用于展示一组标签，支持折叠和删除功能。

## 基础使用

展示一组标签，支持删除折叠。

<demo src="./base.vue"></demo>

## 纯展示模式

如果你不希望标签有删除功能，只展示标签，你可以设置 `disabled` 为 `true`。

<demo src="./close.vue"></demo>

## 非折叠模式

如果你不希望标签折叠，你可以设置 `use-collapse` 为 `false`。

<demo src="./collapse.vue"></demo>

## ComponentProps

| 属性名       | 描述             | 类型                                       | 默认值      |
| ------------ | ---------------- | ------------------------------------------ | ----------- |
| id           | 唯一标识         | `string` \| `undefined`                    | `undefined` |
| class        | 自定义类名       | `Array<string>` \| `string` \| `undefined` | `undefined` |
| style        | 自定义样式       | `Record<string, string>` \| `undefined`    | `undefined` |
| tagList      | 标签列表         | `Array<TagType>`                           | -           |
| useCollapse  | 是否折叠         | `boolean`                                  | `true`      |
| popoverWidth | 弹出层宽度       | `number` \| `undefined`                    | `undefined` |
| disabled     | 是否禁用删除功能 | `boolean` \| `undefined`                   | `undefined` |

## ComponentEmits

| 事件名    | 描述           | 回调函数                  |
| --------- | -------------- | ------------------------- |
| removeTag | 删除标签时触发 | `(data: TagType) => void` |
