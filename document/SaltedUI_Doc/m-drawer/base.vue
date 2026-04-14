<template>
  <m-button-v2 font="star_arc_line" @click="debouncedClick1">Drawer弹窗</m-button-v2>

  <m-drawer-v2
    v-model="drawerVisible"
    :title="{ 'zh-CN': '弹窗', 'en-US': 'Drawer' }"
    :sub-title="{ 'zh-CN': '弹窗副标题', 'en-US': 'Drawer Subtitle' }"
    scroll
    :padding="['all']"
  >
    <div style="height: 1500px">弹窗内容</div>
    <template #footer>
      <m-button-v2 type="primary" @click="drawerVisible = false" is="cancel">关闭</m-button-v2>
    </template>
  </m-drawer-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const drawerVisible = ref(false);

function debouncedClick1() {
  drawerVisible.value = true;
}
</script>

<style></style>
