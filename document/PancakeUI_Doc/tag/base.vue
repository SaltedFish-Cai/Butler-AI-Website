<template>
  <pa-tag :tag-list="tagList" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const tagList = ref([
  { label: "标签一", value: "1" },
  { label: "标签二", value: "2" },
  { label: "标签三", value: "3" }
]);
</script>
