<template>
  <sa-dialog v-model="visible" :title="{ 'en-US': 'Preview', 'zh-CN': '预览' }" :padding="['all']" :scroll="false">
    <sa-table
      id="visibleTable"
      v-if="visibleType === 'table'"
      ref="visibleTableRef"
      :structure="tableConfig"
      :request-api="getTableList"
      :exOptions="exOptions"
    >
    </sa-table>

    <sa-form
      id="visibleForm"
      v-if="visibleType === 'form'"
      ref="visibleFormRef"
      :structure="formConfig"
      :exOptions="exOptions"
    />
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { nextTick, ref, useTemplateRef } from "vue";
import { SaOptionType, SaStructureType } from "M_Types";

const visible = ref(false);
const visibleType = ref<"form" | "table">("table");
const visibleTableRef = useTemplateRef("visibleTableRef");
const visibleFormRef = useTemplateRef("visibleFormRef");
const tableConfig = ref<SaStructureType.TableV2[]>([]);
const formConfig = ref<SaStructureType.FormV2[]>([]);
const exOptions = ref<SaOptionType.Default>();

function openVisibleDialog(
  type: "form" | "table",
  config: SaStructureType.FormV2[] | SaStructureType.TableV2[],
  options?: SaOptionType.Default
) {
  visibleType.value = type;
  if (type === "table") {
    tableConfig.value = config as SaStructureType.TableV2[];
  } else {
    formConfig.value = config as SaStructureType.FormV2[];
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
