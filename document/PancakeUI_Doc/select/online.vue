<template>
  <pa-select
    v-model="value2"
    :requestApi="remoteMethodFn"
    type="online-select"
    :title="{ 'en-US': 'Basic Usage', 'zh-CN': '基础使用' }"
  ></pa-select>
</template>

<script lang="ts" setup>
import { PaOptionType } from "@/package/components/manager-type";
import { ref } from "vue";
const value2 = ref(3);

async function remoteMethodFn({ query }): Promise<PaOptionType.SelectList> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { label: `选项${query}-1`, value: 3 },
        { label: `选项${query}-2`, value: 4 }
      ] as PaOptionType.SelectList);
    }, 1000);
  });
}
</script>

<style></style>
