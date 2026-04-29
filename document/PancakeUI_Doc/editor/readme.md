# Editor 富文本编辑器

## 组件功能展示

<demo src="./base.vue"></demo>

## ComponentProps

| 属性名      | 描述           | 类型                                  | 默认值 |
| ----------- | -------------- | ------------------------------------- | ------ |
| id          | 编辑器 ID      | `string`                              | -      |
| class       | 自定义类名     | `Array<string> \| string`             | -      |
| style       | 自定义样式     | `Record<string, string \| number>`    | -      |
| modelValue  | 绑定值         | `string`                              | -      |
| placeholder | 占位符         | `string`                              | -      |
| exButton    | 外置编辑器按钮 | `Array<ComponentExButton>`            | -      |
| config      | 配置项         | [`ComponentConfig`](#componentconfig) | -      |

## ComponentEmits

| 字段              | 描述           | 回调函数                  |
| ----------------- | -------------- | ------------------------- |
| update:modelValue | 内容更新时触发 | `(value: string) => void` |
| change            | 内容变化时触发 | `(value: string) => void` |

## ComponentExButton

| 属性名   | 描述         | 类型       | 默认值      |
| -------- | ------------ | ---------- | ----------- |
| icon     | 按钮图标名称 | `string`   | -           |
| name     | 按钮显示文本 | `string`   | -           |
| target   | 点击回调函数 | `Function` | -           |
| isActive | 是否激活状态 | `boolean`  | `undefined` |

## ComponentConfig

| 属性名      | 描述         | 类型                                                                | 默认值 |
| ----------- | ------------ | ------------------------------------------------------------------- | ------ |
| uploadImage | 上传图片配置 | [`PaFileType`](/document/PancakeUI_Doc/file/readme.html#pafiletype) | -      |

## ComponentTool

| 属性名     | 描述           | 类型                   | 默认值      |
| ---------- | -------------- | ---------------------- | ----------- |
| command    | 执行命令名称   | `string`               | -           |
| icon       | 工具图标名称   | `string`               | -           |
| title      | 工具提示文本   | `string`               | -           |
| value      | 命令参数值     | `string`               | `undefined` |
| children   | 子工具数组     | `Array<ComponentTool>` | `undefined` |
| isActive   | 是否激活状态   | `boolean`              | `undefined` |
| foreColor  | 前景色值       | `string`               | `undefined` |
| backColor  | 背景色值       | `string`               | `undefined` |
| linkString | 链接地址字符串 | `string`               | `undefined` |

## 使用示例

```vue
<template>
  <pa-editor v-model="content" @change="handleChange" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const content = ref("<p>初始内容</p>");

function handleChange(value: string) {
  console.log("内容变化:", value);
}
</script>
```
