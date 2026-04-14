<template>
  <m-button-v2 is="go" @click="visible = true">显示弹窗</m-button-v2>
  <m-dialog-v2 v-model="visible" title="弹出框Dialog" height="300">
    <template #header>
      <div class="custom-header">自定义 Header</div>
    </template>
    Slot
    <template #footer>自定义 Footer</template>
  </m-dialog-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const visible = ref(false);
</script>

<style scoped>
.custom-header {
  padding: var(--m-size-v2-padding);
  font-weight: bold;
}
</style>
