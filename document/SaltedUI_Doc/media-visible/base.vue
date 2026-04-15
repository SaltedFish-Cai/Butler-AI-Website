<template>
  <sa-title :padding="['bottom']">基础使用</sa-title>
  <sa-media-view :file-list="value1"></sa-media-view>

  <sa-title :padding="['bottom']">单文件使用</sa-title>
  <sa-media-view-item :filePath="file.filePath" :fileName="file.fileName" :file="file"></sa-media-view-item>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref([
  {
    fileId: "0000005",
    fileName: "text.txt",
    filePath: "//manager.frontend-m.online/test-file/text.txt"
  },
  {
    fileId: "0000004",
    fileName: "pdf.pdf",
    filePath: "http://manager.frontend-m.online/test-file/pdf.pdf"
  },
  {
    fileId: "0000003",
    fileName: "excel.xlsx",
    filePath: "//manager.frontend-m.online/test-file/excel.xlsx"
  },
  {
    fileId: "0000002",
    fileName: "doc.docx",
    filePath: "//manager.frontend-m.online/test-file/doc.docx"
  },
  {
    fileId: "0000001",
    fileName: "img.png",
    filePath: "//manager.frontend-m.online/test-file/img.jpeg"
  }
]);
// http://view.officeapps.live.com/op/view.aspx?src=//manager.frontend-m.online/test-file/doc.docx
const file = value1.value[0];
</script>

<style></style>
