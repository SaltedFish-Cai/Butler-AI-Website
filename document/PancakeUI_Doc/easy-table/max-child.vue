<template>
  <pa-easy-table :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
const columns = [
  { key: "name", label: "姓名" },
  { key: "tags", label: "标签", maxChild: 3 },
  { key: "city", label: "城市" }
];

const data = [
  { name: "张三", tags: ["标签一", "标签二", "标签三", "标签四", "标签五"], city: "北京" },
  { name: "李四", tags: ["标签一", "标签二"], city: "上海" }
];
</script>
