<template>
  <pa-file
    v-model="fileList"
    display
    title="附件"
    title-width="80px"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const fileList = ref([
  {
    FileId: "0000001",
    FileName: "example.png",
    FileUrl: "https://via.placeholder.com/150",
    FullPath: "https://via.placeholder.com/150",
    OriginalName: "example.png"
  }
]);
</script>
