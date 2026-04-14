<template>
  <m-button-v2 font="star_arc_line" @click="debouncedClick('top')">顶部弹窗</m-button-v2>
  <m-button-v2 font="star_arc_line" @click="debouncedClick('left')">左侧弹窗</m-button-v2>
  <m-button-v2 font="star_arc_line" @click="debouncedClick('right')">右侧弹窗</m-button-v2>
  <m-button-v2 font="star_arc_line" @click="debouncedClick('bottom')">底部弹窗</m-button-v2>

  <m-drawer-v2
    v-model="drawerVisible"
    :title="{ 'zh-CN': '弹窗', 'en-US': 'Drawer' }"
    :sub-title="{ 'zh-CN': '弹窗副标题', 'en-US': 'Drawer Subtitle' }"
    scroll
    :padding="['all']"
    :position="position"
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
const position = ref("top" as const);

function debouncedClick(value) {
  drawerVisible.value = true;
  position.value = value;
}
</script>

<style></style>
