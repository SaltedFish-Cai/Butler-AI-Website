<template>
  <sa-title :padding="['bottom']">基础使用</sa-title>
  <sa-file
    v-model="value1"
    :fileIncludeType="['png', 'jpeg']"
    :fileExcludeType="['jpg']"
    :exData="exData"
    :contrastData="value2"
    :downloadTemplate="
      () => {
        M_Message.success('下载模版');
      }
    "
  ></sa-file>

  <sa-title :padding="['bottom']">Display</sa-title>
  <sa-file v-model="value1" :exData="exData" :contrastData="value2" display></sa-file>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { M_Message } from "@/package/components/feedback";

const exData = ref({
  FileTypeCode: "WorkflowApprovalFile"
});
const value1 = ref([
  {
    FileId: "0000001",
    FileName: "baidu.png",
    FileUrl: "//www.baidu.com/img/flexible/logo/pc/result@2.png",
    FullPath: "//www.baidu.com/img/flexible/logo/pc/result@2.png",
    OriginalName: "baidu.png"
  }
]);

const value2 = ref([
  {
    FileId: "000002",
    FileName: "baidu.png",
    FullPath: "//www.baidu.com/img/flexible/logo/pc/result@2.png",
    OriginalName: "baidu.png"
  }
]);
</script>

<style></style>
