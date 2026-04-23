<template>
  <pa-file v-model="fileList" :fileIncludeType="['png', 'jpeg', 'pdf']" />
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
