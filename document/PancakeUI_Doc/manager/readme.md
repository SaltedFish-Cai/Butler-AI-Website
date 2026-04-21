# Manager 全局配置

`pa-manager` 用于配置 Pancake-UI 的全局设置，包括 API 地址、主题、语言等。

## 功能说明

作为全局配置容器，需要在应用根节点使用，为所有 Pancake-UI 组件提供统一的配置。

## Props

| 参数           | 说明           | 类型                                                                                                                      | 默认值      |
| -------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------- |
| env            | 环境标识       | `string`                                                                                                                  | -           |
| baseHost       | API 基础 URL   | `string`                                                                                                                  | -           |
| themeColor     | 主题颜色       | `string`                                                                                                                  | -           |
| isDark         | 是否为暗黑模式 | `boolean`                                                                                                                 | `false`     |
| size           | 组件尺寸       | `'small' \| 'default' \| 'large'`                                                                                         | `'default'` |
| language       | 语言           | `'zh-CN' \| 'en-US'`                                                                                                      | `'zh-CN'`   |
| table_config   | 表格配置       | `TableConfig`                                                                                                             | -           |
| address_config | 地址配置       | `AddressConfig`                                                                                                           | -           |
| file_config    | 文件配置       | [`apiType`](/document/PancakeUI_Doc/manager/readme#apitype-api-配置类型) `& { downloadHose: string; compareKey: string }` | -           |
| requestHeader  | 请求头         | `Record<string, string>`                                                                                                  | -           |

## apiType API 配置类型

| 参数 | 说明     | 类型     |
| ---- | -------- | -------- |
| url  | API URL  | `string` |
| type | API 类型 | `string` |

## TableConfig 表格配置

| 参数                  | 说明             | 类型                                                                                                                                                                                                    |
| --------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| groupAdvancedQueryApi | 高级查询分组 API | [`apiType`](/document/PancakeUI_Doc/manager/readme#apitype-api-配置类型) \| `{ FilterLinkNextType: Array<ConditionalType> }`                                                                            |
| advancedQueryApi      | 高级查询 API     | [`apiType`](/document/PancakeUI_Doc/manager/readme#apitype-api-配置类型) \| `{ ConditionalType: Array<ConditionalType>; SqlJoinType: Array<ConditionalType>; LineConditional: Array<ConditionalType> }` |
| useSeniorFilter       | 是否启用高级筛选 | `boolean`                                                                                                                                                                                               |
| infiniteScroll        | 是否启用无限滚动 | `boolean`                                                                                                                                                                                               |

### ConditionalType 条件类型

| 参数                  | 说明     | 类型     |
| --------------------- | -------- | -------- |
| Value                 | 值       | `string` |
| Description           | 描述     | `string` |
| DictionaryExplanation | 字典解释 | `string` |
| DescriptionEn         | 描述英文 | `string` |

## 使用示例

```vue
<pa-manager v-bind="PancakeUIConfig">
   <router-view />
</pa-manager>

<script setup lang="ts">
const PancakeUIConfig = ref({
  env: "local",
  language: "zh-CN",
  size: "default",
  isDark: false,
  baseHost: "",
  requestHeader: { Authorization: "", Version: 20260101 },
  table_config: {
    groupAdvancedQueryApi: groupAdvancedQueryApi,
    advancedQueryApi: advancedQueryApi,
    useSeniorFilter: true,
    infiniteScroll: true
  },
  address_config: { url: Host + "/Common/GetAllProvinceCityInfo", type: "get" },
  file_config: {
    url: Host + "/UploadFile/UploadFiles",
    type: "post",
    downloadHose: Host + "/UploadFile/getfile?filepath=",
    compareKey: "FileId"
  }
} as PancakeUIType);
</script>
```
