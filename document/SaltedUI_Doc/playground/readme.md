# Playground 可视化配置面板

可视化的配置管理面板，支持动态生成表单、表格、标签页等界面元素，适用于后台管理系统、低代码平台等场景。

## 基础用法

通过 `data` 属性传入配置数据，快速构建可配置的管理界面。

<demo src="./base.vue" ></demo>

## 核心概念

### Pages 页面配置

`pagesConfigs` 定义了多个页面，每个页面包含多个配置项：

- `pageId` - 页面唯一标识
- `name` - 页面名称
- `x` / `y` - 页面在画布中的位置
- `itemConfigs` - 页面内的配置项数组

### Item 配置项

每个配置项支持三种类型：

- `form` - 表单类型
- `table` - 表格类型
- `tabs` - 标签页类型

### Interface 接口配置

`interfaceConfigs` 定义了组件需要调用的接口：

- `id` - 接口标识
- `name` - 接口名称
- `apiUrl` - 接口地址
- `apiType` - 请求类型（get/post/put/delete）
- `dataStructure` - 数据结构引用

### DataStructure 数据结构

`dataStructures` 定义了数据字段的配置，包括字段名、标签、类型等。

## 国际化

组件支持多语言配置，通过 `label` 对象定义：

```js
{
  label: {
    "zh-CN": "项目名称",
    "en-US": "Project Name"
  }
}
```
