<template>
  <iframe
    v-if="textUrl"
    ref="docxRef"
    :src="`https://view.officeapps.live.com/op/embed.aspx?src=${textUrl}`"
    class="word-view-body_pre"
  ></iframe>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = withDefaults(defineProps<{ filePath: string; zoom: number }>(), {});
const textUrl = String(props.filePath);
const docxRef = ref();
</script>
<style lang="scss">
.word-view-body_pre {
  width: 100%;
  min-height: 100%;
}
</style>
