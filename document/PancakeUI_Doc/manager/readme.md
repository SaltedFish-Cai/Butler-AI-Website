# Manager 全局配置

`pa-manager` 用于配置 Pancake-UI 的全局设置，包括 API 地址、主题、语言等。

## 功能说明

作为全局配置容器，需要在应用根节点使用，为所有 Pancake-UI 组件提供统一的配置。

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| env | 环境标识 | `string` | - |
| baseHost | API 基础 URL | `string` | - |
| themeColor | 主题颜色 | `string` | - |
| isDark | 是否为暗黑模式 | `boolean` | - |
| size | 组件尺寸 | `'small' \| 'default' \| 'large'` | - |
| language | 语言设置 | `'zh-CN' \| 'en-US'` | - |

## 复杂配置

### table_config 表格配置

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| groupAdvancedQueryApi | 高级查询分组 API | `apiType` |
| advancedQueryApi | 高级查询 API | `apiType` |
| useSeniorFilter | 是否启用高级筛选 | `boolean` |
| infiniteScroll | 是否启用无限滚动 | `boolean` |

### address_config 地址配置

地址选择器的数据源 API 配置。

### file_config 文件配置

文件上传、下载相关的 API 配置。

### requestHeader 请求头

自定义请求头配置。

## 使用示例

```vue
<pa-manager
  :base-host="'https://api.example.com'"
  :theme-color="'#409eff'"
  :language="'zh-CN'"
>
  <router-view />
</pa-manager>
```
