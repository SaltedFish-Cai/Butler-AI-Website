# Development 开发工具

`pa-development` 是开发调试工具组件，用于在开发环境下快速获取组件信息。

## 功能说明

- 右键点击组件可复制组件 ID
- 复制当前组件路径
- 仅在开发环境下使用

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 组件唯一标识 | `string` | `''` |

## 使用示例

```vue
<pa-development id="my-component">
  <!-- 你的组件内容 -->
</pa-development>
```

:::warning 注意
此组件仅用于开发调试，生产环境应移除。
:::
