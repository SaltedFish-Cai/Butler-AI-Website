<template>
  <pa-tag :tag-list="tagList" use-collapse />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const tagList = ref([
  { label: "标签一", value: "1" },
  { label: "标签二", value: "2" },
  { label: "标签三", value: "3" },
  { label: "标签四", value: "4" },
  { label: "标签五", value: "5" },
  { label: "标签六", value: "6" }
]);
</script>
