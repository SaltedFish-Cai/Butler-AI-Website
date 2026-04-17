# Editor 编辑器

## 组件功能展示

<demo src="./base.vue" ></demo>

## `SaEditorType`

| 字段       | 描述   | 类型                                                                             | 默认值 |
| ---------- | ------ | -------------------------------------------------------------------------------- | ------ |
| modelValue | 绑定值 | `string`                                                                         | —      |
| config     | 配置项 | {uploadImage?: [SaFileType](/document/PancakeUI_Doc/file/readme.html#SaFiletype)} | —      |

## `SaEditorEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |
