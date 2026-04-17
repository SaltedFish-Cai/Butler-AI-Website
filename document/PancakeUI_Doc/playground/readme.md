# Playground 可视化配置面板

可视化的配置管理面板，支持动态生成表单、表格、标签页等界面元素，适用于后台管理系统、低代码平台等场景。

## 基础用法

通过 `data` 属性传入配置数据，快速构建可配置的管理界面。

<demo src="./base.vue" ></demo>

## `SaPlaygroundProps`

| 属性名                | 描述           | 类型                                                          | 默认值 |
| --------------------- | -------------- | ------------------------------------------------------------- | ------ |
| id                    | 组件唯一标识   | `string`                                                      | —      |
| class                 | 自定义类名     | `string`                                                      | —      |
| style                 | 自定义样式     | `Record<string, string>`                                      | —      |
| data                  | 配置数据       | `SaPlaygroundType`                                            | `{}`   |
| requestFunction       | 请求函数       | `any`                                                         | —      |
| actionFunction        | 操作函数数组   | `Array<SaOptionType.Select & SaPlaygroundActionFunctionType>` | —      |
| authorizationFunction | 授权函数数组   | `Array<SaStructureType.TableV2>`                              | —      |
| visibleBefore         | 可见性判断函数 | `(data: any) => boolean`                                      | —      |
| actionBefore          | 操作前判断函数 | `(data: any) => boolean`                                      | —      |
