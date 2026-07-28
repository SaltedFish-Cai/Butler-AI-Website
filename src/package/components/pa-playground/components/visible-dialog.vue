<template>
  <pa-dialog v-model="visible" :title="{ 'en-US': 'Preview', 'zh-CN': '预览' }" :padding="['all']" :scroll="false">
    <pa-table
      id="visibleTable"
      v-if="visibleType === 'table'"
      ref="visibleTableRef"
      :structure="tableConfig"
      :request-api="getTableList"
      :exOptions="exOptions"
    >
    </pa-table>

    <pa-form id="visibleForm" v-if="visibleType === 'form'" ref="visibleFormRef" :structure="formConfig" :exOptions="exOptions" />
  </pa-dialog>
</template>

<script lang="tsx" setup>
import { nextTick, ref, useTemplateRef } from "vue";
import { PaOptionType, PaStructureType } from "PancakeType";

const visible = ref(false);
const visibleType = ref<"form" | "table">("table");
const visibleTableRef = useTemplateRef("visibleTableRef");
const visibleFormRef = useTemplateRef("visibleFormRef");
const tableConfig = ref<PaStructureType.Table[]>([]);
const formConfig = ref<PaStructureType.Form[]>([]);
const exOptions = ref<PaOptionType.Default>();

function openVisibleDialog(
  type: "form" | "table",
  config: PaStructureType.Form[] | PaStructureType.Table[],
  options?: PaOptionType.Default
) {
  visibleType.value = type;
  if (type === "table") {
    tableConfig.value = config as PaStructureType.Table[];
  } else {
    formConfig.value = config as PaStructureType.Form[];
  }
  exOptions.value = options;
  visible.value = true;
  if (visibleType.value === "table") {
    nextTick(() => {
      visibleTableRef.value?.getTableList();
    });
  }
}

function getTableList() {
  const dataArray: Record<string, string>[] = [];
  for (let i = 0; i < 10; i++) {
    const data = {};
    for (const item of tableConfig.value) {
      data[String(item.prop)] = "模拟数据" + (i + 1);
    }
    dataArray.push(data);
  }

  return {
    Data: { TotalCount: dataArray.length, List: dataArray },
    Code: 200
  };
}

defineExpose({
  openVisibleDialog
});
</script>

<style lang="scss" scoped></style>
