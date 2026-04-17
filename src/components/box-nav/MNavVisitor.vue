<script setup lang="ts">
import { inject, Ref } from "vue";

const DEV = inject("DEV") as Ref<boolean>;
</script>

<template>
  <img
    v-if="!DEV"
    class="visitor"
    src="https://visitor-badge.laobi.icu/badge?page_id=saltedfish-website.index.issue.page&left_color=rgb(0 164 126)&right_color=rgb(60 60 67)"
    onerror="this.style.display='none'"
  />
</template>

<style scoped>
.visitor {
  margin-left: 8px;
}

@media (min-width: 768px) and (max-width: 920px) {
  .visitor {
    display: none;
  }
}
</style>
