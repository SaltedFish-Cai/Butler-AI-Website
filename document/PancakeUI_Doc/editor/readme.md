# Editor 编辑器

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaEditorType`

| 字段       | 描述   | 类型                                                                              | 默认值 |
| ---------- | ------ | --------------------------------------------------------------------------------- | ------ |
| modelValue | 绑定值 | `string`                                                                          | —      |
| config     | 配置项 | {uploadImage?: [SaFileType](/document/PancakeUI_Doc/file/readme.html#SaFiletype)} | —      |

## `SaEditorEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |

## Props

| 属性名      | 描述           | 类型                                                                          | 默认值      |
| ----------- | -------------- | ----------------------------------------------------------------------------- | ----------- |
| id          | 编辑器 ID      | `string`                                                                      | - |
| class       | 自定义类名     | `string`                                                                      | - |
| style       | 自定义样式     | `Record<string, string>`                                                      | - |
| placeholder | 占位符         | `string`                                                                      | - |
| exButton    | 外置编辑器按钮 | `Array<{ icon: string; name: string; target: Function; isActive?: boolean }>` | - |
| uploadImage | 上传文件配置   | `PaFileType`                                                                  | - |
| backColor   | 背景颜色       | `string`                                                                      | - |
| foreColor   | 前景颜色       | `string`                                                                      | - |
| isActive    | 是否激活       | `boolean`                                                                     | - |
| linkString  | 链接字符串     | `string`                                                                      | - |
| linkString  | 链接字符串     | `string`                                                                      | - |
