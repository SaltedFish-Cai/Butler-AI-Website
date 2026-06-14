<template>
  <pa-easy-table :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const columns = [
  { key: "name", label: "姓名" },
  { key: "age", label: "年龄" },
  { key: "city", label: "城市" },
  { key: "phone", label: "手机号" },
  { key: "email", label: "邮箱" },
  { key: "work", label: "工作单位" },
  { key: "address", label: "地址" },
  { key: "remark", label: "备注" }
];

const data = ref([
  { name: "张三", age: 28, city: "北京", phone: "13800000000", email: "zhangsan@example.com", work: "公司A", address: "北京市海淀区", remark: "备注1" },
  { name: "李四", age: 32, city: "上海", phone: "13900000000", email: "lisi@example.com", work: "公司B", address: "上海市浦东新区", remark: "备注2" },
  { name: "王五", age: 24, city: "广州", phone: "13700000000", email: "wangwu@example.com", work: "公司C", address: "广州市天河区", remark: "备注3" }
]);
</script>
