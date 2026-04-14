<template>
  <sa-title :padding="['bottom']">基础使用</sa-title>
  <sa-select v-model="value1" :exOptions="exOptions"></sa-select>

  <sa-title :padding="['bottom']">Display</sa-title>
  <sa-select v-model="value1" :exOptions="exOptions" display></sa-select>

  <sa-title class="mt10" :padding="['bottom']">异步请求选项</sa-title>
  <sa-select v-model="value2" :requestApi="remoteMethodFn" type="online-select"></sa-select>
</template>

<script lang="ts" setup>
import { MOptionV2Type } from "@/package/components/manager-type";
import { ref } from "vue";
const value1 = ref(1);
const value2 = ref(3);

const exOptions = ref([
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 }
]);

async function remoteMethodFn({ query }): Promise<MOptionV2Type.SelectList> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { label: `选项${query}-1`, value: 3 },
        { label: `选项${query}-2`, value: 4 }
      ] as MOptionV2Type.SelectList);
    }, 1000);
  });
}
</script>

<style></style>
