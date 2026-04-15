<template>
  <sa-button font="star_arc_line" @click="debouncedClick1">Drawer弹窗</sa-button>

  <sa-drawer
    v-model="drawerVisible"
    :title="{ 'zh-CN': '弹窗', 'en-US': 'Drawer' }"
    :sub-title="{ 'zh-CN': '弹窗副标题', 'en-US': 'Drawer Subtitle' }"
    scroll
    :padding="['all']"
  >
    <div style="height: 1500px">弹窗内容</div>
    <template #footer>
      <sa-button type="primary" @click="drawerVisible = false" is="cancel">关闭</sa-button>
    </template>
  </sa-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const drawerVisible = ref(false);

function debouncedClick1() {
  drawerVisible.value = true;
}
</script>

<style></style>
