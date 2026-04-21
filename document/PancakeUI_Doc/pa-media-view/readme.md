# Media View 媒体查看器

`pa-media-view` 用于查看和下载各类媒体文件，包括图片、PDF、Excel、Word、文本等格式。

## 基础使用

<demo src="./base.vue"></demo>

## 支持的文件类型

- 图片：jpg、jpeg、png、gif、bmp、webp、svg
- PDF：pdf
- 文档：doc、docx
- 表格：xls、xlsx
- 文本：txt、json、xml、csv

## Props

| 字段     | 描述             | 类型                           | 默认值 |
| -------- | ---------------- | ------------------------------ | ------ |
| file     | 文件源对象       | `objectType`                   | —      |
| filePath | 文件路径         | `string`                       | —      |
| fileName | 文件名称         | `string`                       | —      |
| OriginalName | 原始文件名    | `string`                       | —      |
| FileName | 文件名           | `string`                       | —      |
| id       | 组件唯一标识     | `string | undefined`          | `undefined` |
