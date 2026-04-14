# 定制主题

manager-ui 的样式使用了 [Scss](https://www.sass.hk/) 作为开发语言，你可以根据需求进行相应调整。并且提供方法 `setManagerTheme` 用于更换主题颜色，如果只需要变更黑暗或明亮模式，可直接使用 `setManagerThemeDark` 进行设置。

## setManagerTheme 变更主题

```typescript
window.setManagerTheme(color, isDark)
```

### Attribute 属性

| 属性名 | 说明     | 类型    | 默认值    |
| :----- | :------- | :------ | :-------- |
| color  | 主题色   | string  | "#00aa90" |
| isDark | 是否深色 | boolean | false     |


## setManagerThemeDark 变更暗色模式

```typescript
window.setManagerTheme(isDark)
```

### Attribute 属性

| 属性名 | 说明     | 类型    | 默认值 |
| :----- | :------- | :------ | :----- |
| isDark | 是否深色 | boolean | false  |

## Element-UI 主题

你可以使用 [`Element-UI`](https://element-plus.org/zh-CN/guide/theming.html) 的方式变更更多样式元素。
