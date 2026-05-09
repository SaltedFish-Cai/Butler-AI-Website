<template>
  <div class="h400">
    <pa-scrollbar-list ref="todoScrollbarList" :request-api="getTableList">
      <template #default="{ row }">
        <div class="item-box">
          <div>Text:{{ row.Text }}</div>
          <div>Switch:{{ row.Switch }}</div>
        </div>
      </template>
    </pa-scrollbar-list>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { randNum } from "@/package/components/tools/rand-char";

const params = ref({});

const maxLength = 200;
const domeList = Array.from({ length: maxLength }, (_, i) => ({
  Text: `Text-${i + 1}`,
  Select: randNum(1, "1234"),
  Switch: true,
  Number: randNum(Number(randNum(1, "1234")), "0123456789")
}));

async function getTableList(query: any) {
  params.value = query;
  const { PageNum, PageSize } = query.Page;
  const List: any = domeList.slice((PageNum - 1) * PageSize, PageNum * PageSize);
  return new Promise(resolve => {
    resolve({ Data: { TotalCount: domeList.length, List }, Code: 200 });
  });
}
</script>

<style scoped>
.item-box {
  padding: var(--pa-size-padding, 10px);
  border: 1px solid var(--pa-color-border);
  + .item-box {
    margin-top: var(--pa-size-padding);
  }
}
</style>
