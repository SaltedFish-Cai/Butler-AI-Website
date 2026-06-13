<template>
  <pa-easy-table :columns="columns" :data="data" card />
</template>

<script lang="ts" setup>
const columns = [
  { key: "name", label: "姓名", width: "1fr" },
  { key: "age", label: "年龄", width: "80px" },
  { key: "city", label: "城市", width: "1fr" }
];

const data = [
  { name: "张三", age: 28, city: "北京" },
  { name: "李四", age: 32, city: "上海" },
  { name: "王五", age: 24, city: "广州" }
];
</script>
