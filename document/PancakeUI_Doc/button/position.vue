<template>
  <pa-row>
    <pa-col v-for="item in positions" :key="item">
      <pa-button :iconPosition="item" @click="handleClick">{{ item === 'left' ? '左侧' : '右侧' }}</pa-button>
    </pa-col>
  </pa-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { M_Message } from "PancakeUI";

const positions = ref(["left", "right"] as const);

function handleClick() {
  M_Message.success("点击触发");
}
</script>

<style></style>
