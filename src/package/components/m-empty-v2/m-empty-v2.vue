<template>
  <div class="m-empty-v2">
    <div class="m-empty-v2_inner" :class="[props.class]" :style="{ ...props.style }">
      <m-icon-v2 style="font-size: 60px" :name="props.icon" />
      <div style="text-align: center">{{ props.message }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MIconV2Type } from "./type";

// # Var
const props = withDefaults(defineProps<MIconV2Type>(), {
  icon: "dakai",
  message: "暂无数据"
});
</script>

<style lang="scss" scoped>
.m-empty-v2 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: var(--m-size-v2-font, 13px);

  .m-empty-v2_inner {
    width: 113px;
    height: 113px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-top: 35px;
    margin-bottom: 27px;
    background: #f9f8fd;
    border-radius: 50%;
    color: #d8d8d8;
    font-size: var(--m-size-v2-font, 13px);
  }
}
</style>
