<template>
  <sa-dialog
    v-model="visible"
    :title="{ 'en-US': 'Simulated Field Management', 'zh-CN': '模拟场管理' }"
    :padding="['top', 'bottom']"
    size="m"
  >
    <sa-tabs v-model="activeName">
      <!-- 模拟接口 -->
      <sa-tabs-item
        label="{ 'zh-CN': '模拟接口', 'en-US': 'Simulated Interface' }"
        name="Interface"
        class="card_style"
        :padding="['top', 'left', 'right']"
        :scroll="false"
      >
        <simulated-interface
          :id="props.id"
          :playground-items="playgroundItems"
          :interface-configs="interfaceConfigs"
          :data-structures="dataStructures"
        ></simulated-interface>
      </sa-tabs-item>

      <!-- 数据管理 -->
      <sa-tabs-item
        label="{ 'zh-CN': '数据管理', 'en-US': 'Data Management' }"
        name="Data"
        class="card_style"
        :padding="['top', 'left', 'right']"
        :scroll="false"
      >
        <data-management
          :id="props.id"
          :playground-items="playgroundItems"
          :interface-configs="interfaceConfigs"
          :data-structures="dataStructures"
        ></data-management>
      </sa-tabs-item>

      <template #HeaderRight>
        <sa-button is="delete" @click="handleDeleteAll">{{ language === "en-US" ? "Delete All" : "删除所有数据" }}</sa-button>
      </template>
    </sa-tabs>
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { ComputedRef, inject, ref } from "vue";
import { MInterfaceConfig, SaPlaygroundPagesType, MStructureType } from "../type";
import { M_Message, M_MessageBox } from "../../feedback";

import DataManagement from "./simulated-field-components/data-management.vue";
import SimulatedInterface from "./simulated-field-components/simulated-interface.vue";
import { SaltedGlobalConfigType } from "../../sa-content/type";
import { clearAllData } from "../../indexDB/indexDB";

const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const language = SaltedGlobalConfig.value?.language?.value || "zh-CN";

const props = withDefaults(
  defineProps<{
    id: string;
    playgroundItems: SaPlaygroundPagesType[];
    interfaceConfigs: MInterfaceConfig[];
    dataStructures: MStructureType[];
  }>(),
  {}
);

const activeName = ref("Interface");

const visible = ref(false);

function openVisibleDialog() {
  visible.value = true;
}

// 确认删除所有数据
function handleDeleteAll() {
  M_MessageBox.delete({
    onConfirm: async () => {
      try {
        const DB_NAME = "DB_" + props.id;

        const DB_NAME1 = "DB_" + props.id + "_Api";
        const DB_NAME2 = "DB_" + props.id + "_DataMap";
        await clearAllData(DB_NAME, DB_NAME1);
        await clearAllData(DB_NAME, DB_NAME2);
        visible.value = false;
        M_Message.success(language === "en-US" ? "All data deleted successfully" : "所有数据删除成功");
      } catch (error) {
        M_Message.danger(language === "en-US" ? "All data deletion failed" : "所有数据删除失败" + error);
      }
    }
  });
}

defineExpose({
  openVisibleDialog
});
</script>

<style lang="scss" scoped></style>
