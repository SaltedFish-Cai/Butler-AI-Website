<template>
  <teleport :to="teleportTo || 'body'">
    <transition name="mo-dialog-overlay-fade">
      <div v-show="state.visible" class="m-overlay-v2" :class="props.class" :style="{ ...props.style, zIndex: zIndex }">
        <div class="m-overlay-v2-content" :style="{ opacity: useBlock ? 1 : 0 }" @click="closeOverlay"></div>
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, inject } from "vue";
import { MOverlayV2Type } from "./type";

const props = withDefaults(defineProps<MOverlayV2Type>(), {
  useBlock: true
});
const emits = defineEmits(["update:modelValue", "clickOverlay"]);
const getManagerV2GlobalZIndex = inject("getManagerV2GlobalZIndex") as () => number;
const zIndex = ref(getManagerV2GlobalZIndex());

const state = reactive({
  visible: false
});

// #Function 关闭弹窗回调
function closeMenu() {
  emits("update:modelValue", false);
}

// #Function 关闭弹窗
function closeOverlay() {
  closeMenu();
  emits("clickOverlay");
}

defineExpose({ closeMenu });

watch(
  () => props.modelValue,
  data => {
    state.visible = data;
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
