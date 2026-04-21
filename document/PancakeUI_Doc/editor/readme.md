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


## Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 编辑器ID | `string` | `undefined` |
| class | 自定义类名 | `string` | `undefined` |
| style | 自定义样式 | `Record<string, string>` | `undefined` |
| placeholder | 占位符 | `string` | `undefined` |
| exButton | 外置编辑器按钮 | `Array<{ icon: string; name: string; target: Function; isActive?: boolean }>` | `undefined` |
| uploadImage | 上传文件配置 | `PaFileType` | `undefined` |
| backColor | 背景颜色 | `string` | `undefined` |
| foreColor | 前景颜色 | `string` | `undefined` |
| isActive | 是否激活 | `boolean` | `undefined` |
| linkString | 链接字符串 | `string` | `undefined` |
| linkString | 链接字符串 | `string` | `undefined` |
