<template>
  相交元素：{{ isIntersectingEl }}
  <m-scrollbar-v2
    style="height: 200px; width: 100%; margin-top: 10px"
    intersectClassName=".intersecting"
    @intersecting="handleIntersecting"
  >
    <div class="intersecting" id="intersecting_1">内容1</div>
    <div style="height: 300px"></div>
    <div class="intersecting" id="intersecting_2">内容2</div>
    <div style="height: 300px"></div>
    <div class="intersecting" id="intersecting_3">内容3</div>
    <div style="height: 300px"></div>
  </m-scrollbar-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const isIntersectingEl = ref<boolean>(false);
function handleIntersecting(ids) {
  isIntersectingEl.value = ids.id;
}
</script>

<style></style>
