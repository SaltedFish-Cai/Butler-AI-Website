<template>
  <sa-button is="go" @click="visible = true">显示弹窗</sa-button>
  <sa-dialog v-model="visible" title="弹出框Dialog" height="300">
    <template #header>
      <div class="custom-header">自定义 Header</div>
    </template>
    Slot
    <template #footer>自定义 Footer</template>
  </sa-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const visible = ref(false);
</script>

<style scoped>
.custom-header {
  padding: var(--sa-size-padding);
  font-weight: bold;
}
</style>
